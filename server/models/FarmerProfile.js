import mongoose from 'mongoose';

const farmerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    mobile: { type: String, default: '' },
    location: { type: String, default: '', maxlength: 120 },
    village: { type: String, default: '', maxlength: 80 },
    district: { type: String, default: '', maxlength: 80 },
    state: { type: String, default: '', maxlength: 80 },
    farmSizeAcres: { type: Number, min: 0, default: 0 },
    farmDetails: { type: String, default: '', maxlength: 1000 },
    cropsGrown: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export default mongoose.model('FarmerProfile', farmerProfileSchema);
