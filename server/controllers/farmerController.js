import FarmerProfile from '../models/FarmerProfile.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await FarmerProfile.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id } },
    { upsert: true, new: true }
  );
  res.json({ success: true, data: profile });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await FarmerProfile.findOneAndUpdate({ user: req.user._id }, { $set: req.body }, {
    upsert: true,
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: profile });
});

export const getPublicFarmer = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: 'farmer', isActive: true }).select('name createdAt');
  if (!user) throw new AppError('Farmer not found', 404);
  const profile = await FarmerProfile.findOne({ user: user._id }).select('village district state cropsGrown farmSizeAcres');
  res.json({ success: true, data: { name: user.name, memberSince: user.createdAt, profile } });
});

export const dashboard = asyncHandler(async (req, res) => {
  const farmer = req.user._id;
  const [totalProducts, availableProducts, totalOrders, pendingOrders, completedOrders, revenue, recentOrders] =
    await Promise.all([
      Product.countDocuments({ farmer }),
      Product.countDocuments({ farmer, available: true, isDisabled: false, quantity: { $gt: 0 } }),
      Order.countDocuments({ farmer }),
      Order.countDocuments({ farmer, status: 'pending' }),
      Order.countDocuments({ farmer, status: 'delivered' }),
      Order.aggregate([
        { $match: { farmer, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find({ farmer }).sort('-createdAt').limit(5).populate('buyer', 'name').populate('items'),
    ]);
  res.json({
    success: true,
    data: {
      totalProducts,
      availableProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue: revenue[0]?.total || 0,
      recentOrders,
    },
  });
});
