import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Image', imageSchema);
