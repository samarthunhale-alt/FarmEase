import { z } from 'zod';

export const UNITS = ['kg', 'quintal', 'tonne', 'dozen', 'piece', 'litre'];
export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const mobile = z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');
const optionalMobile = z.union([mobile, z.literal('')]).optional();
const image = z
  .string()
  .max(300)
  .refine((v) => /^(\/api\/uploads\/[a-f\d]{24}|https?:\/\/.+)$/i.test(v), 'Invalid image URL');
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72)
  .regex(/[A-Za-z]/, 'Password needs at least one letter')
  .regex(/\d/, 'Password needs at least one number');

export const register = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().toLowerCase().email(),
  password,
  role: z.enum(['farmer', 'buyer']),
  mobile: optionalMobile,
});

export const login = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, 'Password is required'),
});

export const updateMe = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  mobile: optionalMobile,
  address: z.string().trim().max(300).optional(),
});

export const changePassword = z.object({ currentPassword: z.string().min(1), newPassword: password });

export const farmerProfile = z.object({
  mobile: optionalMobile,
  location: z.string().trim().max(120).optional(),
  village: z.string().trim().max(80).optional(),
  district: z.string().trim().max(80).optional(),
  state: z.string().trim().max(80).optional(),
  farmSizeAcres: z.coerce.number().min(0).max(100000).optional(),
  farmDetails: z.string().trim().max(1000).optional(),
  cropsGrown: z.array(z.string().trim().min(1).max(60)).max(30).optional(),
});

const listingBase = {
  name: z.string().trim().min(2).max(100),
  category: objectId,
  quantity: z.coerce.number().min(0),
  unit: z.enum(UNITS),
  location: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).default(''),
  images: z.array(image).max(5).default([]),
  available: z.boolean().default(true),
};
export const product = z.object({ ...listingBase, price: z.coerce.number().min(0) });
export const crop = z.object({
  ...listingBase,
  expectedPrice: z.coerce.number().min(0),
  harvestDate: z.coerce.date(),
});

export const createOrder = z.object({
  items: z.array(z.object({ product: objectId, quantity: z.coerce.number().int().min(1).max(100000) })).min(1).max(50),
  shippingAddress: z.object({
    fullName: z.string().trim().min(2).max(80),
    mobile,
    address: z.string().trim().min(5).max(300),
    village: z.string().trim().max(80).optional().default(''),
    district: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    pincode: z.string().regex(/^\d{6}$/, 'Enter a 6-digit pincode'),
  }),
  notes: z.string().trim().max(300).optional().default(''),
});

export const orderStatus = z.object({
  status: z.enum(ORDER_STATUSES),
  reason: z.string().trim().max(200).optional(),
});

export const category = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(200).optional().default(''),
  isActive: z.boolean().optional(),
});

export const cropInfo = z.object({
  name: z.string().trim().min(2).max(60),
  seasons: z.array(z.string().trim()).min(1),
  soilTypes: z.array(z.string().trim()).min(1),
  cultivation: z.string().trim().min(10).max(1500),
  irrigation: z.string().trim().min(10).max(1000),
  fertilizer: z.string().trim().min(10).max(1000),
});

export const disableListing = z.object({ isDisabled: z.boolean(), reason: z.string().trim().max(200).optional() });
export const userStatus = z.object({ isActive: z.boolean() });
