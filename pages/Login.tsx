
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Simple mock auth
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -ml-48 -mb-48"></div>

      <div className="w-full max-w-md animate-fadeIn relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 lg:p-12">
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30 mb-6 group cursor-default">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center font-black text-indigo-600 group-hover:rotate-12 transition-transform">N</div>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nexus Sync</h1>
              <p className="text-slate-500 mt-2 font-medium">Enterprise Intelligence Suite</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-shake">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Institutional Email</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="name@nexus.corp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Secret Credential</label>
                  <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Lost Credentials?</button>
                </div>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                Initialize Protocol
              </button>

              <div className="pt-4 text-center">
                <button type="button" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                  Request System Access
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-center gap-4">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Level: Grade-A</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">•</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ISO 27001 Compliant</span>
          </div>
        </div>
        
        <p className="text-center text-slate-500 text-xs mt-8 font-medium">
          © 2024 Nexus Operations Group. Authorized personnel only.
        </p>
      </div>
    </div>
  );
};

export default Login;
