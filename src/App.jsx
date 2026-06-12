import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang chức năng hiện có
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Kanban from './pages/Kanban';
import Security from './pages/Security';
import Settings from './pages/Settings';
import Chat from './pages/Chat';

// Import 2 trang xác thực vừa tạo
import Login from './pages/Login';
import Register from './pages/Register';

// Import lớp bảo vệ Route
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes: Ai cũng có thể vào được */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes: Bắt buộc đi qua ProtectedRoute để kiểm tra Token */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
        <Route path="/kanban" element={<ProtectedRoute><Kanban /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

        {/* Điều hướng mặc định nếu gõ sai đường link */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;