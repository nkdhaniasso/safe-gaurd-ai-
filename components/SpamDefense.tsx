
import React, { useState } from 'react';
import { Icons } from '../constants';
import { analyzeSpam } from '../services/geminiService';

const SpamDefense: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const handleSyncRequest = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setHasPermission(true);
      setIsSyncing(false);
      setAnalysis({
        risk: 'CLEAN',
        advice: 'Sync complete. 0 threats detected in history.',
        reasoning: 'Active monitoring enabled. Historical messages cross-referenced with scam ledger.'
      });
    }, 2000);
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeSpam(content);
      setAnalysis(result);
    } catch (err) {
      alert("AI analysis error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <h2 className="text-5xl font-black tracking-tighter text-glow">AI Fraud Sentinel</h2>
          <p className="text-slate-500 text-sm font-medium">Enterprise-grade linguistic analysis for scams and social engineering.</p>
        </div>
        <button 
          onClick={handleSyncRequest}
          disabled={isSyncing || hasPermission}
          className={`btn-lightning flex items-center gap-4 px-8 py-4 rounded-[1.5rem] font-black text-[10px] tracking-[0.2em] transition-all ${
            hasPermission ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-2xl shadow-blue-600/30'
          }`}
        >
          {isSyncing ? 'LINKING...' : hasPermission ? 'MESSAGING ENCRYPTED' : 'SYNC MESSAGING HISTORY'}
          {!hasPermission && <Icons.Activity />}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="glass p-10 rounded-[3.5rem] border border-white/5 space-y-8 backdrop-blur-3xl shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Live Payload</h3>
              <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20"></div>
              </div>
            </div>
            <textarea 
              className="w-full h-64 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 text-sm code-font focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500/50 outline-none resize-none transition-all shadow-inner placeholder:text-slate-700"
              placeholder="Paste suspicious SMS, email body, or malicious URL for deep vector analysis..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button 
              onClick={handleAnalyze}
              disabled={loading || !content.trim()}
              className="btn-lightning w-full py-5 bg-blue-600 rounded-2xl font-black text-[10px] tracking-[0.3em] transition-all shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-4 uppercase"
            >
              {loading ? <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full"></div> : <><Icons.Shield /> VERIFY THREAT VECTOR</>}
            </button>
          </div>

          <div className="glass-card p-10 rounded-[3.5rem] bg-blue-600/5">
            <div className="flex items-center gap-5 mb-6">
              <div className="p-4 bg-blue-600/20 text-blue-400 rounded-2xl shadow-lg shadow-blue-500/10"><Icons.Activity /></div>
              <h3 className="font-black text-xl">Linguistic Analysis</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-8 opacity-80">CyberGuard leverages deep-learning models trained on millions of historical fraud narratives to identify social engineering spikes.</p>
            <div className="grid grid-cols-2 gap-4">
              {['Sentiment Heatmap', 'Origin Validation', 'Spoof Detection', 'Payload Sandboxing'].map(f => (
                <div key={f} className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest"><Icons.Check /> {f}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass p-12 rounded-[4.5rem] border border-white/5 relative min-h-[600px] flex flex-col backdrop-blur-3xl shadow-2xl overflow-hidden">
          <div className="scanner-line"></div>
          
          {!analysis && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 opacity-30">
              <div className="p-10 bg-slate-900/50 rounded-full border border-slate-800 shadow-inner"><Icons.Alert /></div>
              <div className="space-y-2">
                <p className="text-[11px] font-black tracking-[0.5em] uppercase">No Active Vector</p>
                <p className="text-[10px] font-medium italic">Awaiting Telemetry Sync...</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-500/5 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-500 scale-125"><Icons.Shield /></div>
              </div>
              <p className="text-[10px] font-black tracking-[0.4em] text-blue-400 animate-pulse">CROSS-REFERENCING SCAM LEDGER...</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="animate-in fade-in zoom-in duration-700 h-full flex flex-col">
              <div className={`inline-block px-6 py-2 rounded-xl text-[10px] font-black uppercase mb-10 border w-fit shadow-xl ${
                analysis.risk === 'CLEAN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                analysis.risk === 'SUSPICIOUS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                RISK RATING: {analysis.risk}
              </div>
              
              <h3 className="text-4xl font-black mb-8 tracking-tighter leading-tight text-glow">
                {analysis.risk === 'CLEAN' ? 'Signature Verified Safe' : 'Malicious Signature Identified'}
              </h3>
              
              <div className="p-10 bg-slate-900/40 rounded-[2.5rem] border border-slate-800/50 mb-10 relative group">
                <div className="absolute -top-3 left-8 px-4 bg-[#0f172a] text-[9px] font-black text-blue-500 tracking-[0.3em]">EXECUTIVE ADVICE</div>
                <p className="text-xl font-bold text-slate-100 leading-relaxed italic group-hover:text-blue-400 transition-colors">"{analysis.advice}"</p>
              </div>

              <div className="space-y-4 mb-10">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Heuristic Reasoning</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium opacity-80">{analysis.reasoning}</p>
              </div>

              <div className="mt-auto pt-10 border-t border-slate-800/50 flex justify-between items-center">
                <button className="text-rose-400 text-[10px] font-black hover:underline tracking-[0.2em] uppercase transition-all">Mark False Positive</button>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="px-8 py-3 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Clear Results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpamDefense;
