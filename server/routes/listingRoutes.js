import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

// Builds the router for products or crops from a controller + zod schema.
export default function listingRouter(ctrl, schema) {
  const r = Router();
  const writers = [protect, authorize('farmer', 'admin')];
  r.get('/', ctrl.list);
  r.get('/mine', protect, authorize('farmer'), ctrl.mine);
  r.get('/mine/:id', protect, authorize('farmer'), ctrl.getMine);
  r.get('/:id', ctrl.getOne);
  r.post('/', protect, authorize('farmer'), validate(schema), ctrl.create);
  r.put('/:id', ...writers, validate(schema.partial()), ctrl.update);
  r.patch('/:id', ...writers, validate(schema.partial()), ctrl.update);
  r.delete('/:id', ...writers, ctrl.remove);
  return r;
}
