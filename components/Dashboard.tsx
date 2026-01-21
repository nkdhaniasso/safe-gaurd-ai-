
import React from 'react';
import { Icons } from '../constants';
import { ViewState } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
  onViewChange: (view: ViewState) => void;
}

const data = [
  { name: 'Identity', value: 85 },
  { name: 'Network', value: 65 },
  { name: 'Data', value: 90 },
  { name: 'Cloud', value: 45 },
  { name: 'Endpoints', value: 72 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-glow">Executive Dashboard</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Real-time infrastructure insights and incident orchestration.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => onViewChange('incident-report')} className="btn-lightning px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-rose-600/30 flex items-center gap-3">
             <Icons.Alert /> REPORT CRITICAL INCIDENT
           </button>
        </div>
      </header>

      {/* Action Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: 'survey', label: 'Security Audit', icon: Icons.Database, color: 'blue', desc: 'Full infrastructure survey for deep AI roadmap.' },
          { id: 'fraud-suggestions', label: 'Fraud Intel', icon: Icons.Help, color: 'emerald', desc: 'Instant tactical advice for common threats.' },
          { id: 'spam-defense', label: 'Fraud Sentinel', icon: Icons.Alert, color: 'amber', desc: 'Analyze messages and scam patterns.' },
          { id: 'audit', label: 'Exploit Scan', icon: Icons.Shield, color: 'indigo', desc: 'Instant code-level vulnerability detection.' },
        ].map((hub) => (
          <button 
            key={hub.id}
            onClick={() => onViewChange(hub.id as ViewState)}
            className="group glass-card p-8 rounded-[2rem] text-left relative overflow-hidden flex flex-col h-full"
          >
            <div className={`p-3 bg-${hub.color}-600/20 rounded-xl w-fit mb-4 text-${hub.color}-400 group-hover:scale-110 transition-transform duration-500`}>
              <hub.icon />
            </div>
            <h3 className="text-lg font-black mb-2 tracking-tight group-hover:text-glow transition-all">{hub.label}</h3>
            <p className="text-slate-400 text-[10px] leading-tight mb-6 opacity-70">{hub.desc}</p>
            <div className={`mt-auto flex items-center gap-2 text-${hub.color}-400 font-black text-[9px] tracking-widest uppercase`}>
              Launch <Icons.ChevronRight />
            </div>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${hub.color}-600/5 blur-[40px] rounded-full pointer-events-none`}></div>
          </button>
        ))}
      </section>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Security Score', value: '74/100', trend: '+5%', icon: Icons.Activity, color: 'text-blue-500' },
          { label: 'Open Threats', value: '12', trend: '-2', icon: Icons.Alert, color: 'text-orange-500' },
          { label: 'Cloud Nodes', value: '1,248', trend: '+12', icon: Icons.Server, color: 'text-purple-500' },
          { label: 'Encryption', value: '98.2%', trend: '+0.1%', icon: Icons.Database, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-3xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-slate-900/80 ${stat.color} shadow-inner`}>
                <stat.icon />
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-black mt-2 text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[3rem]">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <Icons.Activity /> Security Health by Sector
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', fontSize: '10px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem]">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <Icons.Server /> Risk Distribution
          </h3>
          <div className="h-64 w-full flex items-center gap-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-4">
              {data.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-slate-500 font-bold">{item.name}</span>
                  <span className="font-black text-white ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
