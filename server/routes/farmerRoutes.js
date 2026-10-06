import { Router } from 'express';
import * as c from '../controllers/farmerController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as s from '../utils/schemas.js';

const r = Router();
r.get('/me', protect, authorize('farmer'), c.getMyProfile);
r.put('/me', protect, authorize('farmer'), validate(s.farmerProfile), c.updateMyProfile);
r.patch('/me', protect, authorize('farmer'), validate(s.farmerProfile), c.updateMyProfile);
r.get('/me/dashboard', protect, authorize('farmer'), c.dashboard);
r.get('/:id', c.getPublicFarmer);
export default r;
