
import React, { useState } from 'react';
import { Icons } from '../constants';
import { SurveyData } from '../types';

interface SurveyProps {
  onSubmit: (data: SurveyData) => void;
  isLoading: boolean;
}

const initialSurvey: SurveyData = {
  companySize: '',
  industry: '',
  cloudProviders: [],
  mfaUsage: '',
  dataBackupFrequency: '',
  employeeTraining: '',
  incidentResponsePlan: '',
  knownThreats: '',
  securityBudget: '',
  infrastructureNotes: '',
};

const SecuritySurvey: React.FC<SurveyProps> = ({ onSubmit, isLoading }) => {
  const [survey, setSurvey] = useState<SurveyData>(initialSurvey);
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const handleChange = (name: keyof SurveyData, value: any) => {
    setSurvey(prev => ({ ...prev, [name]: value }));
  };

  const handleCloudToggle = (provider: string) => {
    setSurvey(prev => ({
      ...prev,
      cloudProviders: prev.cloudProviders.includes(provider)
        ? prev.cloudProviders.filter(p => p !== provider)
        : [...prev.cloudProviders, provider]
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const ChoiceCard = ({ label, selected, onClick, icon: Icon, desc }: any) => (
    <button
      onClick={onClick}
      className={`p-8 rounded-[2rem] border transition-all text-left flex flex-col gap-3 group h-full relative overflow-hidden ${
        selected 
          ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50 scale-[1.02]' 
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center gap-4">
        {Icon && <div className={`p-2 rounded-xl bg-slate-900 shadow-inner ${selected ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-500 transition-colors'}`}><Icon /></div>}
        <span className={`font-black text-sm tracking-tight ${selected ? 'text-white text-glow' : 'text-slate-400'}`}>{label}</span>
      </div>
      {desc && <p className={`text-[10px] leading-relaxed font-medium ${selected ? 'text-blue-200' : 'text-slate-500'}`}>{desc}</p>}
      {selected && <div className="absolute top-4 right-4 text-blue-400"><Icons.Check /></div>}
      {selected && <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-[30px] rounded-full pointer-events-none"></div>}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-black tracking-tight mb-6 text-glow">Strategic Infrastructure Audit</h2>
        <div className="flex justify-center gap-3 max-w-xl mx-auto mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all duration-700 shadow-inner ${
                step > i ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-4">
           <div className="h-[1px] w-12 bg-slate-800"></div>
           <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em] opacity-80">
             Phase {step} of {totalSteps}
           </p>
           <div className="h-[1px] w-12 bg-slate-800"></div>
        </div>
      </header>

      <div className="glass p-14 rounded-[4.5rem] border border-white/5 shadow-2xl relative backdrop-blur-3xl">
        <div className="scanner-line"></div>
        
        {step === 1 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
            <div>
              <h3 className="text-2xl font-black mb-8 tracking-tight">Market Vertical Selection</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {['FinTech', 'Healthcare', 'Critical Infra', 'E-Commerce', 'Public Sector', 'Logistics'].map((ind) => (
                  <ChoiceCard key={ind} label={ind} selected={survey.industry === ind} onClick={() => handleChange('industry', ind)} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-8 tracking-tight">Organization Magnitude</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {['SME (1-50)', 'Mid-Market (50-250)', 'Enterprise (250-1k)', 'Tier-1 (1k+)'].map((size) => (
                  <ChoiceCard key={size} label={size} selected={survey.companySize === size} onClick={() => handleChange('companySize', size)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-2xl font-black mb-2 tracking-tight">Cloud Stack Topography</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">Identify all active deployment surfaces.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {['AWS Global', 'Azure Ent.', 'Google Cloud', 'Private DC', 'Hybrid Edge', 'Multi-Cloud'].map((p) => (
                <ChoiceCard key={p} label={p} icon={Icons.Cloud} selected={survey.cloudProviders.includes(p)} onClick={() => handleCloudToggle(p)} />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-2xl font-black mb-8 tracking-tight">Identity Persistence (IAM)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 'none', label: 'Legacy Credentials', desc: 'Single-factor password reliance across infrastructure.' },
                { id: 'partial', label: 'Selective MFA', desc: 'Context-aware or privileged user secondary factors.' },
                { id: 'enforced', label: 'Zero-Trust Pipeline', desc: 'Universal, mandatory secondary verification for all nodes.' },
                { id: 'biometric', label: 'Adaptive Passwordless', desc: 'Biometric, FIDO2, or hardware-bound cryptokeys.' }
              ].map((opt) => (
                <ChoiceCard key={opt.id} label={opt.label} desc={opt.desc} selected={survey.mfaUsage === opt.id} onClick={() => handleChange('mfaUsage', opt.id)} />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-2xl font-black mb-8 tracking-tight">Data Sovereignty & Backups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 'manual', label: 'Ad-hoc Snapshots', desc: 'Manual intervals with inconsistent off-site redundancy.' },
                { id: 'daily', label: 'Daily Immutable Sync', desc: 'Fully automated 24h backup cycles with encryption.' },
                { id: 'rt', label: 'Real-time Redundancy', desc: 'High-availability cross-region hot failovers active.' },
                { id: 'immutable', label: 'Air-Gapped Ledger', desc: 'Physically isolated backups resistant to logical wipes.' }
              ].map((opt) => (
                <ChoiceCard key={opt.id} label={opt.label} desc={opt.desc} selected={survey.dataBackupFrequency === opt.id} onClick={() => handleChange('dataBackupFrequency', opt.id)} />
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-2xl font-black mb-8 tracking-tight">Governance & Regulatory Alignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 'soc2', label: 'SOC2 Type II Focus', desc: 'Operating within strictly audited service control frameworks.' },
                { id: 'gdpr', label: 'Privacy & Data Rights', desc: 'Adhering to GDPR/CCPA data residency and rights protocols.' },
                { id: 'pci', label: 'Financial Hardening', desc: 'Meets the highest Tier of PCI-DSS transactional security.' },
                { id: 'hipaa', label: 'Health Data Integrity', desc: 'Ensures PHI/ePHI integrity under strict HIPAA HITECH rules.' }
              ].map((opt) => (
                <ChoiceCard key={opt.id} label={opt.label} desc={opt.desc} selected={survey.employeeTraining === opt.id} onClick={() => handleChange('employeeTraining', opt.id)} />
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-2xl font-black mb-6 tracking-tight">Historical Threat Exposure</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">Document any verified breach activity in the current cycle.</p>
            <div className="grid grid-cols-2 gap-5">
              {['Ransomware Impact', 'Phishing Hijack', 'Data Exfiltration', 'DDoS Interruption', 'Supply Chain Compromise', 'Zero-Incident Clean'].map(t => (
                <ChoiceCard key={t} label={t} selected={survey.knownThreats === t} onClick={() => handleChange('knownThreats', t)} />
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-2xl font-black mb-8 tracking-tight">Internal Network Topology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 'flat', label: 'Legacy Flat Network', desc: 'Direct intra-node communication without gatekeeping.' },
                { id: 'vlan', label: 'Logical VLAN Zones', desc: 'Departmental separation via virtual LAN protocols.' },
                { id: 'micro', label: 'Micro-segmentation', desc: 'Dynamic isolation at the service/workload level.' },
                { id: 'sdn', label: 'Centralized SDN', desc: 'Policy-driven software-defined networking control.' }
              ].map((opt) => (
                <ChoiceCard key={opt.id} label={opt.label} desc={opt.desc} selected={survey.incidentResponsePlan === opt.id} onClick={() => handleChange('incidentResponsePlan', opt.id)} />
              ))}
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-2xl font-black mb-8 tracking-tight">Security Resource Allocation</h3>
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-5">
                {['< 5% IT Spend', '5-15% IT Spend', 'Strategic (> 15%)', 'Budget Unassigned'].map(b => (
                  <ChoiceCard key={b} label={b} selected={survey.securityBudget === b} onClick={() => handleChange('securityBudget', b)} />
                ))}
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Internal Architecture Logs</label>
                <div className="relative group">
                    <textarea 
                      name="infrastructureNotes"
                      value={survey.infrastructureNotes}
                      onChange={(e) => handleChange('infrastructureNotes', e.target.value)}
                      placeholder="Input tech stack specifics, legacy constraints, or compliance goals..."
                      className="w-full h-44 bg-slate-900/60 border border-slate-800 rounded-[2.5rem] px-8 py-7 text-sm code-font text-blue-400 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500/50 outline-none transition-all resize-none shadow-inner placeholder:text-slate-700"
                    ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 flex gap-6">
          {step > 1 && (
            <button onClick={prevStep} className="btn-lightning flex-1 py-5 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all font-black text-[10px] tracking-widest text-slate-500">REVERT PHASE</button>
          )}
          {step < totalSteps ? (
            <button onClick={nextStep} className="btn-lightning flex-[2] py-5 bg-blue-600 rounded-2xl font-black text-[10px] tracking-[0.3em] shadow-2xl shadow-blue-600/30 uppercase">ADVANCE TELEMETRY</button>
          ) : (
            <button
              onClick={() => onSubmit(survey)}
              disabled={isLoading}
              className="btn-lightning flex-[2] py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 rounded-2xl transition-all font-black text-[10px] tracking-[0.3em] shadow-2xl shadow-emerald-600/30 flex items-center justify-center gap-4 uppercase"
            >
              {isLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>GENERATING PAYLOAD...</> : <>INITIALIZE GLOBAL AUDIT <Icons.Check /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySurvey;
