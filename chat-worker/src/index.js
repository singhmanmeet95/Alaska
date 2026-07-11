import { serve } from '@hono/node-server';
import app from './app.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { pollQueue } from './services/queue.js';
import { PORT } from './config/env.js';

async function startServer() {
  try {
    await connectDB();
    await connectRedis();
    
    // Start polling in the background
    pollQueue();

    console.log(`Chat Worker (Hono) is running on port ${PORT}`);
    serve({
      fetch: app.fetch,
      port: PORT
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
