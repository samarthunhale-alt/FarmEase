import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['farmer', 'buyer', 'admin'], required: true, index: true },
    mobile: { type: String, default: '' },
    address: { type: String, default: '', maxlength: 300 },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function hash(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function compare(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
