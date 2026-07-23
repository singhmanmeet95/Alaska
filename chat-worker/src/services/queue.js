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
          COUNT: 1000
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
            COUNT: 500,
            BLOCK: 2000
          }
        );
      }

      if (response && response.length > 0) {
        const messagesToInsert = [];
        const ackIds = [];

        for (const stream of response) {
          for (const message of stream.messages) {
            const data = JSON.parse(message.message.payload);
            
            messagesToInsert.push({
              senderId: data.senderId,
              receiverId: data.receiverId,
              message: data.message,
              clientTimestamp: data.clientTimestamp,
              createdAt: data.timestamp ? new Date(data.timestamp) : undefined
            });
            
            ackIds.push(message.id);
          }
        }

        if (messagesToInsert.length > 0) {
          // 1. Batch Insert to Database (solves sequential write bottleneck)
          await prisma.chatMessage.createMany({
            data: messagesToInsert,
            skipDuplicates: true // Optional: avoid failing the batch if duplicate clientTimestamp exists
          });

          console.log(`Successfully processed and saved ${messagesToInsert.length} messages to DB in a batch.`);

          // 2. Batch Acknowledge to Redis
          await queueClient.xAck(streamKey, groupName, ackIds);
        }
      }
    } catch (err) {
      console.error("Error processing stream:", err);
      // Basic backoff on error
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}
