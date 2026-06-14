import React from 'react';
import { useWorkflows } from '@/lib/WorkflowContext';
import { useIncidents } from '@/lib/IncidentContext';

export default function Dashboard() {
  // Lấy dữ liệu thật từ Context
  const { tasks } = useWorkflows();
  const { incidents } = useIncidents();

  // 1. TÍNH TOÁN STATS CHO WORKFLOWS
  const completedWorkflows = tasks.filter(t => t.status === 'completed').length;
  const activeWorkflows = tasks.length - completedWorkflows;

  // 2. TÍNH TOÁN STATS CHO INCIDENTS
  const openIncidentsCount = incidents.filter(i => i.status?.toLowerCase() === 'open' || i.status?.toLowerCase() === 'investigating').length;
  const criticalCount = incidents.filter(i => i.severity?.toLowerCase() === 'critical' && i.status?.toLowerCase() !== 'closed').length;

  const statsData = [
    { label: 'Active Workflows', value: activeWorkflows, icon: '📈', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: completedWorkflows, icon: '✓', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Open Incidents', value: openIncidentsCount, icon: '⚠️', color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Critical Alerts', value: criticalCount, icon: '🚨', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  // 3. TÍNH TOÁN BIỂU ĐỒ PIPELINE (Lấy cột nhiều task nhất làm mốc 100% chiều cao)
  const getCount = (status) => tasks.filter(t => t.status === status).length;
  const pipelineStats = [
    { label: 'Backlog', count: getCount('backlog') },
    { label: 'Pre-Prod', count: getCount('pre-production') },
    { label: 'In Prod', count: getCount('in-production') },
    { label: 'TX', count: getCount('transmission') },
    { label: 'Post-Prod', count: getCount('post-production') },
    { label: 'Done', count: getCount('completed') }
  ];
  // Tìm cột cao nhất, nếu chưa có task nào thì mặc định là 1 để chia không bị lỗi
  const currentMax = Math.max(...pipelineStats.map(s => s.count));
  const maxTasks = currentMax < 4 ? 4 : currentMax;
  const yAxisTicks = [];
  for (let i = maxTasks; i >= 0; i--) {
    yAxisTicks.push(i);
  }

  const getSeverityStyle = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'bg-red-50 text-red-600 border-red-200';
      case 'error': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      <div className="flex items-end justify-between border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations Hub</h1>
          <p className="text-sm font-medium text-slate-500">Broadcasting workflow overview & system status</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${criticalCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
          {criticalCount > 0 ? 'Pipeline Issues Detected' : 'Systems Online'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-8 h-full">
          <h3 className="text-base font-bold text-slate-900">Workflow Pipeline</h3>
          
          <div className="h-[280px] flex items-end justify-between gap-4 px-4 border-l border-b border-slate-100 relative">
            
            {/* TRỤC Y MỚI: Tự động rải đều số nguyên từ 0 lên, không bao giờ lo lặp số */}
            <div className="absolute left-[-24px] top-0 bottom-0 flex flex-col justify-between text-xs font-semibold text-slate-400/80 py-2 select-none">
              {yAxisTicks.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
            
            {/* CÁC CỘT BIỂU ĐỒ */}
            {pipelineStats.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group relative cursor-pointer">
                
                {/* Tooltip hiển thị số lượng khi di chuột vào cột */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded transition-opacity pointer-events-none z-30 shadow-md">
                  {bar.count} {bar.count === 1 ? 'Task' : 'Tasks'}
                </div>
                
                {/* Thân cột */}
                <div 
                  className="w-full max-w-[44px] bg-[#3b82f6] rounded-t-lg transition-all duration-500 hover:bg-[#2563eb] hover:shadow-[0_4px_12px_rgba(59,130,246,0.2)]" 
                  style={{ height: bar.count > 0 ? `${(bar.count / maxTasks) * 100}%` : '0%' }}
                ></div>
                
                {/* Nhãn trục X dưới chân cột */}
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-700 transition-colors mb-[-28px]">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900">Recent Incidents</h3>
            <button onClick={() => window.location.href = '/incidents'} className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              View All <span>→</span>
            </button>
          </div>
          
          <div className="space-y-5 flex-1">
            {/* Hiển thị 5 sự cố mới nhất */}
            {incidents.slice(0, 5).map((inc, i) => (
              <div key={i} className="flex items-start justify-between gap-3 group">
                <div className="flex gap-3 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border mt-0.5 shrink-0 h-5 ${getSeverityStyle(inc.severity)}`}>
                    {inc.severity}
                  </span>
                  <div className="space-y-0.5 truncate">
                    <p className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors truncate">{inc.title}</p>
                    <p className="text-xs font-medium text-slate-500">{inc.timeAgo} • {inc.affectedSystem}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-50 text-slate-500 border-slate-200 shrink-0 uppercase">
                  {inc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}