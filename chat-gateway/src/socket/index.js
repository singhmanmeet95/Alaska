import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient, subscriber } from '../redis.js';
import {
  handleJoinUser,
  handleGetOnlineUsers,
  handleSendMessage,
  handleDisconnect
} from './handlers.js';

export const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    adapter: createAdapter(pubClient, subClient)
  });

  io.on('connection', (socket) => {
    console.log('User connected to Gateway:', socket.id);

    socket.on('join_user', handleJoinUser(io, socket));
    socket.on('get_online_users', handleGetOnlineUsers(pubClient));
    socket.on('send_message', handleSendMessage(socket));
    socket.on('disconnect', handleDisconnect(io, socket));
  });

  // Subscribe to Redis Pub/Sub for outgoing messages
  subscriber.subscribe('chat_messages', (message, channel) => {
    try {
      console.log("Redis published message:", message);
      const data = JSON.parse(message);
      // Emit locally to prevent redis-adapter from broadcasting the message to other nodes again
      io.local.to(String(data.receiverId)).emit("receive_message", data);
      io.local.to(String(data.senderId)).emit("message_sent", data);
    } catch (err) {
      console.error("Error parsing message from redis:", err);
    }
  });

  return io;
};
