import React, { useState } from 'react';

const INITIAL_IPS = [
  { id: '1', ip: '10.0.3.25', label: 'Production Office', dept: 'production', active: true },
  { id: '2', ip: '10.0.2.50', label: 'Engineering Workstation A', dept: 'engineering', active: true },
  { id: '3', ip: '192.168.1.200', label: 'Remote VPN - Contractor', dept: 'other', active: false },
  { id: '4', ip: '10.0.1.100', label: 'Master Control Room', dept: 'transmission', active: true },
];

export default function IPWhitelistPanel() {
  const [ips, setIps] = useState(INITIAL_IPS);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [newIp, setNewIp] = useState('192.168.1.1');
  const [newLabel, setNewLabel] = useState('');
  const [newDept, setNewDept] = useState('other');

  const handleDelete = (id) => {
    setIps(prev => prev.filter(ip => ip.id !== id));
  };

  const handleAddIP = (e) => {
    e.preventDefault();
    if (!newIp || !newLabel) return;
    
    const newEntry = {
      id: Date.now().toString(),
      ip: newIp,
      label: newLabel,
      dept: newDept,
      active: true
    };
    setIps([newEntry, ...ips]);
    setIsAdding(false);
    setNewLabel('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800">IP Address Whitelist</h3>
        <button onClick={() => setIsAdding(true)} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors">
          + Add IP
        </button>
      </div>

      <div className="space-y-3">
        {ips.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${item.active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <span className="font-mono font-bold text-slate-700 text-sm">{item.ip}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500">{item.label}</span>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-slate-200 text-slate-600 uppercase tracking-wider w-28 text-center shadow-sm">
                {item.dept}
              </span>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                <button className="text-emerald-500 hover:text-emerald-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL THÊM IP */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Add IP Address</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div className="p-6 pt-2">
              <form id="ip-form" onSubmit={handleAddIP} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">IP Address</label>
                  <input value={newIp} onChange={(e) => setNewIp(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:border-blue-500 outline-none" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Label</label>
                  <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Studio A Control Room" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 outline-none" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Department</label>
                  <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 outline-none">
                    <option value="engineering">engineering</option>
                    <option value="production">production</option>
                    <option value="transmission">transmission</option>
                    <option value="management">management</option>
                    <option value="other">other</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 flex justify-end">
              <button type="submit" form="ip-form" className="bg-[#93c5fd] hover:bg-[#60a5fa] text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors shadow-sm">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}