import asyncHandler from '../utils/asyncHandler.js';
import { getCurrentWeather } from '../services/weatherService.js';

export const current = asyncHandler(async (req, res) => {
  const city = req.query.city ? String(req.query.city).trim().slice(0, 80) : undefined;
  const data = await getCurrentWeather({ city, lat: req.query.lat, lon: req.query.lon });
  res.json({ success: true, data });
});
