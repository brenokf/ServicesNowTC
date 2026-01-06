
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getSystemInsights } from '../services/geminiService';
import { User, UserRole, Project, ItemStatus } from '../types';
import { MOCK_PROJECTS, MOCK_USERS } from '../constants';

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
  const isAdmin = user.role === UserRole.ADMIN;

  // Filtra projetos para o usuário comum
  const myProjects = isAdmin 
    ? MOCK_PROJECTS 
    : MOCK_PROJECTS.filter(p => p.assignedUsers.includes(user.id));

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

      {/* Main Grid: Bento Box Style */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* TOP ROW: Stats & AI */}
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
              <p className="text-lg font-bold leading-snug">
                "{aiInsight}"
              </p>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
               <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
               </svg>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Project Listing (NFT STYLE) */}
        <div className="col-span-12">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {isAdmin ? 'Global Allocation Hub' : 'Your Personal Queue'}
            </h3>
            <div className="flex gap-2">
              <button className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-4 py-2 rounded-xl">Filter by Client</button>
              <button className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-xl">List View</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {myProjects.map((project) => (
              <ProjectCard key={project.id} project={project} showTesters={isAdmin} />
            ))}
          </div>
        </div>

        {/* BOTTOM ROW: Activity & Metrics */}
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
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg group-hover:scale-110 transition-transform">
                    {i}
                  </div>
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
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: string, trend: string, icon: string, color: string }> = ({ label, value, trend, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-indigo-100 transition-all">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={icon} />
      </svg>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-3xl font-black text-slate-900 leading-none">{value}</h4>
      <span className={`text-[10px] font-black text-${color}-600 bg-${color}-50 px-2 py-1 rounded-lg`}>{trend}</span>
    </div>
  </div>
);

const ProjectCard: React.FC<{ project: Project, showTesters: boolean }> = ({ project, showTesters }) => {
  const testers = project.assignedUsers.map(id => MOCK_USERS.find(u => u.id === id)).filter(Boolean);

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group hover:-translate-y-2 transition-all hover:shadow-2xl hover:shadow-indigo-100">
      <div className={`h-40 ${project.thumbnailColor} relative flex items-center justify-center p-8 transition-transform group-hover:scale-[1.02] duration-500`}>
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-white shadow-inner">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
           </svg>
        </div>
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
          {project.category}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{project.name}</h4>
          <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">{project.client}</p>
        </div>

        <div className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Health</p>
            <p className="text-sm font-black text-emerald-600">{project.successRate}%</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Executions</p>
            <p className="text-sm font-black text-slate-900">{(project.testsCount / 1000).toFixed(1)}k</p>
          </div>
        </div>

        {showTesters && (
          <div className="pt-2">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest">Allocated Personnel</p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {testers.map((t, idx) => (
                  <div key={idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200 ring-1 ring-slate-100 shadow-sm" title={t?.name}>
                    <img src={t?.avatar} alt="tester" />
                  </div>
                ))}
              </div>
              <span className="text-[9px] font-bold text-slate-400 italic">#{project.id}</span>
            </div>
          </div>
        )}
        
        {!showTesters && (
          <button className="w-full text-[10px] font-black text-white bg-slate-900 py-3 rounded-2xl uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200">
            Open Workspace
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
