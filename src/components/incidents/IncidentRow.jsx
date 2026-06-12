import React from 'react';

export default function IncidentRow({ incident, onClick }) {
  // Helper lấy màu viền & nền cho Badge Severity
  const getSeverityStyle = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]';
      case 'error': return 'bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]';
      case 'warning': return 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]';
      default: return 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]'; // INFO
    }
  };

  // Helper lấy màu viền & nền cho Badge Status
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-[#fff1f2] text-[#e11d48] border-[#fecdd3]';
      case 'investigating': return 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]';
      case 'resolved': return 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]';
      default: return 'bg-slate-100 text-slate-500 border-slate-200'; // CLOSED
    }
  };

  return (
    <div 
      onClick={() => onClick(incident)}
      className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Badge Severity bên trái */}
        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border mt-0.5 shrink-0 ${getSeverityStyle(incident.severity)}`}>
          {incident.severity}
        </span>
        
        {/* Tiêu đề và Mô tả */}
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
            {incident.title}
          </h4>
          <p className="text-xs font-medium text-slate-500 line-clamp-1 max-w-2xl">
            {incident.description}
          </p>
        </div>
      </div>

      {/* Cụm thông tin bên phải (Hệ thống, Status, Thời gian) */}
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[10px] font-bold px-2 py-1 rounded-md border bg-slate-50 text-slate-500 border-slate-200 uppercase tracking-widest">
          {incident.affectedSystem}
        </span>
        <span className={`text-[10px] font-black px-2 py-1 rounded-md border uppercase tracking-widest ${getStatusStyle(incident.status)}`}>
          {incident.status}
        </span>
        <span className="text-[11px] font-semibold text-slate-400 min-w-[80px] text-right">
          {incident.timeAgo}
        </span>
      </div>
    </div>
  );
}