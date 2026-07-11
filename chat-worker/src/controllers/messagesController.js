import { Chat } from '../../models/Chat.js';
import { pubClient } from '../config/redis.js';

export async function createMessage(c) {
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
}
