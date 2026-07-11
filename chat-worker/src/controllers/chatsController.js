import { Chat } from '../../models/Chat.js';

export async function getChatsBetween(c) {
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
}
