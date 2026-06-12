import express from 'express';
import { createIncident, getIncidents, updateIncident } from '../controllers/incidentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả các đường định tuyến sự cố đều bắt buộc phải đăng nhập (protect)
router.use(protect);

// Vừa lấy danh sách sự cố (ai cũng được xem), vừa tạo sự cố mới (trừ role 'viewer' ra)
router.route('/')
  .get(getIncidents)
  .post(authorize('admin', 'manager', 'engineer', 'operator'), createIncident);

// Cập nhật trạng thái sự cố (Chỉ cho phép Admin, Manager, hoặc Engineer sờ vào)
router.route('/:id')
  .put(authorize('admin', 'manager', 'engineer'), updateIncident);

export default router;