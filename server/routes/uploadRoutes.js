import { Router } from 'express';
import multer from 'multer';
import Image from '../models/Image.js';
import { protect, authorize } from '../middleware/auth.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new AppError('Only JPG, PNG or WebP images are allowed', 400)),
});

const r = Router();
// Images are stored in MongoDB (Render's disk is ephemeral), so uploads survive redeploys.
r.post('/', protect, authorize('farmer', 'admin'), upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Attach an image in the "image" field', 400);
  const img = await Image.create({ data: req.file.buffer, contentType: req.file.mimetype, owner: req.user._id });
  res.status(201).json({ success: true, url: `/api/uploads/${img._id}` });
}));
r.get('/:id', asyncHandler(async (req, res) => {
  const img = await Image.findById(req.params.id);
  if (!img) throw new AppError('Image not found', 404);
  res.set('Content-Type', img.contentType);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(img.data);
}));
export default r;
