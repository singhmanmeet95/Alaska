import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  senderId: { type: String, required: true, index: true },
  receiverId: { type: String, required: true, index: true },
  message: { type: String, required: true },
  clientTimestamp: { type: Number, index: true },
  createdAt: { type: Date, default: Date.now }
});

// Index for getting chats between two users
chatSchema.index({ senderId: 1, receiverId: 1 });

export const Chat = mongoose.model('Chat', chatSchema);
