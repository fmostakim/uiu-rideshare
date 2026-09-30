import { store } from '../data/index.js';
import { ApiError } from '../middleware/errorHandler.js';
import { hashPassword, verifyPassword, signToken, verifyToken } from '../utils/crypto.js';

const toPublicUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

export const authService = {
  async login({ studentId, password }) {
    if (!studentId || !password) {
      throw new ApiError(400, 'studentId and password are required');
    }

    const user = await store.findUserByStudentId(String(studentId).trim());

    // Same error for unknown user and wrong password — do not reveal which
    // student IDs exist.
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new ApiError(401, 'Invalid student ID or password');
    }

    return { user: toPublicUser(user), token: signToken(user) };
  },

  async register(payload) {
    const { fullName, studentId, password, role } = payload;

    if (!fullName || !studentId || !password) {
      throw new ApiError(400, 'fullName, studentId and password are required');
    }
    if (typeof password !== 'string' || password.length < 6) {
      throw new ApiError(400, 'Password must be a string of at least 6 characters');
    }

    const normalizedId = String(studentId).trim();
    const existing = await store.findUserByStudentId(normalizedId);
    if (existing) throw new ApiError(409, 'An account with that student ID already exists');

    const user = await store.createUser({
      fullName: String(fullName).trim(),
      studentId: normalizedId,
      email: payload.email ?? '',
      phone: payload.phone ?? '',
      role: role === 'driver' ? 'driver' : 'passenger',
      vehicle: role === 'driver' ? payload.vehicle ?? null : null,
      password: await hashPassword(password),
    });

    return { user: toPublicUser(user), token: signToken(user) };
  },

  async me(token) {
    const decoded = verifyToken(token);
    if (!decoded) throw new ApiError(401, 'Invalid or expired token');

    const user = await store.findUserById(decoded.sub);
    if (!user) throw new ApiError(401, 'Session no longer valid');

    return toPublicUser(user);
  },
};
