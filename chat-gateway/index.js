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

const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();
const subscriber = pubClient.duplicate();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://alaska-69fq.vercel.app",
];

let io;

async function bootstrap() {
  await pubClient.connect();
  await subClient.connect();
  await subscriber.connect();

  io = new Server(httpServer, {
    cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
    adapter: createAdapter(pubClient, subClient)
  });

  io.on('connection', (socket) => {
    console.log('User connected to Gateway:', socket.id);

    socket.on('join_user', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, message } = data;
        if (!senderId || !receiverId || !message) return;

        // Forward to Hono worker
        const response = await axios.post(`${WORKER_URL}/api/messages`, {
          senderId,
          receiverId,
          message
        });

        console.log("Message forwarded to worker:", response.data);
      } catch (err) {
        console.error("Error forwarding message to worker:", err.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from Gateway:', socket.id);
    });
  });

  // Subscribe to Redis Pub/Sub for outgoing messages
  await subscriber.subscribe('chat_messages', (message, channel) => {
    try {
      const data = JSON.parse(message);
      if (io) {
        // Emit to receiver and sender
        io.to(data.receiverId).emit("receive_message", data);
        io.to(data.senderId).emit("message_sent", data);
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
