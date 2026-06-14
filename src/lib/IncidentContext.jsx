import React, { createContext, useContext, useState } from 'react';

const IncidentContext = createContext();

// Mock data gốc được chuyển về đây quản lý tập trung
const INITIAL_INCIDENTS = [
  { id: '1', title: 'Primary Encoder Packet Loss', description: 'Intermittent packet loss detected on primary encoder output. Average 2.3% loss over last 15 minutes.', severity: 'critical', status: 'open', affectedSystem: 'encoder', assignee: 'engineer@broadcast.com', timeAgo: '2 months ago' },
  { id: '2', title: 'Network Latency Spike', description: 'Network latency between MCR and TX room exceeded 50ms threshold', severity: 'info', status: 'closed', affectedSystem: 'network', assignee: '', timeAgo: '2 months ago' },
  { id: '3', title: 'Playout Automation Delay', description: 'Playout server showing 200ms delay on scheduled transitions', severity: 'warning', status: 'resolved', affectedSystem: 'playout', assignee: '', timeAgo: '2 months ago' },
  { id: '4', title: 'Audio Dropout on Feed B', description: 'Brief audio dropouts occurring every ~45 seconds on secondary feed', severity: 'error', status: 'investigating', affectedSystem: 'audio feed', assignee: '', timeAgo: '2 months ago' },
  { id: '5', title: 'Storage Array Warning', description: 'RAID controller reporting predicted disk failure on bay 7', severity: 'warning', status: 'open', affectedSystem: 'storage', assignee: '', timeAgo: '2 months ago' },
];

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);

  // Các hàm tương tác để các trang con gọi thay đổi dữ liệu xuống DB/State
  const addIncident = (newInc) => {
    setIncidents(prev => [{ ...newInc, id: Date.now().toString(), timeAgo: 'Just now' }, ...prev]);
  };

  const updateIncident = (updatedInc) => {
    setIncidents(prev => prev.map(i => i.id === updatedInc.id ? updatedInc : i));
  };

  const deleteIncident = (id) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident, updateIncident, deleteIncident }}>
      {children}
    </IncidentContext.Provider>
  );
}

export const useIncidents = () => useContext(IncidentContext);