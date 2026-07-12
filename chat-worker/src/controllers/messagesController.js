import { Chat } from '../../models/Chat.js';
import { pubClient } from '../config/redis.js';

export async function createMessage(req, res) {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
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

    return res.status(201).json({ success: true, data: newChat });
  } catch (err) {
    console.error("Error processing message:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
