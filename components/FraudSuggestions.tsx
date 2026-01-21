
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { getFraudSuggestion } from '../services/geminiService';

const CyberMap: React.FC<{ active: boolean, location?: string, category?: string | null }> = ({ active, location, category }) => {
  return (
    <div className="relative w-full h-96 overflow-hidden rounded-[3.5rem] bg-[#020617] border border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.15)] group perspective-container">
      {/* Background Deep Grid */}
      <div className="cyber-grid opacity-30"></div>
      
      {/* Tactical Map Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`transition-all duration-1000 transform-gpu w-full h-full flex items-center justify-center ${active ? 'scale-125' : 'scale-100 opacity-60'}`}>
          <div className="isometric-view w-[800px] h-[800px] relative">
            {/* Schematic Map Base (SVG) */}
            <svg viewBox="0 0 800 800" className="w-full h-full">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* District Borders */}
              <path d="M 100 100 L 700 100 L 700 700 L 100 700 Z" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="2" strokeDasharray="10 5" />
              
              {/* Main Arterial Roads (Glowing) */}
              <g filter="url(#glow)">
                <path d="M 0 400 L 800 400" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="12" fill="none" />
                <path d="M 400 0 L 400 800" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="12" fill="none" />
                
                {/* Diagonal Highways */}
                <path d="M 0 0 L 800 800" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="8" fill="none" />
                <path d="M 800 0 L 0 800" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="8" fill="none" />
              </g>

              {/* Animated Traffic / Data Paths */}
              <g className="animate-dash">
                <path d="M 0 400 L 800 400" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="15 45" fill="none" />
                <path d="M 400 0 L 400 800" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="20 40" fill="none" />
                <path d="M 0 0 L 800 800" stroke="#93c5fd" strokeWidth="1" strokeDasharray="10 50" fill="none" />
              </g>

              {/* Minor Streets (Grid Pattern) */}
              <g stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1={i * 50} y1="0" x2={i * 50} y2="800" />
                    <line x1="0" y1={i * 50} x2="800" y2={i * 50} />
                  </React.Fragment>
                ))}
              </g>

              {/* POI Nodes (Infrastructure hubs) */}
              <g className="nodes">
                <circle cx="200" cy="200" r="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="600" cy="200" r="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="200" cy="600" r="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="600" cy="600" r="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="400" cy="400" r="12" fill="#1e293b" stroke="#6366f1" strokeWidth="3" />
              </g>

              {/* Target Location Lock-on UI */}
              {location && (
                <g className="target-lock animate-in zoom-in duration-500">
                  <circle cx="450" cy="450" r="40" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" className="animate-spin" style={{ transformOrigin: '450px 450px' }} />
                  <circle cx="450" cy="450" r="30" fill="none" stroke="#f43f5e" strokeWidth="0.5" />
                  <line x1="450" y1="410" x2="450" y2="430" stroke="#f43f5e" strokeWidth="2" />
                  <line x1="450" y1="470" x2="450" y2="490" stroke="#f43f5e" strokeWidth="2" />
                  <line x1="410" y1="450" x2="430" y2="450" stroke="#f43f5e" strokeWidth="2" />
                  <line x1="470" y1="450" x2="490" y2="450" stroke="#f43f5e" strokeWidth="2" />
                  <circle cx="450" cy="450" r="4" fill="#f43f5e" className="animate-pulse" />
                </g>
              )}
            </svg>

            {/* Float Labels in 3D Space */}
            <div className="absolute top-[400px] left-[400px] translate-z-30 pointer-events-none">
                <div className="bg-blue-600/90 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg border border-white/20 -translate-x-1/2 -translate-y-full mb-2">CORE GATEWAY</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Map UI Overlays */}
      <div className="absolute top-10 left-10 z-10 space-y-3">
        <div className="flex items-center gap-4 bg-slate-950/90 px-5 py-3 rounded-2xl border border-blue-500/40 backdrop-blur-2xl shadow-2xl">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                <Icons.Map />
            </div>
            <div>
                <p className="text-[11px] font-black tracking-[0.2em] text-white uppercase leading-none">Tactical Schematic</p>
                <p className="text-[9px] font-bold text-blue-400/60 uppercase mt-1 tracking-wider">Map Layer: Vector Overlays Active</p>
            </div>
        </div>
        
        {category && (
            <div className="flex items-center gap-3 bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl animate-in slide-in-from-left-4">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                Locking Strategy: {category}
            </div>
        )}
      </div>

      {/* Navigation Stats Overlay */}
      <div className="absolute bottom-10 left-10 z-10 flex flex-col gap-2">
         {location && (
            <div className="glass p-5 rounded-3xl border border-emerald-500/40 animate-in fade-in slide-in-from-bottom-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">GPS Vector Lock</p>
                </div>
                <p className="text-sm font-mono text-slate-100 font-bold tracking-tight">{location}</p>
                <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-3/4 animate-pulse"></div>
                </div>
            </div>
         )}
      </div>

      {/* Map Control Tools */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          {[
            { id: '2D', icon: null },
            { id: '3D', icon: null },
            { id: 'ZOOM', icon: null },
            { id: 'SYNC', icon: Icons.Activity }
          ].map(tool => (
              <button 
                key={tool.id} 
                className="w-12 h-12 glass border border-slate-700 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-400 transition-all text-[10px] font-black shadow-2xl backdrop-blur-3xl group"
              >
                {tool.icon ? <tool.icon /> : tool.id}
                <div className="absolute right-full mr-4 px-2 py-1 bg-slate-900 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-800 pointer-events-none">Toggle {tool.id}</div>
              </button>
          ))}
      </div>

      {/* Radar Sweep Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.05)_40deg,transparent_120deg)] animate-[spin_4s_linear_infinite]"></div>
      </div>

      <div className="absolute bottom-10 right-10 z-10 flex items-center gap-5 text-right">
          <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Global Threat Grid</p>
              <p className="text-xs font-bold text-white uppercase tracking-tight">AI Render: v2.4.19</p>
          </div>
          <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/20 backdrop-blur-md shadow-inner">
            <Icons.Globe />
          </div>
      </div>
    </div>
  );
};

const FraudSuggestions: React.FC = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [network, setNetwork] = useState('Private');
  const [isEducation, setIsEducation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ advice: string, steps: string[], cautions: string[] } | null>(null);

  const CATEGORIES = [
    { id: 'Hacking', icon: Icons.Shield, desc: 'System Intrusion Detection', color: 'blue' },
    { id: 'Phishing', icon: Icons.Activity, desc: 'Linguistic Scam Analysis', color: 'emerald' },
    { id: 'Cyberbullying', icon: Icons.Alert, desc: 'Abuse & Harassment Protocol', color: 'rose' },
    { id: 'Trolling', icon: Icons.Activity, desc: 'Disruption Risk Assessment', color: 'amber' }
  ];

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      }, () => {
        alert("Geolocation offline. Enter manual coordinates.");
      });
    }
  };

  const handleGetSuggestion = async () => {
    if (!category || (!isEducation && !details.trim())) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await getFraudSuggestion({
        category,
        details,
        location,
        time,
        network,
        isEducation
      });
      setResult(data);
    } catch (err) {
      alert("AI Intelligence Disconnected. Re-syncing...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-6">
        <h2 className="text-7xl font-black tracking-tighter text-glow bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-indigo-500">
            Fraud Intelligence
        </h2>
        <div className="flex items-center justify-center gap-6">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent to-blue-500/40"></div>
            <p className="text-slate-500 text-[11px] font-black tracking-[0.4em] uppercase opacity-70">Tactical Threat Schematic & Predictive Analysis</p>
            <div className="h-0.5 w-24 bg-gradient-to-l from-transparent to-blue-500/40"></div>
        </div>
      </header>

      {/* Hero Tactical Map */}
      <CyberMap active={!!category} location={location} category={category} />

      {!category ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="glass-card group p-14 rounded-[4rem] text-center space-y-10 flex flex-col items-center justify-center btn-lightning relative overflow-hidden"
            >
              <div className="p-7 bg-blue-600/10 text-blue-400 rounded-[2.5rem] group-hover:scale-110 group-hover:bg-blue-600/20 transition-all duration-700 shadow-2xl shadow-blue-500/10">
                <cat.icon />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tight leading-none">{cat.id}</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] mt-3 font-black opacity-80">{cat.desc}</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 blur-[60px] rounded-full group-hover:bg-blue-600/10 transition-colors"></div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Module Controls */}
          <div className="lg:col-span-5 space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="glass p-12 rounded-[4.5rem] border border-white/5 space-y-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                <div className="scanner-line opacity-30"></div>
                <div className="flex justify-between items-center mb-4">
                <button onClick={() => { setCategory(null); setResult(null); }} className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.4em] flex items-center gap-3 group">
                    <Icons.ChevronRight className="rotate-180 group-hover:-translate-x-2 transition-transform" /> Back to Intelligence Grid
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{category} MODULE ACTIVE</span>
                </div>
                </div>

                {category === 'Phishing' && (
                <div className="flex bg-slate-900/80 p-2 rounded-2xl border border-slate-800/50 mb-8 shadow-inner">
                    <button 
                    onClick={() => { setIsEducation(true); setResult(null); }}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-500 ${isEducation ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                    LEARN VECTORS
                    </button>
                    <button 
                    onClick={() => { setIsEducation(false); setResult(null); }}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-500 ${!isEducation ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                    LIVE MITIGATION
                    </button>
                </div>
                )}

                {!isEducation ? (
                <div className="space-y-8">
                    <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2">Incident Narrative</label>
                    <textarea 
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Detail the anomaly for deep heuristic analysis..."
                        className="w-full h-44 bg-slate-900/40 border border-slate-800 rounded-[3rem] px-10 py-8 text-sm code-font text-blue-400 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500/50 outline-none transition-all resize-none shadow-inner placeholder:text-slate-800"
                    />
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2">Geospatial Origin</label>
                        <div className="flex gap-4">
                            <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            placeholder="Coordinates or Physical Address..." 
                            className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl px-8 py-5 text-xs focus:outline-none focus:border-blue-500/40 transition-all text-slate-200"
                            />
                            <button onClick={handleGetCurrentLocation} className="p-5 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20 hover:bg-blue-600/20 hover:border-blue-500/50 transition-all shadow-xl">
                            <Icons.Map />
                            </button>
                        </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2">Timestamp</label>
                                <input 
                                    type="datetime-local" 
                                    value={time} 
                                    onChange={(e) => setTime(e.target.value)} 
                                    className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-bold text-slate-400 focus:border-blue-500/40"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2">Network Layer</label>
                                <select 
                                    value={network}
                                    onChange={(e) => setNetwork(e.target.value)}
                                    className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-bold text-slate-400 appearance-none cursor-pointer focus:border-blue-500/40"
                                >
                                    <option>DMZ Zone</option>
                                    <option>Intranet Layer</option>
                                    <option>Public Gateway</option>
                                    <option>VPN Tunnel</option>
                                    <option>Cloud Workload</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                <div className="p-14 bg-blue-600/5 rounded-[4rem] border border-blue-500/10 flex flex-col items-center text-center space-y-8">
                    <div className="p-8 bg-blue-600/20 text-blue-400 rounded-full shadow-2xl shadow-blue-500/30 animate-pulse border border-blue-500/30"><Icons.Help /></div>
                    <h4 className="font-black text-3xl tracking-tight leading-none">AI Intelligence Brief</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">Requesting multi-vector breakdown for <span className="text-blue-400 font-black">{category}</span> including sociological impacts and defense baseline.</p>
                </div>
                )}

                <button
                onClick={handleGetSuggestion}
                disabled={loading || (!isEducation && !details.trim())}
                className="btn-lightning w-full py-7 bg-blue-600 rounded-[2.5rem] font-black text-[11px] tracking-[0.5em] shadow-[0_0_50px_rgba(37,99,235,0.4)] flex items-center justify-center gap-5 uppercase transition-all"
                >
                {loading ? <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-white rounded-full"></div> : <><Icons.Shield /> {isEducation ? 'GENERATE BRIEFING' : 'INITIATE TACTICAL AI'}</>}
                </button>
            </div>
          </div>

          {/* AI Reasoning & Result Output */}
          <div className="lg:col-span-7 space-y-8 animate-in slide-in-from-right-8 duration-700">
            <div className="glass p-16 rounded-[6rem] border border-white/5 relative min-h-[800px] flex flex-col backdrop-blur-3xl shadow-2xl overflow-hidden">
                <div className="scanner-line opacity-20"></div>
                
                {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 opacity-30">
                    <div className="relative">
                        <div className="p-16 bg-slate-900/50 rounded-full border border-slate-800 shadow-inner"><Icons.Activity /></div>
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                    <p className="text-[14px] font-black tracking-[0.8em] uppercase">Intelligence Engine Offline</p>
                    <p className="text-xs font-medium italic text-slate-500">Waiting for data payload transmission...</p>
                    </div>
                </div>
                )}

                {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                    <div className="relative">
                        <div className="w-40 h-40 border-8 border-blue-500/5 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-blue-500 scale-[2.5]"><Icons.Shield /></div>
                    </div>
                    <div className="space-y-6 text-center">
                        <p className="text-[12px] font-black tracking-[0.6em] text-blue-400 animate-pulse uppercase">PROCESSING THREAT VECTORS...</p>
                        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Applying Neural Heuristics to Dataset</p>
                    </div>
                </div>
                )}

                {result && !loading && (
                <div className="animate-in fade-in zoom-in duration-1000 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <div className="inline-block px-8 py-3 rounded-2xl text-[11px] font-black uppercase border shadow-2xl bg-blue-500/10 text-blue-400 border-blue-500/20 tracking-[0.2em]">
                            {isEducation ? 'DATA INTELLIGENCE BRIEF' : 'ACTIVE MITIGATION LOG'}
                        </div>
                        <div className="flex gap-3">
                             {[1,2,3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ opacity: 1 - (i-1)*0.3 }}></div>)}
                        </div>
                    </div>
                    
                    <h3 className="text-6xl font-black mb-12 tracking-tighter leading-tight text-glow bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500">
                    {isEducation ? `Anatomy: ${category}` : 'Tactical Response Protocol'}
                    </h3>
                    
                    <div className="p-14 bg-slate-900/60 rounded-[4rem] border border-slate-800/50 mb-12 relative group transition-all hover:border-blue-500/40 shadow-inner">
                    <div className="absolute -top-3 left-12 px-6 bg-[#0b1224] text-[11px] font-black text-blue-500 tracking-[0.5em]">AI COMMAND SUMMARY</div>
                    <p className="text-3xl font-bold text-slate-100 leading-snug italic group-hover:text-blue-400 transition-colors">"{result.advice}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
                    <div className="space-y-8">
                        <h4 className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.5em] flex items-center gap-4">
                        <Icons.Check /> {isEducation ? 'Attack Mechanisms' : 'Immediate Countermeasures'}
                        </h4>
                        <div className="space-y-6">
                        {result.steps.map((s, i) => (
                            <div key={i} className="flex gap-6 items-start group">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-xl">
                                <span className="text-[12px] font-black">{i+1}</span>
                            </div>
                            <p className="text-[14px] text-slate-400 leading-snug font-medium group-hover:text-slate-200 transition-colors">{s}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className="space-y-8">
                        <h4 className="text-[12px] font-black text-rose-400 uppercase tracking-[0.5em] flex items-center gap-4">
                        <Icons.Alert /> {isEducation ? 'Vulnerability Profile' : 'Systemic Cautions'}
                        </h4>
                        <div className="space-y-6">
                        {result.cautions.map((c, i) => (
                            <div key={i} className="flex gap-5 items-start group">
                            <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-2 shadow-[0_0_20px_rgba(244,63,94,0.8)] border border-white/20"></div>
                            <p className="text-[14px] text-slate-400 leading-snug font-medium group-hover:text-slate-200 transition-colors">{c}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>

                    <div className="mt-auto pt-12 border-t border-slate-800/50 flex justify-between items-center">
                    <button className="text-slate-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.5em] hover:tracking-[0.6em] duration-500">Archive Tactical Report</button>
                    <button onClick={() => setResult(null)} className="px-14 py-5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl hover:border-blue-500/30">Reset Module</button>
                    </div>
                </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudSuggestions;
