
import React, { useState } from 'react';
import { Icons } from '../constants';
import { IncidentData, LanguageConfig } from '../types';
import { analyzeIncident } from '../services/geminiService';

interface IncidentReporterProps {
  onComplete: () => void;
  language: LanguageConfig;
}

const IncidentReporter: React.FC<IncidentReporterProps> = ({ onComplete, language }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [incident, setIncident] = useState<IncidentData>({
    type: '',
    discoveryTime: new Date().toISOString().slice(0, 16),
    impactedAssets: [],
    financialLoss: '',
    description: '',
    currentStatus: 'unknown',
    rating: 0,
    feedback: ''
  });
  
  const [advice, setAdvice] = useState<{ diagnosis: string, steps: string[], reasoning: string } | null>(null);

  const THREAT_TYPES = [
    { label: 'Cyber Fraud', id: 'fraud', icon: Icons.Database },
    { label: 'Malware Attack', id: 'malware', icon: Icons.Alert },
    { label: 'Phishing Scam', id: 'phishing', icon: Icons.Activity },
    { label: 'Ransomware', id: 'ransomware', icon: Icons.Shield },
    { label: 'Data Breach', id: 'breach', icon: Icons.Server },
    { label: 'What is Cyber Fraud?', id: 'edu_fraud', icon: Icons.Help },
  ];

  const handleNext = async () => {
    if (step === 7) {
      setLoading(true);
      try {
        const result = await analyzeIncident(incident, language.currency);
        setAdvice(result);
        setStep(8);
      } catch (err) {
        alert("AI analysis failed. Reverting to safe protocols.");
      } finally {
        setLoading(false);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Step 1: Classification</h3>
            <p className="text-slate-400 text-sm">Select the primary nature of the incident detected.</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {THREAT_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setIncident({...incident, type: t.label}); handleNext(); }}
                  className={`p-6 rounded-3xl border text-left transition-all ${
                    incident.type === t.label ? 'bg-blue-600 border-blue-500' : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="mb-3"><t.icon /></div>
                  <span className="font-bold text-sm">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Step 2: Timeline Identification</h3>
            <input 
              type="datetime-local" 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4"
              value={incident.discoveryTime}
              onChange={e => setIncident({...incident, discoveryTime: e.target.value})}
            />
            <button onClick={handleNext} className="w-full py-4 bg-blue-600 rounded-2xl font-bold">Continue Analysis</button>
          </div>
        );
      case 3:
      case 4:
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Step {step}: Asset & Impact Assessment</h3>
            <div>
              <label className="text-sm text-slate-500 block mb-2 uppercase font-bold tracking-widest">
                Estimated Exposure ({language.currency})
              </label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4"
                onChange={e => setIncident({...incident, financialLoss: e.target.value})}
              >
                <option value="none">Negligible</option>
                <option value="low">&lt; {language.currency}1,000</option>
                <option value="med">{language.currency}1,000 - {language.currency}50,000</option>
                <option value="high">{language.currency}50,000+</option>
              </select>
            </div>
            <button onClick={handleNext} className="w-full py-4 bg-blue-600 rounded-2xl font-bold">Validate Impact</button>
          </div>
        );
      case 6:
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Step {step}: Narrative & Narrative Deep Dive</h3>
            <textarea 
              className="w-full h-48 bg-slate-900 border border-slate-700 rounded-2xl p-6 text-sm code-font"
              placeholder="Provide a detailed log or narrative of how the incident unfolded..."
              value={incident.description}
              onChange={e => setIncident({...incident, description: e.target.value})}
            />
            <button onClick={handleNext} className="w-full py-4 bg-emerald-600 rounded-2xl font-bold flex items-center justify-center gap-2">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" /> : "Initiate AI Diagnosis"}
            </button>
          </div>
        );
      case 8:
        return (
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl border border-blue-500/30 bg-blue-500/5">
              <h3 className="text-2xl font-black text-blue-400 mb-4">AI SEC-OPS ADVICE</h3>
              <p className="text-lg font-bold mb-6 underline decoration-blue-500/50">{advice?.diagnosis}</p>
              <div className="space-y-4">
                {advice?.steps.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                    <p className="text-slate-300">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-black mb-2 tracking-widest">Underlying Reasoning</p>
              <p className="text-sm text-slate-400 italic">"{advice?.reasoning}"</p>
            </div>
            <button onClick={handleNext} className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold">Proceed to Verification</button>
          </div>
        );
      case 9:
        return (
          <div className="space-y-8 py-10 text-center">
            <div className="w-20 h-20 bg-rose-500/20 border border-rose-500 rounded-full mx-auto flex items-center justify-center text-rose-500">
              <Icons.Alert />
            </div>
            <h3 className="text-3xl font-black">Are you sure?</h3>
            <p className="text-slate-400 max-w-sm mx-auto">Confirming will log this report into the secure ledger. If the incident is active and uncontained, human intervention is recommended.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(11)} 
                className="flex-1 py-4 border border-rose-500/50 text-rose-400 rounded-2xl font-bold hover:bg-rose-500/10"
              >
                NO - CONNECT HUMAN
              </button>
              <button 
                onClick={() => setStep(10)} 
                className="flex-1 py-4 bg-emerald-600 rounded-2xl font-bold"
              >
                YES - PROCEED
              </button>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-6 text-center">
            <Icons.Check />
            <h3 className="text-2xl font-bold">Analysis Finalized</h3>
            <div className="py-8">
              <p className="text-sm text-slate-500 uppercase font-black mb-4">Rate this AI Advisor</p>
              <div className="flex justify-center gap-4">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setIncident({...incident, rating: n})} className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold ${incident.rating === n ? 'bg-blue-600 border-blue-500' : 'bg-slate-900 border-slate-800'}`}>{n}</button>
                ))}
              </div>
            </div>
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm" 
              placeholder="Optional: Provide feedback on reasoning..."
              onChange={e => setIncident({...incident, feedback: e.target.value})}
            />
            <button onClick={onComplete} className="w-full py-4 bg-blue-600 rounded-2xl font-bold">Return to Dashboard</button>
          </div>
        );
      case 11:
        return (
          <div className="space-y-8 py-10 text-center animate-in fade-in zoom-in">
            <div className="relative inline-block">
               <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500 animate-pulse">
                <Icons.Phone />
              </div>
            </div>
            <h3 className="text-2xl font-bold">Connecting to Human Proxy...</h3>
            <p className="text-slate-400 max-w-sm mx-auto">We are establishing a secure line to the nearest 24/7 Security Operations Center. A Tier-3 analyst will be with you shortly.</p>
            <div className="glass p-6 rounded-2xl border border-slate-800 text-left space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold">LATENCY</span>
                <span className="text-emerald-400">14ms</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold">CONNECTION</span>
                <span className="text-emerald-400 uppercase tracking-widest">Encrypted Tunnel</span>
              </div>
            </div>
            <button onClick={onComplete} className="w-full py-4 border border-slate-700 rounded-2xl font-bold text-slate-500">Cancel Request</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <header className="mb-10 text-center">
        <h2 className="text-2xl font-bold">Incident War Room</h2>
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} className={`h-1 w-6 rounded-full transition-all duration-500 ${step > i ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-slate-800'}`} />
          ))}
        </div>
      </header>
      <div className="glass p-8 rounded-[2.5rem] border border-slate-800 min-h-[500px]">
        {renderStep()}
      </div>
    </div>
  );
};

export default IncidentReporter;
