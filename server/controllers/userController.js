import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const updateMe = asyncHandler(async (req, res) => {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json({ success: true, user: req.user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) throw new AppError('Current password is incorrect', 400);
  user.password = req.body.newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});
