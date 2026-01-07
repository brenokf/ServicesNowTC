
import React, { useState } from 'react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulação de envio de e-mail
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020001] p-4 relative overflow-hidden font-sans">
      {/* Elementos Decorativos de Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e1251a]/5 blur-[120px] rounded-full -mr-250 -mt-250 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full -ml-150 -mb-150 pointer-events-none"></div>

      <div className="w-full max-w-[420px] relative z-10 animate-fadeIn">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.6)] p-10 lg:p-12 border border-white/10">
          
          {/* Logo e Título */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#e1251a] rounded-2xl flex items-center justify-center shadow-xl shadow-red-600/20 mb-6 transition-transform hover:scale-105 active:scale-95 cursor-pointer" onClick={onBackToLogin}>
              <span className="font-black text-white text-2xl">N</span>
            </div>
            <h1 className="text-2xl font-black text-black tracking-tightest text-center">Recuperação de Acesso</h1>
            <p className="text-zinc-400 mt-2 font-bold uppercase text-[9px] tracking-[0.3em] text-center">Nexus Security Gate</p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center px-2 mb-2">
                <p className="text-zinc-500 text-sm font-medium">
                  Insira seu e-mail corporativo abaixo para receber as instruções de redefinição de senha.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#e1251a]/5 focus:border-[#e1251a] transition-all font-bold text-sm text-black placeholder:text-zinc-300"
                  placeholder="usuario@nexus.corp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full bg-black text-white font-black py-4 rounded-2xl shadow-lg active:scale-[0.97] transition-all uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#e1251a]'}`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Enviar Instruções'}
              </button>

              <div className="pt-4 text-center">
                <button 
                  type="button"
                  onClick={onBackToLogin}
                  className="text-[10px] font-black text-zinc-400 hover:text-black uppercase tracking-widest transition-all"
                >
                  Voltar para o Login
                </button>
              </div>
            </form>
          ) : (
            <div className="py-6 flex flex-col items-center text-center animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8 shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-black tracking-tight">Verifique seu E-mail</h3>
              <p className="text-zinc-500 font-medium text-sm mt-4 px-2">
                Se o e-mail <span className="text-black font-bold">{email}</span> estiver cadastrado, você receberá um link em instantes.
              </p>
              
              <button 
                onClick={onBackToLogin}
                className="mt-10 w-full bg-black text-white font-black py-4 rounded-2xl shadow-xl hover:bg-zinc-900 active:scale-[0.97] transition-all uppercase text-[11px] tracking-[0.2em]"
              >
                Retornar ao Login
              </button>
            </div>
          )}

        </div>

        {/* Info de Segurança */}
        <div className="mt-8 flex justify-center gap-6 opacity-40">
           <div className="flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-white"></div>
             <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">End-to-end Encryption</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-white"></div>
             <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Nexus Auth v4.2</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
