
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, UserRole, Project, ItemStatus } from '../types';
import { MOCK_PROJECTS, MOCK_USERS, STATUS_COLORS } from '../constants';

interface ProjectsProps {
  user: User;
}

type TabType = 'Projeto' | 'LOGS' | 'FUNCION' | 'Performance' | 'bidr' | 'dualband' | 'estab' | 'persona' | 'rotação' | 'rangerate' | 'rssi' | 'amb' | 'fechamento' | 'resultado' | 'ata';

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const projects = isAdmin 
    ? MOCK_PROJECTS 
    : MOCK_PROJECTS.filter(p => p.assignedUsers.includes(user.id));

  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('Projeto');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewModal = (project: Project | null = null) => {
    setSelectedProject(project);
    setIsNewModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const handleOpenViewModal = (project: Project) => {
    setSelectedProject(project);
    setActiveTab('Projeto');
    setIsViewModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModals = () => {
    setIsNewModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  const tabs: TabType[] = ['Projeto', 'LOGS', 'FUNCION', 'Performance', 'bidr', 'dualband', 'estab', 'persona', 'rotação', 'rangerate', 'rssi', 'amb', 'fechamento', 'resultado', 'ata'];

  return (
    <div className="p-4 lg:p-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Project Allocation Hub</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie os nós de homologação globais.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => handleOpenNewModal()} 
            className="bg-[#e1251a] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-[#bd1c14] transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Novo Projeto
          </button>
        )}
      </div>
      
      <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Pesquisar projetos ativos..." 
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:bg-white transition-all outline-none" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-12 animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">titulo</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">software</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">cliente</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">hml</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">dut</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">cad.</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">status</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">resultado</th>
                <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">data</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-colors group text-[13px]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 shrink-0 rounded-xl ${project.thumbnailColor} flex items-center justify-center text-white shadow-md font-black text-sm`}>
                        {project.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{project.name}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">#{project.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-600 italic">v1.2.4</td>
                  <td className="px-4 py-4 whitespace-nowrap font-black text-slate-700">{project.client}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs font-bold text-indigo-500 uppercase">{project.category}</td>
                  <td className="px-4 py-4 whitespace-nowrap font-mono text-slate-400 text-[11px]">DEV-882</td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-500 italic">v3.2</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_COLORS[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${project.successRate}%` }}></div>
                       </div>
                       <span className="font-black text-slate-900">{project.successRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-400 font-bold text-[11px]">
                    2024-10-12
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => handleOpenViewModal(project)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Ver</button>
                       <button onClick={() => handleOpenNewModal(project)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isNewModalOpen && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-fadeIn" onClick={handleCloseModals}></div>
          <div className="relative z-[10001] w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-[2.5rem] shadow-2xl animate-scaleUp overflow-hidden border border-slate-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedProject ? 'Editar Projeto' : 'Cadastrar Novo Projeto'}</h3>
                <p className="text-sm text-slate-500 font-medium">Configure os parâmetros técnicos do projeto</p>
              </div>
              <button onClick={handleCloseModals} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Projeto / Modelo</label><input type="text" defaultValue={selectedProject?.name} placeholder="Ex: iPhone 16 Pro" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-indigo-500 outline-none transition-all" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fabricante</label><input type="text" placeholder="Ex: Apple Inc." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-indigo-500 outline-none transition-all" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parceria</label><input type="text" defaultValue={selectedProject?.client} placeholder="Ex: Carrier Global" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-indigo-500 outline-none transition-all" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Produto</label><select defaultValue={selectedProject?.category} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none appearance-none cursor-pointer"><option>Smartphone</option><option>Tablet</option><option>Wearable</option><option>IoT Device</option></select></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Homologação</label><select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none appearance-none cursor-pointer"><option>Completa</option><option>Delta / Parcial</option><option>Renovação</option><option>Manutenção</option></select></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profile</label><input type="text" placeholder="Ex: High-End_v2" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-indigo-500 outline-none transition-all" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Versão de Software</label><input type="text" placeholder="Ex: iOS 18.0.1" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-indigo-500 outline-none transition-all" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Versão do Caderno</label><input type="text" placeholder="Ex: v3.44_2024" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-indigo-500 outline-none transition-all" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Esteira</label><input type="text" placeholder="Ex: FastTrack-A" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-indigo-500 outline-none transition-all" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Coordenador</label><input type="text" placeholder="Nome do responsável" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:border-indigo-500 outline-none transition-all" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Início</label><input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fim de Testes</label><input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Workshop</label><input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Resumo Exec</label><input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none" /></div>
                <div className="hidden md:block"></div>
                <div className="md:col-span-3 space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label><textarea rows={4} placeholder="Notas adicionais sobre o escopo ou riscos do projeto..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-semibold outline-none resize-none focus:border-indigo-500 transition-all"></textarea></div>
              </form>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
              <button onClick={handleCloseModals} className="flex-1 py-4 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-2xl uppercase tracking-widest hover:bg-slate-50 transition-all">Voltar</button>
              <button onClick={handleCloseModals} className="flex-[2] py-4 text-xs font-black text-white bg-[#e1251a] rounded-2xl shadow-xl uppercase tracking-widest hover:bg-[#bd1c14] transition-all">{selectedProject ? 'Salvar Alterações' : 'Cadastrar Projeto'}</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {isViewModalOpen && selectedProject && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl animate-fadeIn" onClick={handleCloseModals}></div>
          <div className="relative z-[10001] w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#FDFDFF] rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.4)] animate-scaleUp overflow-hidden border border-white/20">
            
            <div className="px-10 py-8 bg-white border-b border-slate-100 shrink-0">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-[2rem] ${selectedProject.thumbnailColor} flex items-center justify-center text-white text-3xl font-black shadow-2xl`}>
                    {selectedProject.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedProject.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[selectedProject.status]}`}>{selectedProject.status}</span>
                    </div>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">{selectedProject.client} • Terminal Homologation System</p>
                  </div>
                </div>
                <button onClick={handleCloseModals} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-slate-100">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex overflow-x-auto custom-scrollbar -mb-8 pb-4 gap-2 no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab 
                        ? 'bg-slate-900 text-white shadow-xl translate-y-[-2px]' 
                        : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-white">
              {/* Universal Metadata Header for all tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10 animate-fadeIn">
                <MetaItem label="titulo" value={selectedProject.name} />
                <MetaItem label="fabricante" value="Samsung Electronics" />
                <MetaItem label="DUT" value="DEV-992-TX" />
                <MetaItem label="versão do software" value="One UI 6.1 (v.14.2)" />
                <MetaItem label="tipo de homologação" value="Completa / Tier 1" />
                <MetaItem label="data" value="12/10/2024" />
                <MetaItem label="entregas" value="Lote 01, Lote 02" />
                <MetaItem label="status" value={selectedProject.status} />
                <MetaItem label="id do caderno" value="CAD-2024-UX-V3" />
              </div>

              <div className="w-full h-px bg-slate-100 mb-10"></div>

              {activeTab === 'Projeto' && (
                <div className="space-y-10 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        Caderno de Funcionalidade
                      </h4>
                      <div className="grid grid-cols-3 gap-6">
                        <CounterItem label="OK" value="245" color="text-emerald-500" />
                        <CounterItem label="FALHA" value="12" color="text-rose-500" />
                        <CounterItem label="NST" value="08" color="text-amber-500" />
                        <CounterItem label="NA" value="15" color="text-slate-400" />
                        <CounterItem label="PENDENTE" value="44" color="text-indigo-400" />
                        <CounterItem label="TOTAL" value="324" color="text-slate-900" isBold />
                      </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Caderno de Performance
                      </h4>
                      <div className="grid grid-cols-3 gap-6">
                        <CounterItem label="STABILITY" value="98%" color="text-emerald-400" />
                        <CounterItem label="THROUGHPUT" value="1.2 Gbps" color="text-indigo-300" />
                        <CounterItem label="LATENCY" value="14 ms" color="text-amber-300" />
                        <CounterItem label="HEAT MAP" value="OPTIMIZED" color="text-emerald-400" />
                        <CounterItem label="BATTERY" value="1.4%/h" color="text-emerald-400" />
                        <CounterItem label="CPU LOAD" value="18%" color="text-indigo-300" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Descrição do Projeto</h4>
                     <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                       "Dispositivo em fase final de homologação. Todas as bandas LTE e 5G (SA/NSA) foram validadas com sucesso em ambiente controlado. Próximo passo: Validação de Handover em rota urbana (Persona Test)."
                     </p>
                  </div>
                </div>
              )}

              {activeTab === 'LOGS' && (
                <div className="space-y-10 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Exibir Coletas
                    </button>
                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center justify-center gap-2 hover:bg-black transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Exportar Resultados
                    </button>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logs Coletados</h4>
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">LIVE CAPTURE</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-white border-b border-slate-50">
                            <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Arquivo</th>
                            <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Excluir</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <span className="text-xs font-bold text-slate-900">yeyuuyeiieu-exoiq.txt</span>
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Coletado</span>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <button className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <span className="text-xs font-bold text-slate-900">system-boot-trace-882.log</span>
                              </div>
                            </td>
                            <td className="px-8 py-4">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Coletado</span>
                            </td>
                            <td className="px-8 py-4 text-right">
                              <button className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'FUNCION' && (
                <div className="space-y-10 animate-fadeIn">
                  <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Status do Caderno</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <CounterItem label="OK (%)" value="75%" color="text-emerald-500" />
                      <CounterItem label="FALHA (%)" value="4%" color="text-rose-500" />
                      <CounterItem label="N/A (%)" value="10%" color="text-slate-400" />
                      <CounterItem label="NST (%)" value="6%" color="text-amber-500" />
                      <CounterItem label="PENDENTE" value="5/100%" color="text-indigo-400" />
                      <CounterItem label="TOTAL" value="100%" color="text-slate-900" isBold />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6 px-2">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                        Testes de Funcionalidades
                      </h3>
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">45 TESTES CARREGADOS</span>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">#</th>
                              <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                              <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                              <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Subcategoria</th>
                              <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Título</th>
                              <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Resultado Obtido</th>
                              <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Responsável</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {[1, 2, 3].map((i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors text-[12px]">
                                <td className="px-6 py-4 font-mono text-slate-400">{i}</td>
                                <td className="px-4 py-4 font-black text-indigo-600">FNC-00{i}</td>
                                <td className="px-4 py-4 font-bold text-slate-500 uppercase">WiFi Security</td>
                                <td className="px-4 py-4 font-medium text-slate-400 italic">WPA3-SAE</td>
                                <td className="px-4 py-4 font-black text-slate-900">Handshake Validation #{i}</td>
                                <td className="px-4 py-4 font-medium text-slate-600">Protocol completed in 14ms</td>
                                <td className="px-4 py-4">
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">OK</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden ring-1 ring-slate-100">
                                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                                    </div>
                                    <span className="font-bold text-slate-600 truncate max-w-[80px]">Eng. Carlos</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== 'Projeto' && activeTab !== 'LOGS' && activeTab !== 'FUNCION' && (
                <div className="space-y-10 animate-fadeIn">
                  <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 text-slate-300 border border-slate-100 shadow-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight">Conteúdo: {activeTab}</h4>
                    <p className="text-slate-500 text-xs mt-2 font-medium">Renderização de dados técnicos específicos do módulo.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-10 py-8 border-t border-slate-100 bg-white flex justify-end gap-4 shrink-0">
               <button onClick={handleCloseModals} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all">Finalizar Visualização</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const CounterItem = ({ label, value, color, isBold }: { label: string, value: string, color: string, isBold?: boolean }) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-xl ${isBold ? 'font-black' : 'font-bold'} ${color}`}>{value}</span>
  </div>
);

const MetaItem = ({ label, value }: { label: string, value: string }) => (
  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors">
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-[11px] font-black text-slate-900 truncate">{value}</p>
  </div>
);

export default Projects;
