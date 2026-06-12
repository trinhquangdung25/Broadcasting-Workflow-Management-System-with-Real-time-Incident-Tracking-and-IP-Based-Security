import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Hàm tiện ích tự động tạo JWT Token thời hạn 30 ngày
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Kiểm tra xem email đã được đăng ký trong hệ thống chưa
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Tạo user mới (Mật khẩu sẽ tự động hash ở tầng Model User.js)
    const user = await User.create({
      name,
      email,
      password,
      role // Nếu không truyền lên, mặc định sẽ là 'viewer' như ta cấu hình
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Trả token về để frontend lưu vào localStorage
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm user bằng email trong DB
    const user = await User.findOne({ email });

    // So khớp mật khẩu đã mã hóa
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Cần thông qua middleware protect)
export const getUserProfile = async (req, res) => {
  // req.user được nạp từ authMiddleware sau khi giải mã token thành công
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};