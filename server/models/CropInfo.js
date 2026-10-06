import mongoose from 'mongoose';

const cropInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    seasons: [{ type: String, required: true }],
    soilTypes: [{ type: String, required: true }],
    cultivation: { type: String, required: true },
    irrigation: { type: String, required: true },
    fertilizer: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('CropInfo', cropInfoSchema);
