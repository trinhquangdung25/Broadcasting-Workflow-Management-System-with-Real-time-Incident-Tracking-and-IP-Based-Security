import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UserNotRegisteredError({ onBack }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-md space-y-4">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Your account is authenticated, but it has not been registered in the BroadcastHQ access management directory yet. Please contact your system administrator.
        </p>
        <div className="pt-2">
          <Button onClick={onBack} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
}