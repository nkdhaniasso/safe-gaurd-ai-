
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Activity },
    { id: 'survey', label: 'Security Survey', icon: Icons.Database },
    { id: 'fraud-suggestions', label: 'Fraud Intelligence', icon: Icons.Help },
    { id: 'spam-defense', label: 'Spam Defense', icon: Icons.Alert },
    { id: 'audit', label: 'Vulnerability Scan', icon: Icons.Shield },
    { id: 'audit-history', label: 'Audit History', icon: Icons.Server },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 animate-in fade-in duration-1000">
      <aside className="w-64 glass border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Icons.Shield />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 uppercase">
            CyberGuard
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <item.icon />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <div className="glass p-4 rounded-xl text-xs space-y-2 bg-blue-600/5">
            <div className="flex justify-between items-center text-slate-500">
              <span className="font-bold uppercase">Protection</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[92%] animate-pulse"></div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
        <header className="h-16 glass sticky top-0 z-30 flex items-center justify-between px-8 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Session</span>
            <Icons.ChevronRight />
            <span className="text-slate-100 font-bold capitalize text-sm tracking-tight">{activeView.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-6 relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-slate-800/50 p-1 pr-2 rounded-2xl transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200">Admin Mode</p>
                <p className="text-[10px] text-emerald-500 font-medium">Verified</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10 transform active:scale-95 transition-transform">
                <span className="text-xs font-bold text-white">CP</span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 glass border border-slate-800 rounded-[2rem] shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center space-y-3 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold">CP</div>
                  <div>
                    <h3 className="font-bold text-sm">Enterprise Account</h3>
                    <p className="text-slate-500 text-[10px]">active-node-01@cyberguard.pro</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <button onClick={() => onViewChange('audit-history')} className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded-xl text-xs transition-colors">Audit History</button>
                  <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-500/30 rounded-2xl text-xs font-bold transition-all group">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
