import { messagesService } from '../services/messages.service.js';

export const messagesController = {
  async getConversations(req, res, next) {
    try {
      const conversations = await messagesService.getConversations(req.user.id);
      res.json(conversations);
    } catch (err) {
      next(err);
    }
  },

  async sendMessage(req, res, next) {
    try {
      const { receiverId, text } = req.body;
      const message = await messagesService.sendMessage(req.user.id, receiverId, text);
      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const { partnerId } = req.params;
      await messagesService.markAsRead(req.user.id, partnerId);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
};
