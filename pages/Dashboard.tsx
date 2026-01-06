
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

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [aiInsight, setAiInsight] = useState<string>("Sincronizando dados operacionais...");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClient, setSelectedClient] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const isAdmin = user.role === UserRole.ADMIN;

  // Filtros
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
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  const ModalPortal = () => {
    if (!isModalOpen || !selectedProject) return null;
    return createPortal(
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-hidden">
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-fadeIn" onClick={handleCloseModal}></div>
        <div className="relative z-[10001] w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl animate-scaleUp overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedProject.name}</h3>
              <p className="text-sm text-slate-500 font-medium">Project Workspace • {selectedProject.client}</p>
            </div>
            <button onClick={handleCloseModal} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
             <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[selectedProject.status]}`}>
                    {selectedProject.status}
                  </span>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
                  <p className="text-xl font-black text-emerald-600">{selectedProject.successRate}%</p>
                </div>
             </div>
             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Alocação de Equipe</h4>
                <div className="flex flex-wrap gap-3">
                   {selectedProject.assignedUsers.map(id => {
                     const u = MOCK_USERS.find(user => user.id === id);
                     return (
                       <div key={id} className="flex items-center gap-3 p-2 pr-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <img src={u?.avatar} className="w-8 h-8 rounded-full shadow-sm" alt="" />
                         <span className="text-xs font-bold text-slate-700">{u?.name}</span>
                       </div>
                     )
                   })}
                </div>
             </div>
          </div>
          <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
            <button onClick={handleCloseModal} className="flex-1 py-4 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-2xl uppercase tracking-widest">Fechar</button>
            <button className="flex-[2] py-4 text-xs font-black text-white bg-indigo-600 rounded-2xl uppercase tracking-widest shadow-xl shadow-indigo-200">Acessar Console</button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-fadeIn max-w-[1600px] mx-auto">
      {/* Header Section */}
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
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-full relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Insights</span>
              </div>
              <p className="text-lg font-bold leading-snug">"{aiInsight}"</p>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
               <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /></svg>
            </div>
          </div>
        </div>

        {/* SECTION: Global Allocation Hub with Carousel */}
        <div className="col-span-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {isAdmin ? 'Global Allocation Hub' : 'Your Personal Queue'}
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
                  List View
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
                        <button onClick={() => handleOpenModal(project)} className="text-[10px] font-black text-indigo-600 hover:text-white hover:bg-indigo-600 px-4 py-2 rounded-xl border border-indigo-100 transition-all uppercase tracking-widest">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Activity & Performance (Bottom row) */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-slate-900">Allocation Timeline</h3>
              <div className="flex -space-x-3">
                {MOCK_USERS.map((u, i) => (
                  <img key={i} src={u.avatar} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt={u.name} />
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-[2rem] hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg group-hover:scale-110 transition-transform">{i}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Client Sync-Report #{1000 + i}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase mt-1">Status Report • Priority Alpha</p>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">Allocated</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 h-full">
             <h3 className="text-xl font-black text-slate-900 mb-8">Performance Curves</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_ACTIVITY_DATA}>
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="active" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorPv)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-6 bg-slate-50 rounded-[2rem] text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Contract Health</p>
                  <p className="text-2xl font-black text-indigo-600">94.8%</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Success Margin</p>
                  <p className="text-2xl font-black text-slate-900">12%</p>
                </div>
             </div>
          </div>
        </div>
      </div>
      <ModalPortal />
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
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group hover:-translate-y-2 transition-all hover:shadow-2xl hover:shadow-indigo-100 h-full flex flex-col">
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
        <button onClick={onOpen} className="w-full text-[10px] font-black text-white bg-slate-900 py-3 rounded-2xl uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200 active:scale-95">Open Workspace</button>
      </div>
    </div>
  );
};

export default Dashboard;
