import React from 'react';
import TaskCard from './TaskCard'; // Lát nữa file TaskCard này sẽ được quét tới

// Component hiển thị một cột trạng thái trong bảng Kanban (ví dụ: To Do, In Progress...)
export default function KanbanColumn({ title, status, tasks, onEditTask, onDeleteTask }) {
  // Lọc ra các tác vụ thuộc đúng trạng thái của cột này
  const filteredTasks = tasks.filter(task => task.status?.toLowerCase() === status?.toLowerCase());

  // Hàm helper để tạo màu sắc viền trên đầu cột cho chuyên nghiệp
  const getHeaderColor = (colStatus) => {
    switch (colStatus?.toLowerCase()) {
      case 'backlog': return 'border-t-slate-400 bg-slate-100 text-slate-700';
      case 'in_production':
      case 'progress': 
        return 'border-t-amber-500 bg-amber-50 text-amber-800';
      case 'transmission':
      case 'review': 
        return 'border-t-blue-500 bg-blue-50 text-blue-800';
      case 'completed':
      case 'done': 
        return 'border-t-emerald-500 bg-emerald-50 text-emerald-800';
      default: return 'border-t-indigo-500 bg-indigo-50 text-indigo-800';
    }
  };

  return (
    <div className="flex flex-col w-full min-w-[280px] bg-slate-50/80 rounded-xl border border-slate-200/60 shadow-sm max-h-[calc(100vh-220px)]">
      {/* Tiêu đề cột */}
      <div className={`p-3 font-semibold text-sm rounded-t-xl border-t-4 flex items-center justify-between ${getHeaderColor(status)}`}>
        <span>{title}</span>
        <span className="px-2 py-0.5 text-xs bg-white/80 rounded-full font-bold shadow-sm border border-slate-200/40">
          {filteredTasks.length}
        </span>
      </div>

      {/* Vùng chứa các thẻ TaskCard con bên trong cột */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
        {filteredTasks.length === 0 ? (
          <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 font-medium bg-white/40">
            No tasks in this stage
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard 
              key={task._id || task.id} 
              task={task} 
              onEdit={onEditTask} 
              onDelete={onDeleteTask} 
            />
          ))
        )}
      </div>
    </div>
  );
}