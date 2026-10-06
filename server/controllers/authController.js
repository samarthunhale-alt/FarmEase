import User from '../models/User.js';
import FarmerProfile from '../models/FarmerProfile.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, mobile } = req.body;
  if (await User.exists({ email })) throw new AppError('An account with this email already exists', 409);
  const user = await User.create({ name, email, password, role, mobile });
  if (role === 'farmer') await FarmerProfile.create({ user: user._id, mobile: mobile || '' });
  res.status(201).json({ success: true, token: signToken(user), user });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) throw new AppError('Incorrect email or password', 401);
  if (!user.isActive) throw new AppError('This account has been disabled. Contact support.', 403);
  user.lastLoginAt = new Date();
  await user.save({ validateModifiedOnly: true });
  res.json({ success: true, token: signToken(user), user });
});

export const me = asyncHandler(async (req, res) => res.json({ success: true, user: req.user }));

// JWTs are stateless: the client discards the token. Endpoint exists for a uniform API.
export const logout = (req, res) => res.json({ success: true, message: 'Logged out' });
