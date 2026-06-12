import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Đăng nhập thành công sẽ tự điều hướng về Dashboard nhờ ProtectedRoute
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Toàn bộ màn hình nền xám nhạt, căn giữa khối Login
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md space-y-4">
        
        {/* Khối Card bọc ngoài của Shadcn UI */}
        <Card className="border border-slate-200/80 shadow-xl bg-white rounded-2xl overflow-hidden transition-all duration-300">
          <CardHeader className="space-y-1.5 pt-8 pb-6 bg-slate-900 text-white text-center">
            <CardTitle className="text-2xl font-black tracking-tight uppercase">
              BroadcastHQ
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Sign in to manage workflows and real-time incidents
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Hiển thị thông báo lỗi nếu đăng nhập thất bại */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600 animate-shake">
                  {error}
                </div>
              )}

              {/* Ô nhập Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@broadcasthq.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  required
                />
              </div>

              {/* Ô nhập Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  required
                />
              </div>

              {/* Nút bấm Submit đăng nhập */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-blue-500/10 transition-all active:scale-[0.98] mt-2"
              >
                {loading ? 'Authenticating...' : 'Log In to System'}
              </Button>
            </form>
          </CardContent>

          {/* Phần chân Card điều hướng sang trang Đăng ký */}
          <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-center text-xs text-slate-500">
            Don't have an account?&nbsp;
            <a href="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              Sign up
            </a>
          </CardFooter>
        </Card>
        
        {/* Bản quyền nhỏ dưới chân trang */}
        <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          © 2026 BroadcastHQ Operations Pipeline
        </p>
      </div>
    </div>
  );
}