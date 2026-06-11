import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Đọc cấu hình môi trường
dotenv.config();

// Kết nối cơ sở dữ liệu MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Cấu hình CORS kết nối an toàn với Frontend Vite (Port 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Đọc dữ liệu JSON client gửi lên
app.use(express.json());

// Thiết lập Socket.io thời gian thực
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Lưu biến io vào nội bộ app để sử dụng ở các controller khác
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Device connects to Socket successfully: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Device disconnects to Socket: ${socket.id}`);
  });
});

// API Test trạng thái hệ thống
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'online', message: 'BroadcastHQ Server is ready!' });
});

// Chạy server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server runs on the port: http://localhost:${PORT}`);
});