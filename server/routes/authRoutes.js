import { Router } from 'express';
import * as c from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as s from '../utils/schemas.js';

const r = Router();
r.post('/register', validate(s.register), c.register);
r.post('/login', validate(s.login), c.login);
r.post('/logout', protect, c.logout);
r.get('/me', protect, c.me);
export default r;
