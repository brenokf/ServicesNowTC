
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { User, AuditLog, UserRole } from '../types';
import { MOCK_USERS, MOCK_AUDIT_LOGS } from '../constants';

const Admin: React.FC = () => {
  const [users] = useState<User[]>(MOCK_USERS);
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  
  const [isNewOperatorModalOpen, setIsNewOperatorModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newOperatorName, setNewOperatorName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = () => {
    setIsNewOperatorModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsNewOperatorModalOpen(false);
    setAvatarPreview(null);
    setNewOperatorName('');
    document.body.style.overflow = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'OP';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'OP';
  };

  return (
    <div className="p-4 lg:p-8 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Control Center</h2>
        <p className="text-slate-500 text-sm mt-1">Gestão de operadores e registros de auditoria global.</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 text-sm font-black transition-all border-b-2 tracking-tight ${activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Usuários
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-3 text-sm font-black transition-all border-b-2 tracking-tight ${activeTab === 'logs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Logs de Auditoria
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={handleOpenModal}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2 group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Operador
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operador</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Perfil</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-100 shadow-sm">
                          <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">{u.name}</span>
                          <span className="text-[11px] font-bold text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === UserRole.ADMIN ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <button className="p-2 text-indigo-400 hover:text-indigo-600 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{log.action}</span>
                        <span className="text-[10px] font-black text-indigo-500 uppercase">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-[11px] font-bold font-mono text-slate-400">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isNewOperatorModalOpen && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-hidden">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={handleCloseModal}></div>
          <div className="relative z-[1001] w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp">
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Novo Operador</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Provisionamento de acesso</p>
              </div>
              <button onClick={handleCloseModal} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-10 overflow-y-auto max-h-[60vh]">
              <div className="flex flex-col items-center mb-10">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative w-32 h-32 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-all overflow-hidden"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-slate-300">
                      {newOperatorName ? getInitials(newOperatorName) : '+'}
                    </span>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload de Avatar</p>
              </div>

              <form className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={newOperatorName}
                    onChange={(e) => setNewOperatorName(e.target.value)}
                    placeholder="Ex: Carlos Alberto" 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                  <input type="email" placeholder="carlos.a@nexus.corp" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" />
                </div>
              </form>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button onClick={handleCloseModal} className="flex-1 py-4 text-xs font-black text-slate-500 bg-white border border-slate-200 rounded-2xl uppercase tracking-widest">Cancelar</button>
              <button onClick={handleCloseModal} className="flex-[2] py-4 text-xs font-black text-white bg-slate-950 rounded-2xl shadow-xl uppercase tracking-widest">Ativar Acesso</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Admin;
