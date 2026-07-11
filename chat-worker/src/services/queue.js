import { queueClient, pubClient } from '../config/redis.js';
import { Chat } from '../../models/Chat.js';

export async function pollQueue() {
  console.log("Started polling chat_ingestion_queue...");
  while (true) {
    try {
      // brPop blocks until an item is available in the queue (timeout 0 = infinite)
      const result = await queueClient.brPop('chat_ingestion_queue', 0);
      if (result) {
        const { element } = result;
        const data = JSON.parse(element);
        
        const newChat = new Chat({
          senderId: data.senderId,
          receiverId: data.receiverId,
          message: data.message
        });

        await newChat.save();

        // Publish back to Redis so Gateway can emit it via WebSocket (Double Tick)
        const payload = JSON.stringify({
          id: newChat._id,
          senderId: newChat.senderId,
          receiverId: newChat.receiverId,
          message: newChat.message,
          createdAt: newChat.createdAt
        });

        await pubClient.publish('chat_messages', payload);
        console.log("Successfully processed and published message:", payload);
      }
    } catch (err) {
      console.error("Error processing queue message:", err);
      // Brief pause before retrying on error to prevent tight looping
      await new Promise(res => setTimeout(res, 1000));
    }
  }
}
