import { ridesService } from '../services/rides.service.js';

export const ridesController = {
  async list(req, res) {
    const rides = await ridesService.listRides(req.query);
    res.json({ count: rides.length, rides });
  },

  async getOne(req, res) {
    const ride = await ridesService.getRide(req.params.id);
    res.json({ ride });
  },

  async create(req, res) {
    const ride = await ridesService.createRide(req.body, req.user);
    res.status(201).json({ ride });
  },

  async join(req, res) {
    const ride = await ridesService.joinRide(req.params.id, req.user ?? null);
    res.json({ ride });
  },
};
