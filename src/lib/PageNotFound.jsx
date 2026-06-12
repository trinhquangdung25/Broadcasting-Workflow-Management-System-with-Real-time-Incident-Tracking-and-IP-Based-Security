import React from 'react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-3 max-w-md">
        <h1 className="text-6xl font-black text-slate-300">404</h1>
        <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          The operation or system view you are trying to access does not exist or has been moved to another pipeline stage.
        </p>
        <div className="pt-2">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={() => window.location.href = '/'}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}