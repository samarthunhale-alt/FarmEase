import mongoose from 'mongoose';
import { UNITS } from '../utils/schemas.js';

const cropSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: UNITS, required: true },
    expectedPrice: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    harvestDate: { type: Date, required: true },
    description: { type: String, default: '', maxlength: 1000 },
    images: [String],
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Crop', cropSchema);
