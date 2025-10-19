import express from "express";
import {
  getAllChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat,
  getChatsBetweenUsers,
  getChatsByUserId,
} from "../controllers/chatController.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  checkUserOwnership,
  checkChatOwnership,
} from "../middleware/authorization.js";

const router = express.Router();

// GET /api/chats - Get all chats (protected - admin only)
router.get("/", authenticateToken, getAllChats);

// GET /api/chats/:id - Get chat by ID (protected - user can only access their own chats)
router.get("/:id", authenticateToken, checkChatOwnership, getChatById);

// GET /api/chats/user/:userId - Get chats for a specific user (protected - user can only access their own chats)
router.get(
  "/user/:userId",
  authenticateToken,
  checkUserOwnership,
  getChatsByUserId
);

// GET /api/chats/between/:senderId/:receiverId - Get chats between two users (protected - user can only access chats they're involved in)
router.get(
  "/between/:senderId/:receiverId",
  authenticateToken,
  checkChatOwnership,
  getChatsBetweenUsers
);

// POST /api/chats - Create new chat message (protected)
router.post("/", authenticateToken, createChat);

// PUT /api/chats/:id - Update chat message (protected - user can only update their own messages)
router.put("/:id", authenticateToken, checkChatOwnership, updateChat);

// DELETE /api/chats/:id - Delete chat message (protected - user can only delete their own messages)
router.delete("/:id", authenticateToken, checkChatOwnership, deleteChat);

export default router;
