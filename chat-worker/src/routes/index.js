import { Hono } from 'hono';
import { createMessage } from '../controllers/messagesController.js';
import { getChatsBetween } from '../controllers/chatsController.js';
import { internalAuthMiddleware } from '../middlewares/auth.js';

const api = new Hono();

// GET /chats/between/:senderId/:receiverId
api.get('/chats/between/:senderId/:receiverId', getChatsBetween);

// POST /messages
api.use('/messages/*', internalAuthMiddleware);
api.post('/messages', createMessage);

export default api;
