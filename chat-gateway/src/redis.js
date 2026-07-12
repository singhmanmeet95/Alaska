import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();

pubClient.on('error', (err) => console.error('Redis pubClient Error:', err));
subClient.on('error', (err) => console.error('Redis subClient Error:', err));

export const connectRedis = async () => {
  await pubClient.connect();
  await subClient.connect();
};

export const closeRedis = async () => {
  await pubClient.quit();
  await subClient.quit();
};

export { pubClient, subClient };
