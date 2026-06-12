import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/api/apiService';

// Khởi tạo hệ thống Context lưu trạng thái đăng nhập toàn cục
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tự động kiểm tra Token dưới máy xem user đã đăng nhập chưa khi F5 trang
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Xử lý logic gọi API đăng nhập xuống backend
  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
      setUser(response.data.user || response.data);
    }
    return response.data;
  };

  // Xử lý logic xóa sạch dữ liệu khi user bấm đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook dùng chung cho các component con muốn check thông tin đăng nhập
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}