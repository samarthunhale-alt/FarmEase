import mongoose from 'mongoose';
import { ORDER_STATUSES } from '../utils/schemas.js';

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
    shippingAddress: {
      fullName: String,
      mobile: String,
      address: String,
      village: String,
      district: String,
      state: String,
      pincode: String,
    },
    notes: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
    cancelReason: { type: String, default: '' },
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
