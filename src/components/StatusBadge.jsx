import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function StatusBadge({ status }) {
  // Hàm helper quyết định màu sắc dựa theo status đầu vào của hệ thống
  const getStatusStyles = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'open':
      case 'active':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'investigating':
      case 'pending':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'resolved':
      case 'closed':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      default:
        return 'bg-slate-500 hover:bg-slate-600 text-white';
    }
  };

  // Định dạng lại chuỗi hiển thị chữ đầu viết hoa
  const formatStatus = (text) => {
    if (!text) return 'Unknown';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <Badge className={`${getStatusStyles(status)} font-medium shadow-sm transition-colors duration-200`}>
      {formatStatus(status)}
    </Badge>
  );
}