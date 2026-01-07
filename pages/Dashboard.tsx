
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getSystemInsights } from '../services/geminiService';
import { User, UserRole, Project, ItemStatus } from '../types';
import { MOCK_PROJECTS, MOCK_USERS, STATUS_COLORS } from '../constants';

const MOCK_ACTIVITY_DATA = [
  { name: 'Mon', active: 32 },
  { name: 'Tue', active: 45 },
  { name: 'Wed', active: 38 },
  { name: 'Thu', active: 52 },
  { name: 'Fri', active: 48 },
  { name: 'Sat', active: 24 },
  { name: 'Sun', active: 18 },
];

const CLIENT_LOCATIONS = [
  { name: 'Nexus Retail', x: '25%', y: '45%' },
  { name: 'Global Bank', x: '45%', y: '35%' },
  { name: 'Internal R&D', x: '75%', y: '55%' },
  { name: 'CyberGov', x: '85%', y: '25%' },
];

interface DashboardProps {
  user: User;
}

type TabType = 'Projeto' | 'LOGS' | 'FUNCION' | 'Performance' | 'bidr' | 'dualband' | 'estab' | 'persona' | 'rotação' | 'rangerate' | 'rssi' | 'amb' | 'fechamento' | 'resultado' | 'ata';

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [aiInsight, setAiInsight] = useState<string>("Sincronizando dados operacionais...");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClient, setSelectedClient] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('Projeto');
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const isAdmin = user.role === UserRole.ADMIN;

  const uniqueClients = ['All', ...new Set(MOCK_PROJECTS.map(p => p.client))];
  const myProjects = isAdmin 
    ? MOCK_PROJECTS 
    : MOCK_PROJECTS.filter(p => p.assignedUsers.includes(user.id));

  const filteredProjects = myProjects.filter(p => 
    selectedClient === 'All' || p.client === selectedClient
  );

  useEffect(() => {
    const fetchInsights = async () => {
      const insight = await getSystemInsights({
        role: user.role,
        projectsCount: myProjects.length,
        health: "Optimized"
      });
      setAiInsight(insight);
    };
    fetchInsights();
  }, [user.id, user.role]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setActiveTab('Projeto');
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  const tabs: TabType[] = ['Projeto', 'LOGS', 'FUNCION', 'Performance', 'bidr', 'dualband', 'estab', 'persona', 'rotação', 'rangerate', 'rssi', 'amb', 'fechamento', 'resultado', 'ata'];

  const ModalPortal = () => {
    if (!isModalOpen || !selectedProject) return null;
    return createPortal(
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl animate-fadeIn" onClick={handleCloseModal}></div>
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
              <button onClick={handleCloseModal} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-slate-100">
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
            {activeTab === 'Projeto' && (
              <div className="animate-fadeIn space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetaItem label="titulo" value={selectedProject.name} />
                  <MetaItem label="fabricante" value="Samsung Electronics" />
                  <MetaItem label="dtu" value="DEV-992-TX" />
                  <MetaItem label="versão do software" value="One UI 6.1 (v.14.2)" />
                  <MetaItem label="tipo de homologação" value="Completa / Tier 1" />
                  <MetaItem label="data" value="12/10/2024" />
                  <MetaItem label="entregas" value="Lote 01, Lote 02" />
                  <MetaItem label="status" value={selectedProject.status} />
                  <MetaItem label="id do caderno" value="CAD-2024-UX-V3" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-100 transition-colors"></div>
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
            {activeTab !== 'Projeto' && (
              <div className="flex flex-col items-center justify-center py-32 animate-fadeIn">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 border border-slate-100">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Conteúdo da Aba {activeTab}</h4>
                <p className="text-slate-500 text-sm mt-2 font-medium">Os dados detalhados para esta seção estão sendo processados pela IA.</p>
              </div>
            )}
          </div>
          <div className="px-10 py-8 border-t border-slate-100 bg-white flex justify-end gap-4 shrink-0">
             <button onClick={handleCloseModal} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all">Finalizar Visualização</button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-fadeIn max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2 block">
            {isAdmin ? 'System Global Overview' : 'Allocated Hub'}
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Welcome, {user.name.split(' ')[0]}
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            {isAdmin 
              ? 'Monitoring all global contracts and allocated testing nodes.' 
              : `You are currently allocated to ${myProjects.length} strategic project(s).`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            Last 30 Days
          </button>
          {isAdmin && (
            <button className="px-6 py-3 bg-indigo-600 rounded-[1.25rem] text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              New Allocation
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox label={isAdmin ? "Global Contracts" : "Assigned Projects"} value={myProjects.length.toString()} trend="+2" icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" color="indigo" />
          <StatBox label="Tests Executed" value={myProjects.reduce((acc, p) => acc + p.testsCount, 0).toLocaleString()} trend="12%" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="emerald" />
          <StatBox label="Allocation Load" value="98.2%" trend="Optimal" icon="M13 10V3L4 14h7v7l9-11h-7z" color="amber" />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-full relative overflow-hidden group shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Insights</span>
              </div>
              <p className="text-lg font-bold leading-snug">"{aiInsight}"</p>
            </div>
          </div>
        </div>

        {/* Global Client Presence Map */}
        <div className="col-span-12">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Global Client Presence Hub
            </h3>
            
            <div className="relative aspect-[21/9] w-full bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 group">
              {/* Stylized Map SVG Background */}
              <svg className="absolute inset-0 w-full h-full opacity-10 text-slate-900" viewBox="0 0 1000 400" fill="currentColor">
                <path d="M150,150 Q200,100 250,150 T350,150 Q450,150 500,200 T650,250 Q750,250 850,200" fill="none" stroke="currentColor" strokeWidth="40" strokeLinecap="round" />
                <circle cx="200" cy="120" r="30" />
                <circle cx="450" cy="180" r="40" />
                <circle cx="750" cy="220" r="35" />
                <circle cx="850" cy="120" r="25" />
              </svg>

              {/* Client Pins */}
              {CLIENT_LOCATIONS.map((loc, idx) => (
                <div 
                  key={idx} 
                  className="absolute cursor-pointer group/pin" 
                  style={{ left: loc.x, top: loc.y }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] animate-pulse"></div>
                    <div className="absolute -inset-2 bg-indigo-600/20 rounded-full animate-ping"></div>
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover/pin:opacity-100 transition-all translate-y-2 group-hover/pin:translate-y-0 z-20">
                      <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl">
                        {loc.name} • ACTIVE NODE
                      </div>
                      <div className="w-3 h-3 bg-slate-900 rotate-45 mx-auto -mt-1.5 shadow-2xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
              {CLIENT_LOCATIONS.map((loc, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{loc.name}</p>
                    <p className="text-xs font-bold text-slate-900">Online & Syncing</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {isAdmin ? 'Allocation Hub' : 'Your Personal Queue'}
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all pr-8 shadow-sm"
                >
                  {uniqueClients.map(c => <option key={c} value={c}>{c === 'All' ? 'Filter by Client' : c}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  Carousel
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="relative group/carousel">
              {filteredProjects.length > 4 && (
                <>
                  <button onClick={() => scrollCarousel('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover/carousel:opacity-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button onClick={() => scrollCarousel('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover/carousel:opacity-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                  </button>
                </>
              )}
              
              <div 
                ref={carouselRef}
                className="flex gap-8 overflow-x-auto snap-x snap-mandatory custom-scrollbar pb-10 px-2 scroll-smooth"
              >
                {filteredProjects.map((project) => (
                  <div key={project.id} className="min-w-[320px] max-w-[320px] snap-start">
                    <ProjectCard project={project} onOpen={() => handleOpenModal(project)} />
                  </div>
                ))}
                {filteredProjects.length === 0 && (
                  <div className="w-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase tracking-widest">
                    No matching projects found.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project & ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl ${project.thumbnailColor} flex items-center justify-center text-white font-black text-lg`}>{project.name.charAt(0)}</div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{project.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">#{project.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-slate-700">{project.client}</td>
                      <td className="px-8 py-5">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[project.status]}`}>
                            {project.status}
                          </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => handleOpenModal(project)} className="text-[10px] font-black text-indigo-600 hover:text-white hover:bg-indigo-600 px-4 py-2 rounded-xl border border-indigo-100 transition-all uppercase tracking-widest">Ver Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ModalPortal />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: string, trend: string, icon: string, color: string }> = ({ label, value, trend, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-indigo-100 transition-all">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={icon} /></svg>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-3xl font-black text-slate-900 leading-none">{value}</h4>
      <span className={`text-[10px] font-black text-${color}-600 bg-${color}-50 px-2 py-1 rounded-lg`}>{trend}</span>
    </div>
  </div>
);

const ProjectCard: React.FC<{ project: Project, onOpen: () => void }> = ({ project, onOpen }) => {
  const testers = project.assignedUsers.map(id => MOCK_USERS.find(u => u.id === id)).filter(Boolean);
  return (
    <div 
      onClick={onOpen}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group cursor-pointer hover:-translate-y-2 transition-all hover:shadow-2xl hover:shadow-indigo-100 h-full flex flex-col"
    >
      <div className={`h-40 ${project.thumbnailColor} relative flex items-center justify-center p-8 transition-transform group-hover:scale-[1.02] duration-500`}>
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-white shadow-inner">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/20">{project.category}</div>
      </div>
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div>
          <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{project.name}</h4>
          <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">{project.client}</p>
        </div>
        <div className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div><p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Health</p><p className="text-sm font-black text-emerald-600">{project.successRate}%</p></div>
          <div className="text-right"><p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Executions</p><p className="text-sm font-black text-slate-900">{(project.testsCount / 1000).toFixed(1)}k</p></div>
        </div>
        <div className="pt-2 flex-1">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest">Personnel</p>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {testers.map((t, idx) => (
                <div key={idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200 ring-1 ring-slate-100 shadow-sm"><img src={t?.avatar} alt="" /></div>
              ))}
            </div>
            <span className="text-[9px] font-bold text-slate-400 italic">#{project.id}</span>
          </div>
        </div>
        <div className="pt-2 flex items-center justify-center border-t border-slate-50">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            Visualizar Detalhes
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
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
  <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-[13px] font-black text-slate-900 truncate">{value}</p>
  </div>
);

export default Dashboard;
