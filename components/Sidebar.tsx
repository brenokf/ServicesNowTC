
import React from 'react';
import { UserRole, ModuleType, User } from '../types';
import { MOCK_PROJECTS } from '../constants';

interface SidebarProps {
  user: User;
  currentModule: ModuleType;
  onNavigate: (module: ModuleType) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentModule, onNavigate, isMobileOpen, onCloseMobile }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  
  // Projects to display in secondary section
  const sidebarProjects = isAdmin 
    ? MOCK_PROJECTS.slice(0, 3) 
    : MOCK_PROJECTS.filter(p => p.assignedUsers.includes(user.id));

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'devices', label: 'Devices', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'tests', label: 'Test Suites', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const adminItem = { id: 'admin', label: 'Admin Panel', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white transition-all duration-500 ease-in-out lg:static lg:translate-x-0
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all" 
          onClick={onCloseMobile}
        />
      )}

      <div className={sidebarClasses}>
        <div className="flex flex-col h-full">
          <div className="flex items-center px-10 h-24">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-indigo-600/30 text-lg">N</div>
              <span className="text-2xl font-black tracking-tightest">Nexus</span>
            </div>
          </div>

          <nav className="flex-1 px-6 pt-6 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Main Console</p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as ModuleType);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-3xl text-sm font-bold transition-all ${
                  currentModule === item.id 
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 translate-x-1' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}

            <div className="pt-8">
              <p className="px-4 pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Allocated Projects
              </p>
              <div className="space-y-1">
                {sidebarProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onNavigate('dashboard');
                      onCloseMobile();
                    }}
                    className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/50 transition-all group"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${project.thumbnailColor} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div className="pt-10">
                <p className="px-4 pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Management</p>
                <button
                  onClick={() => {
                    onNavigate('admin');
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-bold transition-all ${
                    currentModule === 'admin' 
                      ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 translate-x-1' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={adminItem.icon} />
                  </svg>
                  {adminItem.label}
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
