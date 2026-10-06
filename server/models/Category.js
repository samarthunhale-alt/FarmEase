import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 60 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, default: '', maxlength: 200 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function slugify(next) {
  if (this.isModified('name')) this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  next();
});

export default mongoose.model('Category', categorySchema);
