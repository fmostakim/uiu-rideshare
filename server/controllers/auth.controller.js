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
};
