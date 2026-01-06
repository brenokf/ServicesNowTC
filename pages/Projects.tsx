
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, UserRole, Project, ItemStatus } from '../types';
import { MOCK_PROJECTS, MOCK_USERS, STATUS_COLORS } from '../constants';

interface ProjectsProps {
  user: User;
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const projects = isAdmin 
    ? MOCK_PROJECTS 
    : MOCK_PROJECTS.filter(p => p.assignedUsers.includes(user.id));

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Gerencia o scroll do body quando a modal está aberta
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Componente da Modal renderizado via Portal
  const ModalPortal = () => {
    if (!isModalOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Backdrop - Escurece tudo atrás, inclusive Header e Sidebar */}
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fadeIn" 
          onClick={handleCloseModal}
        ></div>

        {/* Modal Container */}
        <div className="relative z-[10001] w-full max-w-4xl max-h-[95vh] flex flex-col bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-scaleUp overflow-hidden">
          
          {/* Header - Fixo no topo da modal */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Novo Projeto de Homologação</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Configure os parâmetros técnicos do novo dispositivo</p>
            </div>
            <button 
              onClick={handleCloseModal}
              className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm group"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body - Única parte com scroll interno */}
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
            <form className="grid grid-cols-1 md:grid-cols-3 gap-y-7 gap-x-6">
              {/* Informações de Produto */}
              <div className="md:col-span-3">
                <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-indigo-100"></span> Definições de Produto
                </h4>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Projeto / Modelo</label>
                <input type="text" placeholder="Ex: Galaxy S24 Ultra" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fabricante</label>
                <input type="text" placeholder="Ex: Samsung" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parceria</label>
                <input type="text" placeholder="Ex: Qualcomm / Intel" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Produto</label>
                <div className="relative">
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold appearance-none">
                    <option>Smartphone</option>
                    <option>Tablet</option>
                    <option>CPE / Modem</option>
                    <option>Wearable</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Homologação</label>
                <div className="relative">
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold appearance-none">
                    <option>Integral</option>
                    <option>Parcial / Delta</option>
                    <option>Re-homologação</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profile</label>
                <input type="text" placeholder="Ex: High-End_5G" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>

              {/* Stack Tecnológico */}
              <div className="md:col-span-3 mt-4">
                <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-indigo-100"></span> Especificações de Software
                </h4>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Versão de Software</label>
                <input type="text" placeholder="Ex: Android 14 (U1.2)" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Versão do Caderno</label>
                <input type="text" placeholder="Ex: v3.24_Final" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Esteira</label>
                <input type="text" placeholder="Ex: Alpha-Queue-01" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>

              {/* Cronograma e Gestão */}
              <div className="md:col-span-3 mt-4">
                <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-indigo-100"></span> Cronograma & Liderança
                </h4>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Coordenador</label>
                <input type="text" placeholder="Nome do Responsável" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Início</label>
                <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fim de Testes</label>
                <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Workshop</label>
                <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Resumo Exec</label>
                <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
              </div>
              <div className="hidden md:block"></div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição Detalhada</label>
                <textarea rows={4} placeholder="Notas estratégicas, riscos identificados e escopo da homologação..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-none custom-scrollbar"></textarea>
              </div>
            </form>
          </div>

          {/* Footer - Fixo na base da modal */}
          <div className="px-8 py-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
            <button 
              onClick={handleCloseModal}
              className="flex-1 py-4 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-[0.15em] shadow-sm active:scale-95"
            >
              Voltar
            </button>
            <button 
              onClick={handleCloseModal}
              className="flex-[2] py-4 text-xs font-black text-white bg-indigo-600 rounded-2xl shadow-[0_15px_30px_-5px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-0.5 transition-all uppercase tracking-[0.15em] active:scale-95"
            >
              Confirmar Cadastro
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="p-4 lg:p-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Project Allocation Hub</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin 
              ? 'Gestão global de contratos e dispositivos homologados.' 
              : 'Gerencie suas alocações estratégicas atuais.'}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleOpenModal}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Novo Projeto
          </button>
        )}
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Buscar por projeto, modelo ou cliente..." 
            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela Principal */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Projeto & ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Equipe Alocada</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProjects.map((project) => {
                const testers = project.assignedUsers.map(id => MOCK_USERS.find(u => u.id === id)).filter(Boolean);
                return (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl ${project.thumbnailColor} flex items-center justify-center text-white shadow-lg shadow-indigo-500/10 font-black text-lg`}>
                          {project.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{project.name}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter">ID: {project.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-black text-slate-700">
                      {project.client}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xs font-bold text-slate-500">
                      {project.category}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[project.status].replace('bg-', 'border-').replace('text-', 'text-opacity-80 text-')} ${STATUS_COLORS[project.status]}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex -space-x-3">
                        {testers.map((t, idx) => (
                          <div key={idx} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-slate-200 ring-1 ring-slate-100 shadow-sm" title={t?.name}>
                            <img src={t?.avatar} alt="tester" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {testers.length > 3 && (
                          <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                            +{testers.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <button className="px-5 py-2 text-[10px] font-black text-slate-600 bg-white border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-xl transition-all uppercase tracking-widest active:scale-95">
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renderização da Modal via Portal */}
      <ModalPortal />
    </div>
  );
};

export default Projects;
