import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { Chat } from '../models/Chat.js';

dotenv.config();

const app = new Hono();

app.use('*', cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/alaska-chat';
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'default_dev_secret';

// Setup Redis Publisher
const pubClient = createClient({ url: REDIS_URL });

async function connectDatabases() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    
    await pubClient.connect();
    console.log("Connected to Redis for Pub/Sub");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

connectDatabases();

// Health check
app.get('/health', (c) => c.json({ status: 'Worker OK' }));

// ─── INTERNAL SERVICE AUTHENTICATION MIDDLEWARE ───
app.use('/api/messages', async (c, next) => {
  const secret = c.req.header('x-internal-secret');
  if (secret !== INTERNAL_API_KEY) {
    return c.json({ success: false, error: 'Unauthorized: Invalid Service Secret' }, 401);
  }
  await next();
});

// POST /api/messages - Gateway sends messages here
app.post('/api/messages', async (c) => {
  try {
    const body = await c.req.json();
    const { senderId, receiverId, message } = body;

    if (!senderId || !receiverId || !message) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    const newChat = new Chat({
      senderId,
      receiverId,
      message
    });

    await newChat.save();

    // Publish back to Redis so Gateway can emit it via WebSocket
    const payload = JSON.stringify({
      id: newChat._id,
      senderId: newChat.senderId,
      receiverId: newChat.receiverId,
      message: newChat.message,
      createdAt: newChat.createdAt
    });

    await pubClient.publish('chat_messages', payload);

    return c.json({ success: true, data: newChat }, 201);
  } catch (err) {
    console.error("Error processing message:", err);
    return c.json({ success: false, error: err.message }, 500);
  }
});

// GET /api/chats/between/:senderId/:receiverId
app.get('/api/chats/between/:senderId/:receiverId', async (c) => {
  try {
    // Note: If you want to restrict this endpoint to internal use only, 
    // you can apply the same middleware here.
    const { senderId, receiverId } = c.req.param();
    
    const chats = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    return c.json({ success: true, data: chats });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

const port = process.env.PORT || 4002;
console.log(`Chat Worker (Hono) is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
