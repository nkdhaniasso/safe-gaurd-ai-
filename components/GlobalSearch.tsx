
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';
import { ViewState, SearchResult, AuditReport } from '../types';
import { smartSearchSuggestions } from '../services/geminiService';

interface GlobalSearchProps {
  onViewChange: (view: ViewState) => void;
  onOpenReport?: (report: AuditReport) => void;
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onViewChange, onOpenReport, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const modules: SearchResult[] = [
    { id: 'm-1', title: 'Dashboard', type: 'module', description: 'Overview of security metrics', view: 'dashboard' },
    { id: 'm-2', title: 'Security Survey', type: 'module', description: 'Run full infrastructure audit', view: 'survey' },
    { id: 'm-3', title: 'Fraud Intelligence', type: 'module', description: 'Tactical threat mapping', view: 'fraud-suggestions' },
    { id: 'm-4', title: 'Spam Defense', type: 'module', description: 'Message analysis protocol', view: 'spam-defense' },
    { id: 'm-5', title: 'Vulnerability Scan', type: 'module', description: 'Instant code audit', view: 'audit' },
    { id: 'm-6', title: 'Audit History', type: 'module', description: 'Archived reports ledger', view: 'audit-history' },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const filteredModules = modules.filter(m => 
      m.title.toLowerCase().includes(query.toLowerCase()) || 
      m.description.toLowerCase().includes(query.toLowerCase())
    );

    const history: AuditReport[] = JSON.parse(localStorage.getItem('audit_history') || '[]');
    const filteredReports: SearchResult[] = history
      .filter(r => r.summary.toLowerCase().includes(query.toLowerCase()) || r.id.includes(query))
      .map(r => ({
        id: r.id,
        title: `Audit Report #${r.id.slice(-4)}`,
        type: 'report',
        description: r.summary,
        metadata: r
      }));

    setResults([...filteredModules, ...filteredReports]);

    // AI Suggestions (Debounced)
    const timeoutId = setTimeout(async () => {
      if (query.length > 3) {
        setIsSearching(true);
        try {
          const suggestions = await smartSearchSuggestions(query);
          setResults(prev => [...prev, ...suggestions]);
        } catch (err) {
          console.error("AI Search failed");
        } finally {
          setIsSearching(false);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    if (result.type === 'report' && result.metadata && onOpenReport) {
      onOpenReport(result.metadata as AuditReport);
    } else if (result.view) {
      onViewChange(result.view);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % (results.length || 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="w-full max-w-3xl glass rounded-[3rem] border border-blue-500/30 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200" onKeyDown={handleKeyDown}>
        <div className="scanner-line opacity-20"></div>
        
        <div className="p-8 border-b border-white/5 relative bg-slate-900/40">
          <div className="flex items-center gap-6">
            <div className="text-blue-400 scale-125">
              <Icons.Search />
            </div>
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search modules, audit reports, or ask AI (e.g., 'How do I fix phishing?')..."
              className="flex-1 bg-transparent border-none text-xl font-bold focus:outline-none placeholder:text-slate-600 text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 text-[9px] font-black text-slate-500 tracking-widest uppercase">
              ESC TO CLOSE
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {query.trim() === '' ? (
            <div className="p-10 text-center space-y-4 opacity-30">
              <div className="p-6 bg-slate-900 w-fit mx-auto rounded-full"><Icons.Command /></div>
              <div>
                <p className="text-sm font-black tracking-widest uppercase">Global Control Interface</p>
                <p className="text-[10px] font-medium mt-1">Start typing to search infrastructure ledger...</p>
              </div>
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="p-10 text-center text-slate-500">
              <p className="text-sm font-bold">No vectors found matching query.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((res, i) => (
                <button
                  key={res.id + i}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => handleSelect(res)}
                  className={`w-full flex items-center gap-5 p-5 rounded-[2rem] text-left transition-all ${
                    selectedIndex === i ? 'bg-blue-600 shadow-xl shadow-blue-600/20 translate-x-1' : 'hover:bg-slate-900/50'
                  }`}
                >
                  <div className={`p-4 rounded-2xl ${selectedIndex === i ? 'bg-white/20' : 'bg-slate-900 border border-slate-800'}`}>
                    {res.type === 'module' ? <Icons.Shield /> : res.type === 'report' ? <Icons.Server /> : <Icons.Activity />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className={`font-black text-sm tracking-tight ${selectedIndex === i ? 'text-white' : 'text-slate-200'}`}>{res.title}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                        selectedIndex === i ? 'bg-white/20 border-white/30 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}>
                        {res.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 line-clamp-1 ${selectedIndex === i ? 'text-blue-100' : 'text-slate-500'}`}>{res.description}</p>
                  </div>
                  {selectedIndex === i && (
                    <div className="text-white">
                      <Icons.ChevronRight />
                    </div>
                  )}
                </button>
              ))}
              {isSearching && (
                <div className="p-5 flex items-center justify-center gap-4 text-blue-400 animate-pulse">
                  <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase">AI Intelligence Mapping...</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[9px] font-black text-slate-600 tracking-[0.2em] uppercase">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Icons.Command /> ENTER TO SELECT</span>
            <span className="flex items-center gap-1">↑↓ NAVIGATE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            GEMINI OS SEC-ENGINE v3.1
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
