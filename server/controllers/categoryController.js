import Category from '../models/Category.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' && req.user?.role === 'admin' ? {} : { isActive: true };
  res.json({ success: true, data: await Category.find(filter).sort('name') });
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await Category.create(req.body) });
});

export const update = asyncHandler(async (req, res) => {
  const doc = await Category.findById(req.params.id);
  if (!doc) throw new AppError('Category not found', 404);
  Object.assign(doc, req.body);
  await doc.save();
  res.json({ success: true, data: doc });
});

export const remove = asyncHandler(async (req, res) => {
  if (await Product.exists({ category: req.params.id })) {
    throw new AppError('This category has products. Deactivate it instead of deleting.', 409);
  }
  const doc = await Category.findByIdAndDelete(req.params.id);
  if (!doc) throw new AppError('Category not found', 404);
  res.json({ success: true, message: 'Deleted' });
});
