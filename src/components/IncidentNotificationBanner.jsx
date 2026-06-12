import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function IncidentNotificationBanner({ activeIncidentsCount, onClose }) {
  if (!activeIncidentsCount || activeIncidentsCount === 0) return null;

  return (
    <div className="bg-rose-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-sm font-medium animate-in fade-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2 mx-auto">
        <AlertCircle className="h-4 w-4 animate-bounce" />
        <span>CRITICAL ALERT: There are {activeIncidentsCount} unresolved broadcast incidents requiring immediate attention.</span>
      </div>
      <button 
        onClick={onClose}
        className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}