import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Client } from '../api/Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer' // Mặc định là viewer như thiết kế
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Gọi API Register xuống server cổng 5001 thông qua Client (Axios)
      const response = await Client.post('/auth/register', formData);
      
      if (response.data && response.data.token) {
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Đăng ký xong, đẩy người dùng vào thẳng Dashboard
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create BCO Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name</label>
              <Input name="name" type="text" placeholder="" required onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Email Address</label>
              <Input name="email" type="email" placeholder="name@bco.com" required onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <Input name="password" type="password" placeholder="" required onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">System Role</label>
              <select 
                name="role" 
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none"
                onChange={handleChange}
                value={formData.role}
              >
                <option value="viewer">Viewer</option>
                <option value="operator">Operator</option>
                <option value="engineer">Engineer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button type="submit" className="w-full mt-2">Sign Up</Button>
          </form>
          <div className="mt-4 text-sm text-center text-slate-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;