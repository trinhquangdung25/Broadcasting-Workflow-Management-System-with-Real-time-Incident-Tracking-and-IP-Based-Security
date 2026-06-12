import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { name: 'Workflows', path: '/kanban', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/></svg> },
    { name: 'Incidents', path: '/incidents', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>, badge: 2 },
    { name: 'Team Chat', path: '/chat', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { name: 'Security', path: '/security', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { name: 'Settings', path: '/settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  return (
    <div className="min-h-screen flex text-slate-800 antialiased font-sans bg-[#f8f9fc]">
      
      {/* 1. SIDEBAR NAVY */}
      <aside className="w-[240px] bg-[#111827] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-50">
        <div>
          <div className="h-16 flex items-center px-6 gap-3 mb-4">
            <span className="text-[#3b82f6] font-bold text-xl font-mono">((o))</span>
            <span className="text-white font-bold text-2xl tracking-tighter">BCO</span>
          </div>

          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                    isActive ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center italic">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80 flex items-center gap-3 mt-auto mb-2">
          <div className="w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center text-[10px] font-black text-blue-200 border border-blue-500/30">QT</div>
          <div className="truncate">
            <p className="text-[12px] font-bold text-slate-200 leading-tight">Quang Dũng Trịnh</p>
            <p className="text-[10px] text-slate-500 font-medium">admin</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        
        {/* BANNER CRITICAL Ở ĐẦU TRANG */}
        <div className="bg-[#ef4444] text-white px-6 py-2 flex items-center justify-between shadow-lg z-40 sticky top-0">
          <div className="flex items-center gap-3 text-xs font-black tracking-widest uppercase italic">
            <span className="animate-pulse">⚠️</span>
            <span>CRITICAL: Primary Encoder Packet Loss</span>
          </div>
          <button className="opacity-70 hover:opacity-100 text-lg">✕</button>
        </div>

        {/* NỘI DUNG CÁC TRANG CON */}
        <main className="p-8">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}