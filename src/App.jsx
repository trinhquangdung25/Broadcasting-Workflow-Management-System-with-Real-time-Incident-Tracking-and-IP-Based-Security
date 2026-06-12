import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import cái khung xương Layout có chứa Sidebar
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import các trang
import Dashboard from '@/pages/Dashboard';
import Kanban from '@/pages/Kanban';
import Incidents from '@/pages/Incidents';
import Chat from '@/pages/Chat';
import Security from '@/pages/Security';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Các trang bên ngoài không cần Sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CÁC TRANG BÊN TRONG HỆ THỐNG (Bắt buộc phải bọc bằng thẻ <Layout>) */}
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/kanban" element={<ProtectedRoute><Layout><Kanban /></Layout></ProtectedRoute>} />
        <Route path="/incidents" element={<ProtectedRoute><Layout><Incidents /></Layout></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><Layout><Security /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}