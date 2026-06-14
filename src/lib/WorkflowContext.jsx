import React, { createContext, useContext, useState } from 'react';

const WorkflowContext = createContext();

// Bốc cái Mock Data từ trang Kanban sang đây để quản lý tập trung
const INITIAL_TASKS = [
  { id: '1', title: 'Graphics Package Update', description: 'Update lower thirds and scoreboards for new season branding', status: 'backlog', priority: 'medium', category: 'graphics', assignee: 'designer', dueDate: '2026-06-15' },
  { id: '2', title: 'Playout Server Migration', description: 'Migrate playout automation to new server cluster', status: 'backlog', priority: 'high', category: 'playout', assignee: 'sysadmin', dueDate: '2026-06-20' },
  { id: '3', title: 'Audio Sync Calibration', description: 'Calibrate audio delay compensation for live transmission', status: 'pre-production', priority: 'critical', category: 'audio', assignee: 'audio', dueDate: '2026-06-12' },
  { id: '4', title: 'Configure Main Encoder Settings', description: 'Set up H.264 encoding parameters for primary broadcast feed', status: 'in-production', priority: 'high', category: 'encoding', assignee: 'engineer', dueDate: '2026-06-13' },
  { id: '5', title: 'Satellite Uplink Test', description: 'Verify signal quality on transponder 4B for weekend coverage', status: 'transmission', priority: 'high', category: 'transmission', assignee: 'tx', dueDate: '2026-06-14' },
];

export function WorkflowProvider({ children }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const addTask = (newTask) => {
    setTasks(prev => [...prev, { ...newTask, id: Date.now().toString() }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <WorkflowContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export const useWorkflows = () => useContext(WorkflowContext);