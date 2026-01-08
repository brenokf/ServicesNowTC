
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface LoginProps {
  onLogin: (email: string) => void;
  onForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Em um cenário real, aqui seria feita a chamada para a API
    setTimeout(() => {
      setIsSubmitted(false);
      setIsRequestModalOpen(false);
    }, 3000);
  };

  const RequestAccessModal = () => {
    if (!isRequestModalOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md animate-fadeIn" 
          onClick={() => !isSubmitted && setIsRequestModalOpen(false)}
        ></div>
        
        <div className="relative z-[101] w-full max-w-[480px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-scaleUp">
          <div className="p-8 lg:p-10">
            {!isSubmitted ? (
              <>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-black tracking-tight">Solicitar Acesso</h3>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1"><br/>TAD<br/>TELMAX</p>
                  </div>
                  <button 
                    onClick={() => setIsRequestModalOpen(false)}
                    className="w-10 h-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-black transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:border-black transition-all font-bold text-sm text-black"
                      placeholder="Ex: Carlos Alberto"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:border-black transition-all font-bold text-sm text-black"
                      placeholder="seu.nome@nexus.corp"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tipo de Acesso</label>
                      <select required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:border-black transition-all font-bold text-xs text-black appearance-none cursor-pointer">
                        <option value="">Selecionar...</option>
                        <option value="admin">Administrator</option>
                        <option value="tester">Tester / QA</option>
                        <option value="developer">Developer</option>
                        <option value="ops">Operations</option>
                        <option value="guest">Guest / Audit</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Departamento</label>
                      <select required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:border-black transition-all font-bold text-xs text-black appearance-none cursor-pointer">
                        <option value="">Selecionar...</option>
                        <option value="it">TI / Infra</option>
                        <option value="product">Produto</option>
                        <option value="eng">Engenharia</option>
                        <option value="qa">Qualidade</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Motivo (Opcional)</label>
                    <textarea 
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:border-black transition-all font-bold text-sm text-black resize-none h-24"
                      placeholder="Descreva brevemente por que precisa de acesso..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-black text-white font-black py-4 rounded-2xl shadow-xl active:scale-[0.97] transition-all uppercase text-[11px] tracking-[0.2em]"
                  >
                    Enviar Solicitação
                  </button>
                </form>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center text-center animate-fadeIn">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-black tracking-tight">Solicitação Enviada!</h3>
                <p className="text-zinc-500 font-medium text-sm mt-2 px-6">
                  Seu pedido foi encaminhado para a equipe de Infraestrutura. Você receberá um e-mail assim que seu acesso for liberado.
                </p>
                <div className="mt-8 pt-6 border-t border-zinc-100 w-full">
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Aguarde, redirecionando...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020001] p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e1251a]/5 blur-[120px] rounded-full -mr-250 -mt-250 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full -ml-150 -mb-150 pointer-events-none"></div>

      <div className="w-full max-w-[400px] relative z-10 animate-fadeIn">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.6)] p-8 lg:p-10 border border-white/10">
            {/* Minimalist Logo/Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-[#000000] rounded-2xl shadow-xl shadow-red-600/20 mb-4 transition-transform hover:scale-105 active:scale-95 cursor-pointer overflow-hidden flex items-center justify-center">
                 <span className='flex w-12 h-12 items-center justify-center '>
                      <img src="../assets/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full object-center" />
                </span> 
              </div>
              <h1 className="text-2xl text-black tracking-tightest"><strong><b>TAD</b></strong>TELMAX</h1>
              <p className="text-zinc-400 mt-1 font-bold uppercase text-[9px] tracking-[0.3em]">TADTELMAX WORLDWIDE</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">E-mail</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#e1251a]/5 focus:border-[#e1251a] transition-all font-bold text-sm text-black placeholder:text-zinc-300"
                  placeholder="usuario@nexus.corp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest">Senha</label>
                <input 
                  type="password" 
                  className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#e1251a]/5 focus:border-[#e1251a] transition-all font-bold text-sm text-black placeholder:text-zinc-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#e1251a] hover:bg-black text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/10 active:scale-[0.97] transition-all uppercase text-[11px] tracking-[0.2em]"
                >
                  Entrar
                </button>
              </div>
            </form>


        </div>
        
        {/* Compact Footer Info */}
        <div className="mt-6 flex justify-center gap-6 opacity-30">
           <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">v4.5.2</span>
           <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Encrypted Session</span>
        </div>
      </div>

      <RequestAccessModal />
    </div>
  );
};

export default Login;
