import React, { useState, useEffect } from 'react';

export default function IncidentDialog({ incident, onClose, onSave, onDelete, mode = 'edit' }) {
  const [formData, setFormData] = useState(
    incident || {
      title: '',
      description: '',
      severity: 'info',
      status: 'open',
      affectedSystem: 'other',
      assignee: '',
      resolutionNotes: ''
    }
  );

  useEffect(() => {
    if (incident) setFormData({ ...incident });
  }, [incident]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {mode === 'create' ? 'Report Incident' : 'Edit Incident'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="incident-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Incident summary..." className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 outline-none" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed description..." rows="3" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 outline-none resize-none"></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Severity</label>
                <select name="severity" value={formData.severity} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white focus:border-blue-500 outline-none capitalize">
                  <option value="critical">critical</option>
                  <option value="error">error</option>
                  <option value="warning">warning</option>
                  <option value="info">info</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white focus:border-blue-500 outline-none capitalize">
                  <option value="open">open</option>
                  <option value="investigating">investigating</option>
                  <option value="resolved">resolved</option>
                  <option value="closed">closed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Affected System</label>
                <select name="affectedSystem" value={formData.affectedSystem} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 bg-white focus:border-blue-500 outline-none">
                  <option value="video feed">video feed</option>
                  <option value="audio feed">audio feed</option>
                  <option value="encoder">encoder</option>
                  <option value="transmitter">transmitter</option>
                  <option value="playout">playout</option>
                  <option value="network">network</option>
                  <option value="storage">storage</option>
                  <option value="other">other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Assigned To</label>
                <input type="email" name="assignee" value={formData.assignee} onChange={handleChange} placeholder="user@example.com" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">Resolution Notes</label>
              <textarea name="resolutionNotes" value={formData.resolutionNotes || ''} onChange={handleChange} placeholder="How was this resolved?" rows="2" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 outline-none resize-none"></textarea>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          {mode === 'edit' ? (
            <button type="button" onClick={() => onDelete(incident.id)} className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              Delete
            </button>
          ) : <div></div>}
          
          <button type="submit" form="incident-form" className={`${mode === 'create' ? 'bg-[#93c5fd] hover:bg-[#60a5fa]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'} text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors shadow-sm`}>
            {mode === 'create' ? 'Report' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
}