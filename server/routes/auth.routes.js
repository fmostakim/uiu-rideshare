import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// POST /api/auth/login    -> { studentId, password }
// POST /api/auth/register -> { fullName, studentId, password, role, ... }
// GET  /api/auth/me       -> requires Authorization: Bearer <token>

router.post('/login', asyncHandler(authController.login));
router.post('/register', asyncHandler(authController.register));
router.get('/me', asyncHandler(authController.me));

export default router;
