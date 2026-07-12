import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { pubClient } from '../config/redis.js';
import { Chat } from '../../models/Chat.js';
import { REDIS_URL } from '../config/env.js';

// BullMQ requires IORedis connection
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

export function pollQueue() {
  console.log("Started BullMQ worker for chat_ingestion_queue...");
  
  const worker = new Worker('chat_ingestion_queue', async (job) => {
    const data = job.data;
    
    const newChat = new Chat({
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message,
      clientTimestamp: data.clientTimestamp
    });

    // If this fails, BullMQ will automatically retry based on job options
    await newChat.save();

    console.log("Successfully processed and saved message to DB from BullMQ");
  }, { connection, concurrency: 5 });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
  });
}
