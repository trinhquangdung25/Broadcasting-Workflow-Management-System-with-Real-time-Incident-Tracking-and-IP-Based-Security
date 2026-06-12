import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware bảo vệ đường truyền: Bắt buộc phải đăng nhập mới được đi tiếp
export const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem token có được gửi kèm trong Header (Bearer Token) không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Tách chuỗi lấy mã token nguyên bản
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token bằng chìa khóa bí mật JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ DB dựa trên id trong token (nhưng loại bỏ password ra cho an toàn)
      req.user = await User.findById(decoded.id).select('-password');

      // Cho phép đi tiếp vào Controller xử lý nghiệp vụ
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Nếu không tìm thấy token nào trong header
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token found' });
  }
};

// Middleware phân quyền: Chỉ cho phép các role được chỉ định đi qua
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Nếu user đang đăng nhập có role không nằm trong danh sách cho phép
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user?.role || 'Guest'}) is not allowed to access this resource` 
      });
    }
    // Hợp lệ thì cho qua
    next();
  };
};