import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { escapeRegex, pageResult, parsePaging } from '../utils/filters.js';

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

export const stats = asyncHandler(async (req, res) => {
  const [farmers, buyers, activeUsers, loggedInLast7Days, products, disabledProducts, orders, byStatus, revenue, daily] =
    await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'buyer' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ lastLoginAt: { $gte: daysAgo(7) } }),
      Product.countDocuments(),
      Product.countDocuments({ isDisabled: true }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: daysAgo(7) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
  res.json({
    success: true,
    data: {
      farmers,
      buyers,
      activeUsers,
      loggedInLast7Days,
      products,
      disabledProducts,
      orders,
      ordersByStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
      deliveredRevenue: revenue[0]?.total || 0,
      ordersLast7Days: daily.map((d) => ({ date: d._id, orders: d.orders })),
    },
  });
});

export const reports = asyncHandler(async (req, res) => {
  const since = new Date();
  since.setMonth(since.getMonth() - 5, 1);
  since.setHours(0, 0, 0, 0);
  const [monthly, topProducts] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          orders: { $sum: 1 },
          deliveredRevenue: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$totalAmount', 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    OrderItem.aggregate([
      { $lookup: { from: 'orders', localField: 'order', foreignField: '_id', as: 'o' } },
      { $unwind: '$o' },
      { $match: { 'o.status': { $ne: 'cancelled' } } },
      { $group: { _id: '$name', quantity: { $sum: '$quantity' }, revenue: { $sum: '$subtotal' } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),
  ]);
  res.json({ success: true, data: { monthly, topProducts } });
});

export const listUsers = asyncHandler(async (req, res) => {
  const paging = parsePaging({ ...req.query, limit: req.query.limit || 20 });
  const filter = {};
  if (['farmer', 'buyer', 'admin'].includes(req.query.role)) filter.role = req.query.role;
  if (req.query.search) {
    const r = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
    filter.$or = [{ name: r }, { email: r }];
  }
  const [data, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(paging.skip).limit(paging.limit),
    User.countDocuments(filter),
  ]);
  res.json(pageResult(data, total, paging));
});

export const setUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  if (user.role === 'admin') throw new AppError('Admin accounts cannot be disabled here', 400);
  user.isActive = req.body.isActive;
  await user.save({ validateModifiedOnly: true });
  res.json({ success: true, data: user });
});

export const listProducts = asyncHandler(async (req, res) => {
  const paging = parsePaging({ ...req.query, limit: req.query.limit || 20 });
  const filter = {};
  if (req.query.disabled === 'true') filter.isDisabled = true;
  if (req.query.search) filter.name = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
  const [data, total] = await Promise.all([
    Product.find(filter).populate('farmer', 'name email').populate('category', 'name').sort('-createdAt').skip(paging.skip).limit(paging.limit),
    Product.countDocuments(filter),
  ]);
  res.json(pageResult(data, total, paging));
});

export const disableProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  product.isDisabled = req.body.isDisabled;
  product.disabledReason = req.body.isDisabled ? req.body.reason || 'Removed by admin' : '';
  await product.save();
  res.json({ success: true, data: product });
});

export const listOrders = asyncHandler(async (req, res) => {
  const paging = parsePaging({ ...req.query, limit: req.query.limit || 20 });
  const filter = req.query.status ? { status: req.query.status } : {};
  const [data, total] = await Promise.all([
    Order.find(filter).populate('items').populate('buyer', 'name email').populate('farmer', 'name email').sort('-createdAt').skip(paging.skip).limit(paging.limit),
    Order.countDocuments(filter),
  ]);
  res.json(pageResult(data, total, paging));
});
