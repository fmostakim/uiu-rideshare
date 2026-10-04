import { authService } from '../services/auth.service.js';

export const authController = {
  async login(req, res) {
    const result = await authService.login(req.body);
    res.json(result);
  },

  async register(req, res) {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  },

  async me(req, res) {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    const user = await authService.me(token);
    res.json({ user });
  },

  async forgotPassword(req, res) {
    const result = await authService.forgotPassword(req.body.studentId);
    res.json(result);
  },

  async resetPassword(req, res) {
    const result = await authService.resetPassword(req.body);
    res.json(result);
  }
};
