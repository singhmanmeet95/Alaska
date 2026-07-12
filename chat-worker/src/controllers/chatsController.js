import { Chat } from '../../models/Chat.js';

export async function getChatsBetween(req, res) {
  try {
    // Note: If you want to restrict this endpoint to internal use only, 
    // you can apply the same middleware here.
    const { senderId, receiverId } = req.params;
    
    const chats = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    return res.json({ success: true, data: chats });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
