import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function ProtectedRoute({ children }) {
  // TẠM THỜI BYPASS ĐĂNG NHẬP: Ép hệ thống luôn coi như đã có user admin
  const mockUser = {
    name: "Dubois Trinh (Bypass)",
    email: "admin@bco.com",
    role: "admin"
  };

  // Trả thẳng về giao diện các trang con mà không cần check Token hay điều hướng về /login nữa
  return children;
}