import { Router } from 'express';
import { current } from '../controllers/weatherController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/', protect, current);
export default r;
