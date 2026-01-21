
import React from 'react';
import { AuditReport, RiskLevel } from '../types';
import { Icons } from '../constants';

interface ReportProps {
  report: AuditReport;
}

const getSeverityStyles = (severity: string) => {
  switch (severity.toUpperCase()) {
    case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'MEDIUM': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'LOW': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const AuditReportView: React.FC<ReportProps> = ({ report }) => {
  return (
    <div className="space-y-10 animate-in fade-in zoom-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-3xl font-bold mb-2">Security Audit Report</h2>
          <p className="text-slate-400 max-w-xl leading-relaxed">
            {report.summary}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-3xl border border-slate-800 min-w-[200px]">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Risk Score</span>
          <span className={`text-6xl font-black ${report.overallScore > 80 ? 'text-emerald-500' : report.overallScore > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
            {report.overallScore}
          </span>
          <span className="text-slate-400 text-sm mt-1">out of 100</span>
        </div>
      </header>

      <section>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Icons.Activity /> Strategic Scorecard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {report.metrics.map((metric, i) => (
            <div key={i} className="glass p-5 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 font-bold uppercase mb-3">{metric.category}</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{metric.score}%</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full mb-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${metric.score > 80 ? 'bg-emerald-500' : metric.score > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-rose-400">
          <Icons.Alert /> Critical Vulnerabilities & Findings
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {report.findings.map((finding, i) => (
            <div key={i} className="glass rounded-3xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border ${getSeverityStyles(finding.severity)}`}>
                    {finding.severity}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{finding.category}</span>
                </div>
                <h4 className="text-lg font-bold mb-2">{finding.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {finding.description}
                </p>
              </div>
              <div className="mt-auto bg-slate-900/50 p-6 border-t border-slate-800/50">
                <p className="text-xs font-bold text-emerald-400 uppercase mb-2 flex items-center gap-1">
                  <Icons.Check /> Proposed Fix
                </p>
                <p className="text-slate-300 text-sm italic">
                  &ldquo;{finding.recommendation}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass p-8 rounded-3xl border border-slate-800 bg-blue-600/5">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Icons.ChevronRight /> 90-Day Remediation Roadmap
        </h3>
        <div className="space-y-4">
          {report.roadmap.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-400">{i + 1}</span>
              </div>
              <p className="text-slate-300 pt-1 leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center gap-4 py-8">
        <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all border border-slate-700">
          Download PDF Report
        </button>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20">
          Share with Stakeholders
        </button>
      </div>
    </div>
  );
};

export default AuditReportView;
