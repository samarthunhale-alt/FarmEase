import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { pageResult, parsePaging } from '../utils/filters.js';

const TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};
const round2 = (n) => Math.round(n * 100) / 100;

const restoreStock = async (orderId) => {
  const items = await OrderItem.find({ order: orderId });
  await Promise.all(items.map((i) => Product.updateOne({ _id: i.product }, { $inc: { quantity: i.quantity } })));
};

const populateOrder = (q) =>
  q.populate('items').populate('buyer', 'name email mobile').populate('farmer', 'name');

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, notes } = req.body;
  const wanted = new Map();
  items.forEach((i) => wanted.set(i.product, (wanted.get(i.product) || 0) + i.quantity));

  const products = await Product.find({ _id: { $in: [...wanted.keys()] } });
  if (products.length !== wanted.size) throw new AppError('One or more products no longer exist', 404);
  for (const p of products) {
    const qty = wanted.get(p._id.toString());
    if (!p.available || p.isDisabled || p.quantity < qty) {
      throw new AppError(`"${p.name}" is not available in the requested quantity`, 400);
    }
  }

  // Reserve stock atomically; undo everything on any failure.
  const reserved = [];
  const createdOrders = [];
  const rollback = async () => {
    await Promise.all(reserved.map((r) => Product.updateOne({ _id: r.id }, { $inc: { quantity: r.qty } })));
    await Promise.all(
      createdOrders.map(async (o) => {
        await OrderItem.deleteMany({ order: o._id });
        await Order.deleteOne({ _id: o._id });
      })
    );
  };

  try {
    for (const p of products) {
      const qty = wanted.get(p._id.toString());
      const r = await Product.updateOne(
        { _id: p._id, available: true, isDisabled: false, quantity: { $gte: qty } },
        { $inc: { quantity: -qty } }
      );
      if (r.modifiedCount !== 1) throw new AppError(`"${p.name}" just sold out or changed. Review your cart.`, 409);
      reserved.push({ id: p._id, qty });
    }

    const byFarmer = new Map();
    products.forEach((p) => {
      const k = p.farmer.toString();
      byFarmer.set(k, [...(byFarmer.get(k) || []), p]);
    });

    for (const [farmerId, list] of byFarmer) {
      const lines = list.map((p) => {
        const quantity = wanted.get(p._id.toString());
        return { product: p._id, name: p.name, image: p.images[0] || '', price: p.price, quantity, unit: p.unit, subtotal: round2(p.price * quantity) };
      });
      const order = await Order.create({
        buyer: req.user._id,
        farmer: farmerId,
        totalAmount: round2(lines.reduce((s, l) => s + l.subtotal, 0)),
        shippingAddress,
        notes,
        statusHistory: [{ status: 'pending', by: req.user._id }],
      });
      createdOrders.push(order);
      const docs = await OrderItem.insertMany(lines.map((l) => ({ ...l, order: order._id })));
      order.items = docs.map((d) => d._id);
      await order.save();
    }
  } catch (err) {
    await rollback();
    throw err;
  }

  const data = await populateOrder(Order.find({ _id: { $in: createdOrders.map((o) => o._id) } }).sort('-createdAt'));
  res.status(201).json({ success: true, data });
});

const listFor = (field) =>
  asyncHandler(async (req, res) => {
    const paging = parsePaging(req.query);
    const filter = { [field]: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    const [data, total] = await Promise.all([
      populateOrder(Order.find(filter).sort('-createdAt').skip(paging.skip).limit(paging.limit)),
      Order.countDocuments(filter),
    ]);
    res.json(pageResult(data, total, paging));
  });
export const listMine = listFor('buyer');
export const listForFarmer = listFor('farmer');

export const getOrder = asyncHandler(async (req, res) => {
  const order = await populateOrder(Order.findById(req.params.id));
  if (!order) throw new AppError('Order not found', 404);
  const uid = req.user._id.toString();
  const allowed = req.user.role === 'admin' || order.buyer._id.toString() === uid || order.farmer._id.toString() === uid;
  if (!allowed) throw new AppError('Order not found', 404);
  res.json({ success: true, data: order });
});

async function applyStatus(order, status, userId, reason) {
  if (!TRANSITIONS[order.status].includes(status)) {
    throw new AppError(`Cannot change an order from ${order.status} to ${status}`, 400);
  }
  if (status === 'cancelled') {
    await restoreStock(order._id);
    order.cancelReason = reason || '';
  }
  order.status = status;
  order.statusHistory.push({ status, by: userId });
  await order.save();
}

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const isAdmin = req.user.role === 'admin';
  if (!order || (!isAdmin && order.farmer.toString() !== req.user._id.toString())) throw new AppError('Order not found', 404);
  await applyStatus(order, req.body.status, req.user._id, req.body.reason || (isAdmin ? 'Cancelled by admin' : 'Rejected by farmer'));
  res.json({ success: true, data: await populateOrder(Order.findById(order._id)) });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id });
  if (!order) throw new AppError('Order not found', 404);
  if (order.status !== 'pending') throw new AppError('Only pending orders can be cancelled. Contact the farmer instead.', 400);
  await applyStatus(order, 'cancelled', req.user._id, req.body.reason || 'Cancelled by buyer');
  res.json({ success: true, data: await populateOrder(Order.findById(order._id)) });
});
