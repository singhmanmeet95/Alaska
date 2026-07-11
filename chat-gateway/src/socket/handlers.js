import { pubClient } from '../redis.js';

export const handleJoinUser = (io, socket) => async (userId) => {
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
};

export const handleGetOnlineUsers = (pubClient) => async (callback) => {
  try {
    const users = await pubClient.sMembers('online_users');
    if (typeof callback === 'function') callback(users);
  } catch (err) {
    if (typeof callback === 'function') callback([]);
  }
};

export const handleSendMessage = (socket) => async (data) => {
  try {
    const { senderId, receiverId, message } = data;
    if (!senderId || !receiverId || !message) return;

    const payload = JSON.stringify({
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString()
    });
    
    await pubClient.lPush('chat_ingestion_queue', payload);
    console.log("Message queued for worker processing:", payload);

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
};

export const handleDisconnect = (io, socket) => async () => {
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
};
