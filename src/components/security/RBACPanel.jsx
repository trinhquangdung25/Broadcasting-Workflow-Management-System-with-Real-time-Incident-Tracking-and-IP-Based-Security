import React, { useState } from 'react';

// Bổ sung thêm MANAGER vào định nghĩa Roles
const ROLES_DEF = [
  { id: 'admin', title: 'ADMIN', color: 'text-red-500 bg-red-50 border-red-100', perms: ['Full system access', 'Manage users & roles', 'Security settings', 'All CRUD operations'] },
  { id: 'manager', title: 'MANAGER', color: 'text-purple-600 bg-purple-50 border-purple-100', perms: ['Approve workflows', 'Manage team schedules', 'View all reports', 'Edit incidents'] },
  { id: 'engineer', title: 'ENGINEER', color: 'text-blue-500 bg-blue-50 border-blue-100', perms: ['Create/edit workflows', 'Manage incidents', 'View security logs', 'Team chat'] },
  { id: 'operator', title: 'OPERATOR', color: 'text-amber-500 bg-amber-50 border-amber-100', perms: ['View workflows', 'Report incidents', 'Team chat', 'View dashboards'] },
  { id: 'viewer', title: 'VIEWER', color: 'text-slate-500 bg-slate-50 border-slate-200', perms: ['View-only access', 'Dashboard viewing', 'Read team chat'] },
];

const INITIAL_USERS = [
  { id: 'u1', name: 'Quang Dũng Trịnh', email: 'trinhquangdung01@gmail.com', initials: 'QU', role: 'admin' },
  { id: 'u2', name: 'Sarah Chen', email: 'schen@broadcast.com', initials: 'SC', role: 'manager' },
];

export default function RBACPanel() {
  const [users, setUsers] = useState(INITIAL_USERS);

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  return (
    <div className="space-y-6">
      {/* KHỐI ĐỊNH NGHĨA QUYỀN (THÊM THẺ MANAGER) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {ROLES_DEF.map(role => (
          <div key={role.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <span className={`text-[10px] font-black px-2 py-1 rounded border tracking-wider ${role.color}`}>
              {role.title}
            </span>
            <ul className="mt-4 space-y-2">
              {role.perms.map((perm, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] font-medium text-slate-600">
                  <span className="text-emerald-500 mt-0.5">•</span> {perm}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* KHỐI QUẢN LÝ THÀNH VIÊN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Team Members</h3>
        <div className="space-y-3">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {user.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-xs font-medium text-slate-500">{user.email}</p>
                </div>
              </div>
              
              <select 
                value={user.role} 
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm capitalize cursor-pointer"
              >
                {ROLES_DEF.map(r => (
                  <option key={r.id} value={r.id}>{r.id}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}