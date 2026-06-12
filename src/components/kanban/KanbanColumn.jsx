import React from 'react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ column, tasks, onDropTask, onTaskClick }) {
  // Cho phép thả thẻ vào cột này
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onDropTask(taskId, column.id);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-shrink-0 w-[300px] flex flex-col bg-[#f8f9fc] rounded-2xl border border-slate-200/60 max-h-full"
    >
      {/* Header Cột */}
      <div className="px-4 py-4 border-b border-slate-200/60 flex items-center justify-between sticky top-0 bg-[#f8f9fc] rounded-t-2xl z-10">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${column.color}`}></span>
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">{column.title}</h3>
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Vùng chứa Thẻ */}
      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
        {tasks.length === 0 ? (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
            <span className="text-xs font-medium text-slate-400">No tasks</span>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))
        )}
      </div>
    </div>
  );
}