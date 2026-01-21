
import React, { useState } from 'react';
import { Icons } from '../constants';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    organization: '',
    role: 'Security Analyst'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  const socialLogin = (provider: string) => {
    setIsAuthenticating(true);
    setTimeout(() => onLogin(), 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden p-6">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="p-5 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-500/40 mb-6 transform hover:rotate-6 transition-all cursor-pointer">
            <Icons.Shield />
          </div>
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-indigo-400 text-glow">
            CYBERGUARD PRO
          </h1>
          <p className="text-slate-500 text-[10px] mt-4 font-black tracking-[0.5em] uppercase opacity-70">Unified Security Interface</p>
        </div>

        <div className="glass p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative backdrop-blur-3xl">
          {isAuthenticating && (
            <div className="absolute inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center space-y-6 text-center rounded-[3.5rem]">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl animate-pulse shadow-2xl shadow-blue-500/60"></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-blue-400 font-black tracking-[0.3em] text-[10px] uppercase">Decrypting Identity Token...</p>
                <div className="h-0.5 w-32 bg-slate-800 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-blue-500 animate-[loading_2s_linear_infinite]" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          )}

          <div className="flex mb-10 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50">
            <button 
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${!isSignUp ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              SIGN IN
            </button>
            <button 
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${isSignUp ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Enter Name"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Organization</label>
                  <input
                    required
                    type="text"
                    placeholder="Company ID"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
              <input
                required
                type="email"
                placeholder="user@domain.pro"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700"
              />
            </div>

            <button
              type="submit"
              className="btn-lightning w-full py-5 bg-blue-600 rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 uppercase group"
            >
              {isSignUp ? 'ESTABLISH CREDENTIALS' : 'INITIALIZE UPLINK'}
              <div className="group-hover:translate-x-1 transition-transform">
                <Icons.ChevronRight />
              </div>
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800/50"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]"><span className="bg-[#0b1224] px-4 text-slate-600">Unified IDP Protocols</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => socialLogin('google')}
              className="btn-lightning flex items-center justify-center gap-3 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-[9px] font-black text-slate-400 tracking-widest">GOOGLE</span>
            </button>
            <button 
              onClick={() => socialLogin('microsoft')}
              className="btn-lightning flex items-center justify-center gap-3 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#f35323" d="M1 1h10v10H1z"/><path fill="#80bb03" d="M13 1h10v10H13z"/><path fill="#05a6f0" d="M1 13h10v10H1z"/><path fill="#ffba08" d="M13 13h10v10H13z"/>
              </svg>
              <span className="text-[9px] font-black text-slate-400 tracking-widest">MICROSOFT</span>
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
           <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.6em]">Hardware Trusted Platform Module (TPM) Active</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
