import React, { useState, useMemo } from 'react';
import IncidentRow from '@/components/incidents/IncidentRow';
import IncidentDialog from '@/components/incidents/IncidentDialog';

// Data mẫu khớp 100% với ảnh của Base44
const INITIAL_INCIDENTS = [
  { id: '1', title: 'Primary Encoder Packet Loss', description: 'Intermittent packet loss detected on primary encoder output. Average 2.3% loss over last 15 minutes.', severity: 'critical', status: 'open', affectedSystem: 'encoder', assignee: 'engineer@broadcast.com', timeAgo: '2 months ago' },
  { id: '2', title: 'Network Latency Spike', description: 'Network latency between MCR and TX room exceeded 50ms threshold', severity: 'info', status: 'closed', affectedSystem: 'network', assignee: '', timeAgo: '2 months ago' },
  { id: '3', title: 'Playout Automation Delay', description: 'Playout server showing 200ms delay on scheduled transitions', severity: 'warning', status: 'resolved', affectedSystem: 'playout', assignee: '', timeAgo: '2 months ago' },
  { id: '4', title: 'Audio Dropout on Feed B', description: 'Brief audio dropouts occurring every ~45 seconds on secondary feed', severity: 'error', status: 'investigating', affectedSystem: 'audio feed', assignee: '', timeAgo: '2 months ago' },
  { id: '5', title: 'Storage Array Warning', description: 'RAID controller reporting predicted disk failure on bay 7', severity: 'warning', status: 'open', affectedSystem: 'storage', assignee: '', timeAgo: '2 months ago' },
];

export default function Incidents() {
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  
  // State quản lý Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State quản lý Popup
  const [editingIncident, setEditingIncident] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Bộ Lọc Thông Minh (Smart Filter)
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inc.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchStatus = statusFilter === 'all' || inc.status === statusFilter;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [incidents, searchQuery, severityFilter, statusFilter]);

  // Các hàm tương tác Data
  const openEditModal = (inc) => setEditingIncident(inc);
  
  const saveIncident = (updatedData) => {
    setIncidents(prev => prev.map(i => i.id === updatedData.id ? updatedData : i));
    setEditingIncident(null);
  };

  const deleteIncident = (id) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
    setEditingIncident(null);
  };

  const createIncident = (newData) => {
    const newInc = {
      ...newData,
      id: Date.now().toString(),
      timeAgo: 'Just now'
    };
    // Đẩy sự cố mới lên đầu danh sách
    setIncidents(prev => [newInc, ...prev]);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <svg className="text-[#e11d48]" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
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
          onDelete={deleteIncident}
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