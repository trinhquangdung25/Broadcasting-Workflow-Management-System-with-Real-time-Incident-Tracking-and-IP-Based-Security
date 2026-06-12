import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Kiểm tra xem trong máy đã lưu Token đăng nhập chưa
  const token = localStorage.getItem('token');
  
  // Nếu chưa đăng nhập (không có token), tự động điều hướng về trang Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập hợp lệ, cho phép hiển thị nội dung trang (Dashboard, Incidents...)
  return children;
};

export default ProtectedRoute;