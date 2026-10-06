import mongoose from 'mongoose';
import { UNITS } from '../utils/schemas.js';

const productSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: UNITS, required: true },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 1000 },
    images: [String],
    available: { type: Boolean, default: true },
    isDisabled: { type: Boolean, default: false, index: true },
    disabledReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
