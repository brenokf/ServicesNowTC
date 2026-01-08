
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getSystemInsights } from '../services/geminiService';
import { User, UserRole, Project, ItemStatus } from '../types';
import { MOCK_PROJECTS, MOCK_USERS, STATUS_COLORS } from '../constants';

const MOCK_ACTIVITY_DATA = [
  { name: 'Mon', active: 32, success: 28 },
  { name: 'Tue', active: 45, success: 40 },
  { name: 'Wed', active: 38, success: 35 },
  { name: 'Thu', active: 52, success: 48 },
  { name: 'Fri', active: 48, success: 44 },
  { name: 'Sat', active: 24, success: 22 },
  { name: 'Sun', active: 18, success: 17 },
];

const MOCK_REGIONAL_DATA = [
  { region: 'US-E', latency: 42, quality: 98 },
  { region: 'EU-W', latency: 31, quality: 99 },
  { region: 'ASIA', latency: 65, quality: 92 },
  { region: 'BR', latency: 54, quality: 95 },
];

const MOCK_DISTRIBUTION_DATA = [
  { name: 'iOS', value: 400, color: '#4f46e5' },
  { name: 'Android', value: 300, color: '#10b981' },
  { name: 'Web', value: 300, color: '#f59e0b' },
  { name: 'API', value: 200, color: '#ef4444' },
];

interface MapNode {
  id: number;
  name: string;
  position: { lat: number; lng: number };
  type: 'Client' | 'Tester';
  city: string;
  status: 'Online' | 'Busy' | 'Offline';
  activity: string;
}

const GLOBAL_NODES: MapNode[] = [
  { id: 1, name: "TechCorp Inc.", type: "Client", position: { lat: 40.7128, lng: -74.0060 }, city: "New York", status: 'Online', activity: 'iOS Regression' },
  { id: 2, name: "Global Retail", type: "Client", position: { lat: 51.5074, lng: -0.1278 }, city: "London", status: 'Online', activity: 'Inventory Sync' },
  { id: 3, name: "Beta Tester Group", type: "Tester", position: { lat: 35.6762, lng: 139.6503 }, city: "Tokyo", status: 'Online', activity: 'Manual QA' },
  { id: 4, name: "AutoManufacture", type: "Client", position: { lat: 52.5200, lng: 13.4050 }, city: "Berlin", status: 'Online', activity: 'HMI Testing' },
  { id: 5, name: "QA Experts Ltd", type: "Tester", position: { lat: -23.5505, lng: -46.6333 }, city: "São Paulo", status: 'Online', activity: 'Load Balance' },
  { id: 6, name: "FinServe Bank", type: "Client", position: { lat: 1.3521, lng: 103.8198 }, city: "Singapore", status: 'Online', activity: 'Security Patch' },
  { id: 8, name: "MediCare Systems", type: "Client", position: { lat: 48.8566, lng: 2.3522 }, city: "Paris", status: 'Online', activity: 'Compliance Audit' },
];

