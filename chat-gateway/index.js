import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const PORT = process.env.PORT || 4001;
const WORKER_URL = process.env.WORKER_URL || 'http://chat-worker:4002';
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'default_dev_secret';

const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();
const subscriber = pubClient.duplicate();

pubClient.on('error', (err) => console.error('Redis pubClient Error:', err));
subClient.on('error', (err) => console.error('Redis subClient Error:', err));
subscriber.on('error', (err) => console.error('Redis subscriber Error:', err));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

let io;

async function bootstrap() {
  await pubClient.connect();
  await subClient.connect();
  await subscriber.connect();

  io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    adapter: createAdapter(pubClient, subClient)
  });

  io.on('connection', (socket) => {
    console.log('User connected to Gateway:', socket.id);

    socket.on('join_user', async (userId) => {
      const uid = String(userId);
      socket.join(uid);
      socket.userId = uid;
      console.log(`User ${userId} joined their room`);
      
      try {
        await pubClient.sAdd('online_users', uid);
        io.emit('user_status', { userId: uid, status: 'online' });
      } catch (err) {
        console.error("Error setting online status:", err);
      }
    });

    socket.on('get_online_users', async (callback) => {
      try {
        const users = await pubClient.sMembers('online_users');
        if (typeof callback === 'function') callback(users);
      } catch (err) {
        if (typeof callback === 'function') callback([]);
      }
    });

    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, message } = data;
        if (!senderId || !receiverId || !message) return;

        // Push to Redis Queue for background processing (Non-blocking)
        const payload = JSON.stringify({
          senderId,
          receiverId,
          message,
          timestamp: new Date().toISOString()
        });
        
        await pubClient.lPush('chat_ingestion_queue', payload);
        console.log("Message queued for worker processing:", payload);

        // Instantly acknowledge back to sender (Single Tick)
        socket.emit("message_sent_ack", { 
          senderId, 
          receiverId, 
          message, 
          status: "queued" 
        });

      } catch (err) {
        console.error("Error queuing message:", err.message);
        socket.emit("error", { message: "Failed to queue message" });
      }
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected from Gateway:', socket.id);
      if (socket.userId) {
        try {
          const sockets = await io.in(socket.userId).fetchSockets();
          if (sockets.length === 0) {
            await pubClient.sRem('online_users', socket.userId);
            io.emit('user_status', { userId: socket.userId, status: 'offline' });
          }
        } catch (err) {
          console.error("Error setting offline status:", err);
        }
      }
    });
  });

  // Subscribe to Redis Pub/Sub for outgoing messages
  await subscriber.subscribe('chat_messages', (message, channel) => {
    try {
      console.log("Redis published message:", message);
      const data = JSON.parse(message);
      if (io) {
        // Emit locally to prevent redis-adapter from broadcasting the message to other nodes again,
        // which would cause duplicate messages if multiple gateway instances are running.
        io.local.to(String(data.receiverId)).emit("receive_message", data);
        io.local.to(String(data.senderId)).emit("message_sent", data);
      }
    } catch (err) {
      console.error("Error parsing message from redis:", err);
    }
  });

  app.get('/health', (req, res) => res.json({ status: 'Gateway OK' }));

  httpServer.listen(PORT, () => {
    console.log(`Chat Gateway running on port ${PORT}`);
  });
}

bootstrap().catch(console.error);
