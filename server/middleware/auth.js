import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new AppError('Authentication required', 401);
  const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('This account no longer exists', 401);
  if (!user.isActive) throw new AppError('This account has been disabled', 403);
  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : next(new AppError('You do not have permission to do this', 403));
