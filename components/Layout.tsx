
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { ViewState, AuditReport } from '../types';
import GlobalSearch from './GlobalSearch';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  onLogout: () => void;
  onOpenReport?: (report: AuditReport) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, onLogout, onOpenReport }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onViewChange={onViewChange}
        onOpenReport={onOpenReport}
      />
      
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
        <header className="h-20 glass sticky top-0 z-30 flex items-center justify-between px-8 border-b border-slate-800/50 backdrop-blur-3xl">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Node</span>
              <Icons.ChevronRight className="scale-75 opacity-30" />
              <span className="text-slate-100 font-black capitalize text-xs tracking-tight">{activeView.replace('-', ' ')}</span>
            </div>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="max-w-md w-full flex items-center gap-4 px-5 py-2.5 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 transition-all group"
            >
              <Icons.Search />
              <span className="flex-1 text-left text-xs font-medium">Search interface or ask AI...</span>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 rounded-lg border border-slate-800 text-[9px] font-black group-hover:text-blue-400 transition-colors">
                <Icons.Command />
                <span>K</span>
              </div>
            </button>
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10 transform active:scale-95 transition-transform">
                <span className="text-xs font-bold text-white">CP</span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 glass border border-slate-800 rounded-[2.5rem] shadow-2xl p-8 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center space-y-4 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold shadow-xl">CP</div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight">Enterprise Node 01</h3>
                    <p className="text-slate-500 text-[10px] font-medium mt-1">active-uplink@cyberguard.pro</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button onClick={() => { onViewChange('audit-history'); setIsProfileOpen(false); }} className="w-full text-left px-5 py-3 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-colors">Audit History Ledger</button>
                  <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-4 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-500/30 rounded-2xl text-[10px] font-black tracking-widest transition-all group mt-4 uppercase">
                    Terminate Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        
        <div className="p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
