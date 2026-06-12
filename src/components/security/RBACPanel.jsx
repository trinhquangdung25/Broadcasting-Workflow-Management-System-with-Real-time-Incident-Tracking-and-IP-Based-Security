import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RBACPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersRoles = async () => {
      try {
        // Gọi API lấy danh sách user và quyền hạn từ Backend
        const response = await apiClient.get('/auth/users'); // Hoặc endpoint tương đương của bạn
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching RBAC users data:", error);
        // Mock dữ liệu an toàn phòng trường hợp backend chưa thiết lập xong endpoint này
        setUsers([
          { id: 1, name: 'System Admin', email: 'admin@broadcasthq.com', role: 'admin' },
          { id: 2, name: 'Technical Operator', email: 'operator@broadcasthq.com', role: 'editor' },
          { id: 3, name: 'Content Monitor', email: 'viewer@broadcasthq.com', role: 'viewer' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersRoles();
  }, []);

  // Hàm helper quyết định màu sắc Badge dựa trên vai trò hệ thống
  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': 
        return <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold">Administrator</Badge>;
      case 'editor': 
        return <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Editor / Operator</Badge>;
      default: 
        return <Badge className="bg-slate-500 hover:bg-slate-600 text-white font-semibold">Viewer</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
        <CardDescription>Manage user roles, system access levels, and broadcast operation permissions.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-slate-500 animate-pulse">Loading access control matrix...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm font-medium bg-slate-50/50">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">System Access</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map((user) => (
                  <tr key={user.id || user._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                    </td>
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-600">
                      {user.role?.toLowerCase() === 'admin' && 'Full Access (Read/Write/Delete)'}
                      {user.role?.toLowerCase() === 'editor' && 'Operation Access (Read/Write)'}
                      {user.role?.toLowerCase() !== 'admin' && user.role?.toLowerCase() !== 'editor' && 'Restricted Access (Read Only)'}
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}