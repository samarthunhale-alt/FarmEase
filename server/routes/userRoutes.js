import { Router } from 'express';
import * as c from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as s from '../utils/schemas.js';

const r = Router();
r.use(protect);
r.patch('/me', validate(s.updateMe), c.updateMe);
r.put('/me', validate(s.updateMe), c.updateMe);
r.patch('/me/password', validate(s.changePassword), c.changePassword);
export default r;
