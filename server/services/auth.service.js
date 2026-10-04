import { store } from '../data/index.js';
import { ApiError } from '../middleware/errorHandler.js';
import { hashPassword, verifyPassword, signToken, verifyToken } from '../utils/crypto.js';
import { emailService } from './email.service.js';

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

  async forgotPassword(studentId) {
    if (!studentId) throw new ApiError(400, 'Student ID is required');
    const user = await store.findUserByStudentId(String(studentId).trim());
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the ID exists, an email has been sent.' };
    }
    
    // Fallback to fake email if none provided
    const userEmail = user.email || 'fake@bscse.uiu.ac.bd'; 

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await store.updateUser(user.id || user._id, { otp, otpExpires });

    // Send email
    await emailService.sendOTP(userEmail, otp);

    return { message: 'If the ID exists, an email has been sent.' };
  },

  async resetPassword({ studentId, otp, newPassword }) {
    if (!studentId || !otp || !newPassword) {
      throw new ApiError(400, 'Student ID, OTP, and new password are required');
    }

    const user = await store.findUserByStudentId(String(studentId).trim());
    if (!user) throw new ApiError(400, 'Invalid OTP or Student ID');

    if (!user.otp || user.otp !== String(otp)) {
      throw new ApiError(400, 'Invalid OTP');
    }

    if (Date.now() > user.otpExpires) {
      throw new ApiError(400, 'OTP has expired. Please request a new one.');
    }

    const hashedPassword = await hashPassword(newPassword);

    // Clear OTP and update password
    await store.updateUser(user.id || user._id, { 
      password: hashedPassword,
      otp: null,
      otpExpires: null 
    });

    return { message: 'Password has been reset successfully.' };
  }
};
