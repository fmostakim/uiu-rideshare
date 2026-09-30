import { verifyToken } from '../utils/crypto.js';
import { ApiError } from './errorHandler.js';

const extractToken = (req) => req.headers.authorization?.replace(/^Bearer\s+/i, '') ?? null;

/** Rejects the request unless a valid token is present. */
export function requireAuth(req, res, next) {
  const decoded = verifyToken(extractToken(req));
  if (!decoded) return next(new ApiError(401, 'Authentication required'));

  req.user = { id: decoded.sub, role: decoded.role };
  next();
}

/** Attaches req.user when a token is present, but allows anonymous requests. */
export function optionalAuth(req, res, next) {
  const decoded = verifyToken(extractToken(req));
  if (decoded) req.user = { id: decoded.sub, role: decoded.role };
  next();
}
