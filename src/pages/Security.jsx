import React, { useState } from 'react';
import IPWhitelistPanel from '@/components/security/IPWhitelistPanel';
import RBACPanel from '@/components/security/RBACPanel';

export default function Security() {
  const [activeTab, setActiveTab] = useState('ip');

  return (
    <div className="space-y-6 pb-10 max-w-[1200px] mx-auto">
      
      {/* HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security Center</h1>
        </div>
        <p className="text-sm font-medium text-slate-500 ml-8">Manage IP filtering and role-based access control</p>
      </div>

      {/* TABS SWITCHER NẰM GỌN GÀNG */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl w-max ml-8">
        <button 
          onClick={() => setActiveTab('ip')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'ip' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          IP Whitelist
        </button>
        <button 
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'rbac' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Access Control
        </button>
      </div>

      {/* RENDER DYNAMIC PANEL DỰA VÀO TAB */}
      <div className="ml-8 mt-6">
        {activeTab === 'ip' ? <IPWhitelistPanel /> : <RBACPanel />}
      </div>

    </div>
  );
}