
import React from 'react';
import { Icons } from '../constants';
import { LanguageConfig } from '../types';

const LANGUAGES: LanguageConfig[] = [
  // Western
  { code: 'en', name: 'English (US)', nativeName: 'English', currency: '$', region: 'Western' },
  { code: 'en-gb', name: 'English (UK)', nativeName: 'English', currency: '£', region: 'Western' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', currency: '€', region: 'Western' },
  { code: 'fr', name: 'French', nativeName: 'Français', currency: '€', region: 'Western' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', currency: '€', region: 'Western' },
  // Indian
  { code: 'en-in', name: 'English (India)', nativeName: 'English', currency: '₹', region: 'Indian' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', currency: '₹', region: 'Indian' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', currency: '₹', region: 'Indian' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', currency: '₹', region: 'Indian' },
  { code: 'mr', name: 'Marathi', nativeName: 'మરાठी', currency: '₹', region: 'Indian' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', currency: '₹', region: 'Indian' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', currency: '₹', region: 'Indian' },
  { code: 'kn', name: 'Kannada', nativeName: 'కನ್ನಡ', currency: '₹', region: 'Indian' },
];

interface LanguageSelectorProps {
  onSelect: (lang: LanguageConfig) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px]"></div>

      <div className="max-w-4xl w-full z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-blue-600 rounded-3xl shadow-2xl mb-6">
            <Icons.Shield />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">INITIALIZE TERMINAL</h1>
          <p className="text-slate-500 font-medium tracking-[0.2em] text-xs uppercase">Select Localized Protocol</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Western Region */}
          <div className="glass p-8 rounded-[3rem] border border-white/5 bg-slate-900/20">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 px-2">Western Protocols</h3>
            <div className="grid grid-cols-1 gap-3">
              {LANGUAGES.filter(l => l.region === 'Western').map(lang => (
                <button
                  key={lang.code}
                  onClick={() => onSelect(lang)}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-600/5 transition-all text-left"
                >
                  <div>
                    <p className="font-bold text-slate-100">{lang.name}</p>
                    <p className="text-xs text-slate-500">{lang.nativeName}</p>
                  </div>
                  <div className="text-xl font-black opacity-20 group-hover:opacity-100 group-hover:text-blue-400 transition-all">
                    {lang.currency}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Indian Region */}
          <div className="glass p-8 rounded-[3rem] border border-white/5 bg-slate-900/20">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 px-2">Indian Protocols</h3>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.filter(l => l.region === 'Indian').map(lang => (
                <button
                  key={lang.code}
                  onClick={() => onSelect(lang)}
                  className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 hover:bg-orange-600/5 transition-all text-center"
                >
                  <p className="font-bold text-slate-100">{lang.name}</p>
                  <p className="text-[10px] text-slate-500 mb-2">{lang.nativeName}</p>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-orange-400 font-black group-hover:bg-orange-600/20 transition-all">
                    {lang.currency}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
          Secure Regional Uplink • Gemini 3.0 Pro Active
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
