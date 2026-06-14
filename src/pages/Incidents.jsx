import React, { useState, useMemo } from 'react';
import { useIncidents } from '@/lib/IncidentContext'; // <-- Nối ống dẫn nước từ Context tổng
import IncidentRow from '@/components/incidents/IncidentRow';
import IncidentDialog from '@/components/incidents/IncidentDialog';

export default function Incidents() {
  // Rút toàn bộ dữ liệu và hàm thao tác từ kho tổng thay vì lưu cục bộ
  const { incidents, addIncident, updateIncident, deleteIncident } = useIncidents();
  
  // State quản lý Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State quản lý Popup
  const [editingIncident, setEditingIncident] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Bộ Lọc Thông Minh (Smart Filter) chạy trên mảng incidents thực tế từ Context
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchStatus = statusFilter === 'all' || inc.status === statusFilter;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [incidents, searchQuery, severityFilter, statusFilter]);

  // Hàm tương tác Data: Giờ sẽ gọi thẳng hàm của Context để bơm dữ liệu ngược về kho tổng
  const openEditModal = (inc) => setEditingIncident(inc);
  
  const saveIncident = (updatedData) => {
    updateIncident(updatedData); // Bắn dữ liệu về Context
    setEditingIncident(null);
  };

  const handleDelete = (id) => {
    deleteIncident(id); // Bắn lệnh xóa về Context
    setEditingIncident(null);
  };

  const createIncident = (newData) => {
    addIncident(newData); // Bắn ca mới tạo về Context
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Incident Tracker</h1>
          </div>
          <p className="text-sm font-medium text-slate-500">Real-time incident monitoring & response</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>+</span> Report Incident
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Search incidents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-500 bg-white shadow-sm transition-all" 
          />
        </div>

        {/* Severity Dropdown */}
        <select 
          value={severityFilter} 
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white focus:border-blue-500 outline-none shadow-sm min-w-[140px]"
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

        {/* Status Dropdown */}
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white focus:border-blue-500 outline-none shadow-sm min-w-[140px]"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* INCIDENT LIST */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <p className="text-sm font-semibold text-slate-500">No incidents found matching your criteria.</p>
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <IncidentRow key={inc.id} incident={inc} onClick={openEditModal} />
          ))
        )}
      </div>

      {/* MODALS */}
      {editingIncident && (
        <IncidentDialog 
          mode="edit"
          incident={editingIncident} 
          onClose={() => setEditingIncident(null)}
          onSave={saveIncident}
          onDelete={handleDelete}
        />
      )}

      {isCreating && (
        <IncidentDialog 
          mode="create"
          incident={null} 
          onClose={() => setIsCreating(false)}
          onSave={createIncident}
        />
      )}
    </div>
  );
}