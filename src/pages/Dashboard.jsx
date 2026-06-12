import React from 'react';

export default function Dashboard() {
  const statsData = [
    { label: 'Active Workflows', value: 5, icon: '📈', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: 1, icon: '✓', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Open Incidents', value: 3, icon: '⚠️', color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Critical Alerts', value: 1, icon: '🚨', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const incidentsData = [
    { title: 'Primary Encoder Packet Loss', type: 'encoder', time: '2 months ago', sev: 'CRITICAL', status: 'OPEN' },
    { title: 'Network Latency Spike', type: 'network', time: '2 months ago', sev: 'INFO', status: 'CLOSED' },
    { title: 'Playout Automation Delay', type: 'playout', time: '2 months ago', sev: 'WARNING', status: 'RESOLVED' },
    { title: 'Audio Dropout on Feed B', type: 'audio feed', time: '2 months ago', sev: 'ERROR', status: 'INVESTIGATING' },
    { title: 'Storage Array Warning', type: 'storage', time: '2 months ago', sev: 'WARNING', status: 'OPEN' },
  ];

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-50 text-red-600 border-red-200';
      case 'ERROR': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'WARNING': return 'bg-amber-50 text-amber-600 border-amber-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER ĐÃ CHUẨN HÓA KÍCH CỠ */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations Hub</h1>
          <p className="text-sm font-medium text-slate-500">Broadcasting workflow overview & system status</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Systems Online
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
            <div className="absolute left-[-24px] top-0 bottom-0 flex flex-col justify-between text-xs font-medium text-slate-400 py-2">
              <span>4</span><span>3</span><span>2</span><span>1</span><span>0</span>
            </div>
            {[
              { label: 'Backlog', h: '50%' }, { label: 'Pre-Prod', h: '25%' }, { label: 'In Prod', h: '50%' },
              { label: 'TX', h: '25%' }, { label: 'Post-Prod', h: '25%' }, { label: 'Done', h: '25%' }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                <div className="w-full max-w-[50px] bg-[#3b82f6] rounded-t-lg transition-all duration-500 hover:bg-[#2563eb]" style={{ height: bar.h }}></div>
                <span className="text-xs font-semibold text-slate-500 mb-[-28px]">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900">Recent Incidents</h3>
            <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors">
              View All <span>→</span>
            </button>
          </div>
          
          <div className="space-y-5 flex-1">
            {incidentsData.map((inc, i) => (
              <div key={i} className="flex items-start justify-between gap-3 group">
                <div className="flex gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border mt-0.5 shrink-0 ${getSeverityStyle(inc.sev)}`}>
                    {inc.sev}
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{inc.title}</p>
                    <p className="text-xs font-medium text-slate-500">{inc.time} • {inc.type}</p>
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