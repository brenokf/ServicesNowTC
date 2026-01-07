
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import Admin from './pages/Admin';
import Projects from './pages/Projects';
import { User, UserRole, ModuleType, ItemStatus, ModuleItem } from './types';
import { MOCK_USERS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (email: string) => {
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
    setShowForgotPassword(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    setCurrentModule('dashboard');
  };

  if (!user) {
    if (showForgotPassword) {
      return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
    }
    return <Login onLogin={handleLogin} onForgotPassword={() => setShowForgotPassword(true)} />;
  }

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'projects':
        return <Projects user={user} />;
      case 'devices':
        const deviceData: ModuleItem[] = [
          { id: 'D001', name: 'Archer AX55', fabricante: 'TP-Link', modelo: 'Archer AX55', hwVersion: 'V1.0', serialNumber: 'SN-TPL-981', mac24: 'A1:B2:C3:D4:E5:01', mac5: 'A1:B2:C3:D4:E5:02', nss24: '2', nss5: '2', status: ItemStatus.ACTIVE, createdAt: '2024-01-10', responsible: 'John Doe' },
          { id: 'D002', name: 'HGW-250', fabricante: 'Huawei', modelo: 'HG8245H', hwVersion: 'V3', serialNumber: 'SN-HUW-221', mac24: 'F9:E8:D7:C6:B5:A1', mac5: 'F9:E8:D7:C6:B5:A2', nss24: '1', nss5: '1', status: ItemStatus.PENDING, createdAt: '2024-02-15', responsible: 'Jane Smith' },
        ];
        return <Modules type="devices" title="Gerenciamento de Dispositivos" initialItems={deviceData} />;
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
        const testData: ModuleItem[] = [
          { id: 'T981', name: 'Protocolo Alpha', status: ItemStatus.SUCCESS, createdAt: '2024-04-10', responsible: 'John Doe', caderno: 'CAD-001', titulo: 'Validar Autenticação L2', categoria: 'Segurança', catTR: 'TR-1', local: 'Lab A', ref: 'REF-88', especif: 'IEEE 802.1X' },
          { id: 'T982', name: 'Protocolo Beta', status: ItemStatus.FAILED, createdAt: '2024-04-10', responsible: 'John Doe', caderno: 'CAD-002', titulo: 'Stress Test WiFi 6', categoria: 'Performance', catTR: 'TR-3', local: 'Câmara RF', ref: 'REF-92', especif: 'MCS11 / 160MHz' },
        ];
        return <Modules type="tests" title="Testes de Validação" initialItems={testData} />;
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
