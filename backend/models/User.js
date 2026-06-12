import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'engineer', 'operator', 'viewer'],
    default: 'viewer' // Mặc định là viewer để bảo mật hệ thống
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tự động mã hóa mật khẩu trước khi lưu vào MongoDB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Kiểm tra mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;