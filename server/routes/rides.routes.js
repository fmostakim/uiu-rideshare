import { Router } from 'express';
import { ridesController } from '../controllers/rides.controller.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET    /api/rides          -> list rides (supports ?from= &to= &minSeats= &maxPrice=)
// GET    /api/rides/:id      -> single ride
// POST   /api/rides          -> create a ride
// POST   /api/rides/:id/join -> claim a seat (attaches req.user if logged in)

router.get('/', asyncHandler(ridesController.list));
router.get('/:id', asyncHandler(ridesController.getOne));
router.post('/', requireAuth, asyncHandler(ridesController.create));
router.post('/:id/join', requireAuth, asyncHandler(ridesController.join));

export default router;
