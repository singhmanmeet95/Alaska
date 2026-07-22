import { queueClient } from '../config/redis.js';
import { prisma } from '../config/db.js';
import { commandOptions } from 'redis';

export async function pollQueue() {
  const streamKey = 'chat_stream';
  const groupName = 'chat_workers';
  const consumerName = `worker_${process.pid}`;

  console.log("Started Redis Stream consumer for chat_stream...");

  // Try to create the consumer group, ignore if it already exists
  try {
    await queueClient.xGroupCreate(streamKey, groupName, '0', { MKSTREAM: true });
  } catch (err) {
    if (!err.message.includes('BUSYGROUP')) {
      console.error("Failed to create consumer group:", err);
    }
  }

  while (true) {
    try {
      // 1. Read Pending Entries (PEL) first to recover stuck messages
      let response = await queueClient.xReadGroup(
        commandOptions({ isolated: true }),
        groupName,
        consumerName,
        [
          { key: streamKey, id: '0' }
        ],
        {
          COUNT: 10
        }
      );

      // 2. If no pending messages, block and wait for new messages
      if (!response || response.length === 0 || response[0].messages.length === 0) {
        response = await queueClient.xReadGroup(
          commandOptions({ isolated: true }),
          groupName,
          consumerName,
          [
            { key: streamKey, id: '>' }
          ],
          {
            COUNT: 5,
            BLOCK: 2000
          }
        );
      }

      if (response && response.length > 0) {
        for (const stream of response) {
          for (const message of stream.messages) {
            const data = JSON.parse(message.message.payload);

            const newChat = await prisma.chatMessage.create({
              data: {
                senderId: data.senderId,
                receiverId: data.receiverId,
                message: data.message,
                clientTimestamp: data.clientTimestamp,
                createdAt: data.timestamp ? new Date(data.timestamp) : undefined
              }
            });

            console.log("Successfully processed and saved message to DB from Redis Stream");

            // Acknowledge the message so it's removed from pending
            await queueClient.xAck(streamKey, groupName, message.id);
          }
        }
      }
    } catch (err) {
      console.error("Error processing stream:", err);
      // Basic backoff on error
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}
