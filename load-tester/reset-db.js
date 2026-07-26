import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { createClient } from 'redis';

const prisma = new PrismaClient();
const redisClient = createClient({ url: 'redis://localhost:6380' });

async function resetDB() {
  console.log("Resetting database...");
  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "ChatMessage", "User", "Friendship", "TripHistory", "Trip", "Review" CASCADE;`);
    console.log("All tables truncated via fast volume/DB purge.");

    // Clear Redis streams
    await redisClient.connect();
    await redisClient.flushAll();
    console.log("Redis fully flushed (including chat_stream and consumer groups).");
  } catch (error) {
    console.error("Failed to reset database:", error);
  } finally {
    await prisma.$disconnect();
    if (redisClient.isOpen) {
      await redisClient.disconnect();
    }
  }
}

resetDB();
