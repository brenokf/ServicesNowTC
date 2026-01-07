
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import Admin from './pages/Admin';
import Projects from './pages/Projects';
import { User, UserRole, ModuleType, ItemStatus } from './types';
import { MOCK_USERS, MOCK_DEVICES } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);



  // Auto-login for demo purposes or check local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (email: string) => {
    // Find mock user or create default
    const foundUser = MOCK_USERS.find(u => u.email === email) || {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email: email,
      role: UserRole.USER,
      function: 'Operations Operator',
      createdAt: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${email}`
    };
    setUser(foundUser);
    localStorage.setItem('nexus_user', JSON.stringify(foundUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    setCurrentModule('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'projects':
        return <Projects user={user} />;
      case 'devices':
        return <Modules type="devices" title="Gerenciamento de Dispositivos" initialItems={MOCK_DEVICES} />;
      case 'notebooks':
        return <Modules type="notebooks" title="Cadernos de Teste" initialItems={[
          { id: 'N001', name: 'UI Regression Suite', status: ItemStatus.ACTIVE, createdAt: '2024-04-01', responsible: 'John Doe', description: 'Testes de interface de alta fidelidade', tests: '144', type: 'Funcional', approval: '98%' },
          { id: 'N002', name: 'API Load Profile', status: ItemStatus.PENDING, createdAt: '2024-04-05', responsible: 'Admin User', description: 'Validação de estresse de backend', tests: '88', type: 'Performance', approval: '92%' },
        ]} />;
      case 'profiles':
        return <Modules type="profiles" title="System Profiles" initialItems={[
          { id: 'P001', name: 'Staging Environment', status: ItemStatus.ACTIVE, createdAt: '2023-11-20', responsible: 'Admin User', description: 'Ambiente de pré-produção', goodPut: '450 Mbps', txDown: '800 Mbps', txUp: '200 Mbps' },
          { id: 'P002', name: 'Production Mirror', status: ItemStatus.INACTIVE, createdAt: '2023-12-15', responsible: 'Jane Smith', description: 'Cópia exata do ambiente produtivo', goodPut: '980 Mbps', txDown: '1.2 Gbps', txUp: '500 Mbps' },
        ]} />;
      case 'tests':
        return <Modules type="tests" title="Testes de Validação" initialItems={[
          { id: 'T981', name: 'Auth Flow #441', status: ItemStatus.SUCCESS, createdAt: '2024-04-10', responsible: 'John Doe' },
          { id: 'T982', name: 'Checkout Logic #88', status: ItemStatus.FAILED, createdAt: '2024-04-10', responsible: 'John Doe' },
        ]} />;
      case 'admin':
        return user.role === UserRole.ADMIN ? <Admin /> : <Dashboard user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        user={user}
        currentModule={currentModule} 
        onNavigate={setCurrentModule} 
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user} 
          onLogout={handleLogout} 
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        
        <main className="flex-1 overflow-y-auto bg-[#F8F9FD] custom-scrollbar">
          <div className="max-w-[1600px] mx-auto pb-20">
            {renderModule()}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.2s ease-out forwards; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default App;
