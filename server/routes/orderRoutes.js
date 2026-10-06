import { Router } from 'express';
import * as c from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as s from '../utils/schemas.js';

const r = Router();
r.use(protect);
r.post('/', authorize('buyer'), validate(s.createOrder), c.createOrder);
r.get('/mine', authorize('buyer'), c.listMine);
r.get('/farmer', authorize('farmer'), c.listForFarmer);
r.get('/:id', c.getOrder);
r.patch('/:id/status', authorize('farmer', 'admin'), validate(s.orderStatus), c.updateStatus);
r.patch('/:id/cancel', authorize('buyer'), c.cancelOrder);
export default r;
