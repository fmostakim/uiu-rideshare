import { Router } from 'express';
import { messagesController } from '../controllers/messages.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const messagesRouter = Router();

messagesRouter.use(requireAuth);
messagesRouter.get('/', messagesController.getConversations);
messagesRouter.post('/', messagesController.sendMessage);
messagesRouter.post('/:partnerId/read', messagesController.markAsRead);
