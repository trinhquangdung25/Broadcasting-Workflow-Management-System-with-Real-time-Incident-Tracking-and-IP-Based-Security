import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import các tuyến định tuyến API (Routes)
import authRoutes from './routes/authRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';

// Đọc cấu hình môi trường từ file .env
dotenv.config();

// Kết nối cơ sở dữ liệu MongoDB Local
connectDB();

const app = express();
const httpServer = createServer(app);

// Cấu hình CORS kết nối an toàn với Frontend Vite (Port 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Cho phép Express đọc dữ liệu JSON định dạng từ client gửi lên
app.use(express.json());

// Thiết lập Socket.io phục vụ luồng đẩy thông báo Realtime
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Lưu biến io vào nội bộ app để có thể gọi sử dụng ở các Controller khác
app.set('io', io);

// 🔌 Quản lý các thiết bị kết nối Socket thời gian thực
io.on('connection', (socket) => {
  console.log(`Device connected via Socket: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Device disconnected from Socket: ${socket.id}`);
  });
});

// 🔗 ĐẤU NỐI CÁC ĐƯỜNG DẪN API VÀO HỆ THỐNG ESPRESS
app.use('/api/auth', authRoutes);         // Toàn bộ API đăng nhập/ký sẽ bắt đầu bằng /api/auth
app.use('/api/incidents', incidentRoutes); // Toàn bộ API sự cố sẽ bắt đầu bằng /api/incidents

// API kiểm tra nhanh trạng thái hoạt động của hệ thống
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'online', message: 'BroadcastHQ Server is ready!' });
});

// Khởi chạy hệ thống Server
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`Server runs on the port: http://localhost:${PORT}`);
});