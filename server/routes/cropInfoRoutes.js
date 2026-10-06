import { Router } from 'express';
import * as c from '../controllers/cropInfoController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as s from '../utils/schemas.js';

const r = Router();
r.get('/', c.list);
r.get('/:id', c.getOne);
r.post('/', protect, authorize('admin'), validate(s.cropInfo), c.create);
r.put('/:id', protect, authorize('admin'), validate(s.cropInfo.partial()), c.update);
r.delete('/:id', protect, authorize('admin'), c.remove);
export default r;
