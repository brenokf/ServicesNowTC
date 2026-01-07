
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, AuditLog } from '../types';
import { MOCK_AUDIT_LOGS } from '../constants';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const notifyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setIsNotifyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtro seguro para evitar crash se user ou MOCK_AUDIT_LOGS forem nulos
  const safeUserName = user?.name || 'User';
  const rawLogs = MOCK_AUDIT_LOGS || [];
  const notifications: AuditLog[] = (user?.role === UserRole.ADMIN)
    ? rawLogs
    : rawLogs.filter(log => log.user === safeUserName);

  const hasNotifications = notifications.length > 0;

  const timeString = currentTime.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit'
  });

  const dateString = currentTime.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).replace('.', '').toUpperCase();

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10 shrink-0 border-b border-slate-100/50">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        
        <div className="relative max-w-md w-full hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Busca operacional..." 
            className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all placeholder:text-slate-300 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden xl:flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-[1.25rem] border border-slate-100 group transition-all duration-500">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-[14px] font-black text-slate-900 tabular-nums">
              {timeString}
            </span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-900 leading-none">{dateString}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {timezone.split('/')[1] || timezone}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={notifyRef}>
            <button 
              onClick={() => setIsNotifyOpen(!isNotifyOpen)}
              className={`relative p-2.5 rounded-2xl border transition-all active:scale-95 ${
                isNotifyOpen 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {hasNotifications && (
                <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full border-2 ${
                  isNotifyOpen ? 'bg-emerald-400 border-slate-900' : 'bg-rose-500 border-white animate-pulse'
                }`}></span>
              )}
            </button>

            {isNotifyOpen && (
              <div className="absolute right-0 mt-4 w-[340px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-scaleUp z-50">
                <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Alertas</h4>
                  <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-black text-indigo-500 uppercase">
                                  {notif.user === safeUserName ? 'VOCÊ' : (notif.user || 'SISTEMA').toUpperCase()}
                                </span>
                                <span className="text-[9px] font-bold text-slate-300">
                                  {notif.timestamp?.includes(' ') ? notif.timestamp.split(' ')[1] : notif.timestamp || ''}
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-900 leading-snug">{notif.action}</p>
                              <p className="text-[10px] font-medium text-slate-400 truncate mt-1 italic">{notif.details || 'Log operacional'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-slate-100 h-10">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none">{user?.name || 'User'}</p>
                <p className="text-[9px] font-black text-indigo-500/70 uppercase tracking-[0.1em] mt-1.5">{user?.function || 'Operator'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-100 shadow-sm">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'N'}&background=6366f1&color=fff`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-lg active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
