import { tripsService } from '../services/trips.service.js';

export const tripsController = {
  async list(req, res) {
    const trips = await tripsService.listForUser(req.user.id, req.query.status);
    res.json({ count: trips.length, trips });
  },

  async summary(req, res) {
    res.json({ summary: await tripsService.summaryForUser(req.user.id) });
  },

  async cancel(req, res) {
    const trip = await tripsService.cancel(req.user.id, req.params.id);
    res.json({ trip });
  },
};
