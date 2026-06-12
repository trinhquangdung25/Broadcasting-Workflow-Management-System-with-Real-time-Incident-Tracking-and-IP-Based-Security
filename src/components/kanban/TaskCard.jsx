import React from 'react';

export default function TaskCard({ task, onClick }) {
  const handleDragStart = (e) => { e.dataTransfer.setData('taskId', task.id); };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'text-[#e11d48] bg-[#fff1f2] border-[#fecdd3]';
      case 'high': return 'text-[#ea580c] bg-[#fff7ed] border-[#ffedd5]';
      case 'medium': return 'text-[#d97706] bg-[#fffbeb] border-[#fde68a]';
      default: return 'text-[#2563eb] bg-[#eff6ff] border-[#bfdbfe]';
    }
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(task)}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:border-blue-300 group"
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          {task.category}
        </span>
      </div>

      {/* ĐÃ CHUẨN HÓA FONT TITLE VÀ DESC */}
      <h4 className="text-sm font-semibold text-slate-900 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors">
        {task.title}
      </h4>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
        {task.description}
      </p>

      <div className="flex items-center gap-1.5 text-slate-400 border-t border-slate-50 pt-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span className="text-xs font-medium truncate text-slate-500">{task.assignee || 'Unassigned'}</span>
      </div>
    </div>
  );
}