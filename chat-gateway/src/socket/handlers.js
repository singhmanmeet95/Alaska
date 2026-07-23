import { pubClient } from '../redis.js';


export const handleGetOnlineUsers = (pubClient) => async (callback) => {
  try {
    const users = await pubClient.sMembers('online_users');
    if (typeof callback === 'function') callback(users);
  } catch (err) {
    if (typeof callback === 'function') callback([]);
  }
};

export const handleSendMessage = (io, socket) => async (data) => {
  try {
    const { senderId, receiverId, message, clientTimestamp } = data;
    if (!senderId || !receiverId || !message) return;

    const createdAt = new Date().toISOString();

    // 1. Append it to Redis Stream for fast ingestion
    const streamPayload = {
      senderId,
      receiverId,
      message,
      clientTimestamp,
      timestamp: createdAt
    };
    await pubClient.xAdd('chat_stream', '*', { payload: JSON.stringify(streamPayload) });
    console.log("Message ingested to Redis Stream:", message);

    // 2. Emit INSTANTLY for real-time delivery via socket.io (Redis adapter handles broadcasting)
    const payload = {
      id: `temp-pub-${clientTimestamp}`,
      senderId,
      receiverId,
      message,
      clientTimestamp,
      createdAt
    };
    io.to(String(receiverId)).emit("receive_message", payload);
    io.to(String(senderId)).emit("message_sent", payload);

    // 3. Local ACK for frontend
    socket.emit("message_sent_ack", { 
      senderId, 
      receiverId, 
      message,
      clientTimestamp,
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
        // REMOVED GLOBAL BROADCAST: io.emit('user_status', { userId: socket.userId, status: 'offline' });
        // Prevents server crash under heavy disconnect/reconnect load.
      }
    } catch (err) {
      console.error("Error setting offline status:", err);
    }
  }
};
