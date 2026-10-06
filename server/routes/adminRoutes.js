import { Router } from 'express';
import * as c from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as s from '../utils/schemas.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

const r = Router();
r.use(protect, authorize('admin'));
r.get('/stats', c.stats);
r.get('/reports', c.reports);
r.get('/users', c.listUsers);
r.patch('/users/:id/status', validate(s.userStatus), c.setUserStatus);
r.get('/products', c.listProducts);
r.patch('/products/:id/disable', validate(s.disableListing), c.disableProduct);
r.delete('/products/:id', asyncHandler(async (req, res) => {
  if (!(await Product.findByIdAndDelete(req.params.id))) throw new AppError('Product not found', 404);
  res.json({ success: true, message: 'Deleted' });
}));
r.get('/orders', c.listOrders);
export default r;