const createCustomIcon = (type: 'Client' | 'Tester', status: string) => {
  const color = type === 'Client' ? '#4f46e5' : '#10b981';
  const shadowColor = type === 'Client' ? 'rgba(79,70,229,0.4)' : 'rgba(16,185,129,0.4)';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="width: 14px; height: 14px; background-color: ${color}; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px ${shadowColor};"></div>
        ${status === 'Online' ? `<div style="position: absolute; width: 20px; height: 20px; background-color: ${color}; opacity: 0.3; border-radius: 50%; animation: ping 2s infinite;"></div>` : ''}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [aiInsight, setAiInsight] = useState<string>("Sincronizando inteligência operacional...");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClient, setSelectedClient] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const isAdmin = user.role === UserRole.ADMIN;

  const uniqueClients = ['All', ...new Set(MOCK_PROJECTS.map(p => p.client))];
  const myProjects = isAdmin 
    ? MOCK_PROJECTS 
    : MOCK_PROJECTS.filter(p => p.assignedUsers.includes(user.id));

  const filteredProjects = myProjects.filter(p => 
    selectedClient === 'All' || p.client === selectedClient
  );

  const pendingCount = MOCK_PROJECTS.filter(p => p.status === ItemStatus.PENDING).length;

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const insight = await getSystemInsights({
          role: user.role,
          projectsCount: myProjects.length,
          health: "Optimized",
          nodeLoad: "88%"
        });
        setAiInsight(insight);
      } catch (e) {
        setAiInsight("Análise indisponível no momento.");
      }
    };
    fetchInsights();
  }, [user.id, user.role, myProjects.length]);

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
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl animate-fadeIn" onClick={handleCloseModal}></div>
        <div className="relative z-[10001] w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl animate-scaleUp overflow-hidden border border-white/20 p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${selectedProject.thumbnailColor} flex items-center justify-center text-white text-xl font-black shadow-lg`}>
                {selectedProject.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedProject.name}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedProject.client}</p>
              </div>
            </div>
            <button onClick={handleCloseModal} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
               <span className="text-sm font-black text-slate-900">{selectedProject.status}</span>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Health Score</span>
               <span className="text-sm font-black text-indigo-600">{selectedProject.successRate}%</span>
             </div>
          </div>
          <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 italic text-slate-600 text-sm">
            Sincronização operacional completa. Relatórios detalhados disponíveis no módulo de Projetos.
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
            Executive Intelligence Console
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            STB Dashboard
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Monitorando {GLOBAL_NODES.length} nós de infraestrutura e {myProjects.length} fluxos de trabalho.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox label="Active Projects" value={myProjects.length.toString()} trend="+2" icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" color="indigo" />
          <StatBox label="Health Score" value="94.2%" trend="Stable" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="emerald" />
          <StatBox label="Node Capacity" value="88%" trend="Optimal" icon="M13 10V3L4 14h7v7l9-11h-7z" color="amber" />
        </div>

            <div className="col-span-12 lg:col-span-4">
             <div className="bg-white rounded-[2.5rem] p-8 text-slate-900 h-full relative overflow-hidden shadow-sm border border-slate-100">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projetos Pendentes</span>
               </div>
               <p className="text-5xl font-black mt-4">{pendingCount}</p>
               <p className="text-sm text-slate-500 mt-2">Total de projetos com status <strong>PENDING</strong></p>
             </div>
            </div>

        {isAdmin && (
          <div className="col-span-12">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Hub Global de Clientes
                </h3>
                <div className="flex items-center gap-6 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clientes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Testers</span>
                  </div>
                </div>
              </div>
              
              <div className="relative aspect-[21/9] w-full bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl">
                <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; OSM' />
                  {GLOBAL_NODES.map((node) => (
                    <Marker key={node.id} position={[node.position.lat, node.position.lng]} icon={createCustomIcon(node.type, node.status)}>
                      <Popup className="custom-popup">
                        <div className="p-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${node.type === 'Client' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>{node.type}</span>
                            <span className={`text-[9px] font-black uppercase ${node.status === 'Online' ? 'text-emerald-500' : 'text-slate-400'}`}>{node.status}</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mb-1">{node.name}</h4>
                          <p className="text-[10px] font-bold text-slate-500">{node.city}</p>
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="text-[9px] font-black text-indigo-500 uppercase mb-0.5">Atividade Atual</p>
                            <p className="text-xs font-medium text-slate-700">{node.activity}</p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Throughput do Sistema</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Carga em Tempo Real</p>
                </div>
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">LIVE</span>
              </div>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_ACTIVITY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px'}} />
                    <Area type="monotone" dataKey="active" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100">
              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Desempenho Regional</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Latência Média (ms)</p>
              </div>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_REGIONAL_DATA} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px'}} />
                    <Bar dataKey="latency" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Hub de Alocação</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={selectedClient} 
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all pr-8 shadow-sm"
                >
                  {uniqueClients.map(c => <option key={c} value={c}>{c === 'All' ? 'Filtrar por Cliente' : c}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>
          
          <div ref={carouselRef} className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-8' : 'grid-cols-1 gap-4'} animate-fadeIn pb-10 px-2`}>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={() => handleOpenModal(project)} />
            ))}
          </div>
        </div>
      </div>
      <ModalPortal />
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: string, trend: string, icon: string, color: string }> = ({ label, value, trend, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-indigo-100 transition-all">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={icon} /></svg>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-3xl font-black text-slate-900 leading-none">{value}</h4>
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{trend}</span>
    </div>
  </div>
);

const ProjectCard: React.FC<{ project: Project, onOpen: () => void }> = ({ project, onOpen }) => {
  const testers = project.assignedUsers.map(id => MOCK_USERS.find(u => u.id === id)).filter(Boolean);
  return (
    <div onClick={onOpen} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group cursor-pointer hover:-translate-y-2 transition-all hover:shadow-2xl hover:shadow-indigo-100 h-full flex flex-col">
      <div className={`h-32 ${project.thumbnailColor} relative flex items-center justify-center p-8 transition-transform group-hover:scale-[1.02] duration-500`}>
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-white shadow-inner font-black text-xl">{project.name.charAt(0)}</div>
      </div>
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div>
          <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{project.name}</h4>
          <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">{project.client}</p>
        </div>
        <div className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div><p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Saúde</p><p className="text-sm font-black text-emerald-600">{project.successRate}%</p></div>
          <div className="text-right"><p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Execuções</p><p className="text-sm font-black text-slate-900">{(project.testsCount / 1000).toFixed(1)}k</p></div>
        </div>
        <div className="flex items-center justify-between pt-2">
            <div className="flex -space-x-2">
              {testers.map((t, idx) => (
                <div key={idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200 ring-1 ring-slate-100 shadow-sm"><img src={t?.avatar} alt="" /></div>
              ))}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">Detalhes <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg></span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
