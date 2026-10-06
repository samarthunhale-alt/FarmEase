import mongoose from 'mongoose';

export const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function parsePaging(q) {
  const page = Math.max(parseInt(q.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(q.limit, 10) || 12, 1), 50);
  return { page, limit, skip: (page - 1) * limit };
}

export function listingFilter(q, priceField) {
  const f = {};
  if (q.search) {
    const r = new RegExp(escapeRegex(String(q.search).trim()), 'i');
    f.$or = [{ name: r }, { description: r }];
  }
  if (q.category && mongoose.isValidObjectId(q.category)) f.category = q.category;
  if (q.location) f.location = new RegExp(escapeRegex(String(q.location).trim()), 'i');
  const min = Number(q.minPrice);
  const max = Number(q.maxPrice);
  if (q.minPrice !== undefined && q.minPrice !== '' && !Number.isNaN(min)) (f[priceField] ??= {}).$gte = min;
  if (q.maxPrice !== undefined && q.maxPrice !== '' && !Number.isNaN(max)) (f[priceField] ??= {}).$lte = max;
  if (q.available === 'true') {
    f.available = true;
    f.quantity = { $gt: 0 };
  }
  return f;
}

export const sortOption = (s, priceField) =>
  ({ price_asc: { [priceField]: 1 }, price_desc: { [priceField]: -1 }, oldest: { createdAt: 1 } })[s] || { createdAt: -1 };

export const pageResult = (data, total, { page, limit }) => ({
  success: true,
  data,
  pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
});
