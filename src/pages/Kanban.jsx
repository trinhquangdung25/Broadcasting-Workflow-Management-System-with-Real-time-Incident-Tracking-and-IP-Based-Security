import React, { useState } from 'react';
import KanbanColumn from '@/components/kanban/KanbanColumn';
import TaskDialog from '@/components/kanban/TaskDialog';
import { useWorkflows } from '@/lib/WorkflowContext'; // <-- Lấy dữ liệu từ Context

const COLUMNS = [
  { id: 'backlog', title: 'BACKLOG', color: 'bg-slate-500' },
  { id: 'pre-production', title: 'PRE-PRODUCTION', color: 'bg-purple-500' },
  { id: 'in-production', title: 'IN PRODUCTION', color: 'bg-blue-500' },
  { id: 'transmission', title: 'TRANSMISSION', color: 'bg-cyan-500' },
  { id: 'post-production', title: 'POST-PRODUCTION', color: 'bg-yellow-500' },
  { id: 'completed', title: 'COMPLETED', color: 'bg-emerald-500' },
];

export default function Kanban() {
  // Lấy data và các hàm kéo thả từ Context
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useWorkflows();
  
  const [editingTask, setEditingTask] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 

  const handleDropTask = (taskId, newStatus) => moveTask(taskId, newStatus);
  const openEditModal = (task) => setEditingTask(task);
  
  const saveTask = (updatedTask) => {
    updateTask(updatedTask);
    setEditingTask(null);
  };

  const handleDelete = (taskId) => {
    deleteTask(taskId);
    setEditingTask(null);
  };

  const handleCreateTask = (newTaskData) => {
    addTask(newTaskData);
    setIsCreatingTask(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true; 
    const lowerQuery = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      task.category.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-end justify-between border-b border-slate-200 pb-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workflows</h1>
          <p className="text-sm font-medium text-slate-500">Drag tasks across stages to update progress</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-500 bg-white shadow-sm w-64 transition-all" 
            />
          </div>
          <button 
            onClick={() => setIsCreatingTask(true)}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            + New Task
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <div className="flex gap-6 h-full items-start min-w-max">
          {COLUMNS.map(col => (
            <KanbanColumn 
              key={col.id} 
              column={col} 
              tasks={filteredTasks.filter(t => t.status === col.id)} 
              onDropTask={handleDropTask}
              onTaskClick={openEditModal}
            />
          ))}
        </div>
      </div>

      {editingTask && (
        <TaskDialog 
          mode="edit"
          task={editingTask} 
          onClose={() => setEditingTask(null)}
          onSave={saveTask}
          onDelete={handleDelete}
        />
      )}

      {isCreatingTask && (
        <TaskDialog 
          mode="create"
          task={null} 
          onClose={() => setIsCreatingTask(false)}
          onSave={handleCreateTask}
        />
      )}
    </div>
  );
}