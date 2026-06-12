import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Đường dẫn: /api/auth/register
router.post('/register', registerUser);

// Đường dẫn: /api/auth/login
router.post('/login', loginUser);

// Đường dẫn: /api/auth/profile (Bắt buộc đi qua lớp protect để check token)
router.get('/profile', protect, getUserProfile);

export default router;