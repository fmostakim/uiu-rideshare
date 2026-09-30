import { Router } from 'express';
import { tripsController } from '../controllers/trips.controller.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// All trip routes are scoped to the signed-in user.
router.use(requireAuth);

// GET  /api/trips?status=upcoming -> the user's trips
// GET  /api/trips/summary         -> stats for the bento block
// POST /api/trips/:id/cancel      -> cancel an upcoming trip
router.get('/', asyncHandler(tripsController.list));
router.get('/summary', asyncHandler(tripsController.summary));
router.post('/:id/cancel', asyncHandler(tripsController.cancel));

export default router;
