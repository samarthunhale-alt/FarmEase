import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import * as c from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as s from '../utils/schemas.js';

// Optional auth: lets an admin pass ?all=true to see inactive categories.
const optionalAuth = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (h?.startsWith('Bearer ')) {
      const d = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
      req.user = await User.findById(d.id);
    }
  } catch { /* ignore invalid token on public route */ }
  next();
};

const r = Router();
r.get('/', optionalAuth, c.list);
r.post('/', protect, authorize('admin'), validate(s.category), c.create);
r.put('/:id', protect, authorize('admin'), validate(s.category.partial()), c.update);
r.delete('/:id', protect, authorize('admin'), c.remove);
export default r;
