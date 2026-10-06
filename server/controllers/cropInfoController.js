import CropInfo from '../models/CropInfo.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { escapeRegex } from '../utils/filters.js';

export const list = asyncHandler(async (req, res) => {
  const f = {};
  if (req.query.search) f.name = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
  if (req.query.season) f.seasons = new RegExp(`^${escapeRegex(String(req.query.season))}$`, 'i');
  res.json({ success: true, data: await CropInfo.find(f).sort('name') });
});

export const getOne = asyncHandler(async (req, res) => {
  const doc = await CropInfo.findById(req.params.id);
  if (!doc) throw new AppError('Crop information not found', 404);
  res.json({ success: true, data: doc });
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await CropInfo.create(req.body) });
});

export const update = asyncHandler(async (req, res) => {
  const doc = await CropInfo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) throw new AppError('Crop information not found', 404);
  res.json({ success: true, data: doc });
});

export const remove = asyncHandler(async (req, res) => {
  if (!(await CropInfo.findByIdAndDelete(req.params.id))) throw new AppError('Crop information not found', 404);
  res.json({ success: true, message: 'Deleted' });
});
