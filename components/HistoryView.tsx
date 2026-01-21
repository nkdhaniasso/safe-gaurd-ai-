
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { AuditReport } from '../types';

interface HistoryProps {
  onViewReport: (report: AuditReport) => void;
}

const HistoryView: React.FC<HistoryProps> = ({ onViewReport }) => {
  const [history, setHistory] = useState<AuditReport[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('audit_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const deleteReport = (id: string) => {
    const updated = history.filter(r => r.id !== id);
    setHistory(updated);
    localStorage.setItem('audit_history', JSON.stringify(updated));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black">Audit Archives</h2>
          <p className="text-slate-500 text-sm">Review past security assessments and track remediation progress.</p>
        </div>
        <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
          {history.length} Record(s) Encrypted
        </div>
      </header>

      {history.length === 0 ? (
        <div className="glass p-20 rounded-[3rem] border border-slate-800 text-center space-y-4">
          <div className="p-5 bg-slate-900 w-fit mx-auto rounded-full text-slate-600"><Icons.Server /></div>
          <p className="text-slate-400 font-medium">No archived audits found on this node.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((report) => (
            <div key={report.id} className="glass p-6 rounded-[2rem] border border-slate-800 hover:border-blue-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">Audit Node #{report.id.slice(-4)}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(report.timestamp).toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border ${
                  report.overallScore > 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  report.overallScore > 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {report.overallScore}
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-6 leading-relaxed">
                {report.summary}
              </p>

              <div className="flex gap-2">
                <button 
                  onClick={() => onViewReport(report)}
                  className="flex-1 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-[10px] font-bold transition-all uppercase"
                >
                  Decrypt & Load
                </button>
                <button 
                  onClick={() => deleteReport(report.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-rose-950/40 text-slate-600 hover:text-rose-400 rounded-xl transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
