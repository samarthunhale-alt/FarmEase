import Category from '../models/Category.js';
import FarmerProfile from '../models/FarmerProfile.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { listingFilter, pageResult, parsePaging, sortOption } from '../utils/filters.js';

// Shared CRUD for Product and Crop (both are farmer-owned listings).
export function makeListingController(Model, { priceField, isProduct }) {
  const populate = [
    { path: 'category', select: 'name slug' },
    { path: 'farmer', select: 'name' },
  ];
  const ownerQuery = (req) => ({ _id: req.params.id, ...(req.user.role === 'admin' ? {} : { farmer: req.user._id }) });
  const ensureCategory = async (id) => {
    if (id && !(await Category.exists({ _id: id, isActive: true }))) throw new AppError('Selected category does not exist', 400);
  };

  return {
    list: asyncHandler(async (req, res) => {
      const paging = parsePaging(req.query);
      const filter = listingFilter(req.query, priceField);
      if (isProduct) filter.isDisabled = false;
      const [data, total] = await Promise.all([
        Model.find(filter)
          .populate(populate)
          .sort(sortOption(req.query.sort, priceField))
          .skip(paging.skip)
          .limit(paging.limit),
        Model.countDocuments(filter),
      ]);
      res.json(pageResult(data, total, paging));
    }),

    mine: asyncHandler(async (req, res) => {
      const data = await Model.find({ farmer: req.user._id }).populate('category', 'name').sort('-createdAt');
      res.json({ success: true, data });
    }),

    getMine: asyncHandler(async (req, res) => {
      const doc = await Model.findOne({ _id: req.params.id, farmer: req.user._id });
      if (!doc) throw new AppError('Listing not found', 404);
      res.json({ success: true, data: doc });
    }),

    getOne: asyncHandler(async (req, res) => {
      const doc = await Model.findOne({ _id: req.params.id, ...(isProduct ? { isDisabled: false } : {}) }).populate(populate);
      if (!doc) throw new AppError('Listing not found', 404);
      const farmerProfile = await FarmerProfile.findOne({ user: doc.farmer._id }).select('village district state');
      res.json({ success: true, data: { ...doc.toObject(), farmerProfile } });
    }),

    create: asyncHandler(async (req, res) => {
      await ensureCategory(req.body.category);
      const doc = await Model.create({ ...req.body, farmer: req.user._id });
      res.status(201).json({ success: true, data: doc });
    }),

    update: asyncHandler(async (req, res) => {
      await ensureCategory(req.body.category);
      const doc = await Model.findOne(ownerQuery(req));
      if (!doc) throw new AppError('Listing not found', 404);
      Object.assign(doc, req.body);
      await doc.save();
      res.json({ success: true, data: doc });
    }),

    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findOneAndDelete(ownerQuery(req));
      if (!doc) throw new AppError('Listing not found', 404);
      res.json({ success: true, message: 'Deleted' });
    }),
  };
}
