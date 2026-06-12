import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Component hiển thị một thẻ công việc nhỏ bên trong cột Kanban
export default function TaskCard({ task, onEdit, onDelete }) {
  
  // Hàm helper quyết định màu sắc dựa theo mức độ ưu tiên (Priority)
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return <Badge className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] px-1.5 py-0">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] px-1.5 py-0">Medium</Badge>;
      default:
        return <Badge className="bg-sky-500 hover:bg-sky-600 text-white text-[10px] px-1.5 py-0">Low</Badge>;
    }
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 group transition-all duration-200 space-y-3">
      {/* Phần trên cùng: Phòng ban và Độ ưu tiên */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 max-w-[120px] truncate">
          {task.department || 'General'}
        </span>
        {getPriorityBadge(task.priority)}
      </div>

      {/* Phần thân: Tiêu đề và Mô tả */}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {task.title}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Phần chân: Các nút điều hướng ẩn, chỉ hiện khi hover */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => onEdit(task)}
        >
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(task._id || task.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}