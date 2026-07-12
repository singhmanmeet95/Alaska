import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null });

export const chatQueue = new Queue('chat_ingestion_queue', { connection });
