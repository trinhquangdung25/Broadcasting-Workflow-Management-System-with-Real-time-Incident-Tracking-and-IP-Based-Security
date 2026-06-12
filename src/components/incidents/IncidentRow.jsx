import React from 'react';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';

// Component hiển thị một dòng dữ liệu sự cố trong bảng (Table Row)
export default function IncidentRow({ incident, onEdit, onDelete }) {
  // Hàm helper định dạng lại ngày tháng hiển thị cho đẹp
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150">
      <td className="p-4 text-sm font-medium text-slate-900 max-w-[200px] truncate">
        {incident.title}
      </td>
      <td className="p-4 text-sm text-slate-500 max-w-[300px] truncate">
        {incident.description || 'No description available'}
      </td>
      <td className="p-4 text-sm text-slate-600 capitalize">
        {incident.department || 'N/A'}
      </td>
      <td className="p-4">
        {/* Tái sử dụng component StatusBadge chúng ta vừa viết code ở bước trước */}
        <StatusBadge status={incident.status || 'open'} />
      </td>
      <td className="p-4 text-sm text-slate-500">
        {formatDate(incident.createdAt || incident.timestamp)}
      </td>
      <td className="p-4 text-right space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-blue-600 border-blue-100 hover:bg-blue-50"
          onClick={() => onEdit(incident)}
        >
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(incident._id || incident.id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}