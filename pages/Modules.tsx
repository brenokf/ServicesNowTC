
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ModuleType, ModuleItem, ItemStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface ModulesProps {
  type: ModuleType;
  title: string;
  initialItems: ModuleItem[];
}

interface SpecItem {
  id: string;
  name: string;
  category: string;
  refDownload: string;
  refUpload: string;
  selected: boolean;
  caderno?: string;
  titulo?: string;
  ref?: string;
  catTR?: string;
  local?: string;
}

const INITIAL_SPECS: SpecItem[] = Array.from({ length: 120 }, (_, i) => ({
  id: `TST-${200 + i}`,
  name: `Teste de Protocolo #${i + 1}`,
  category: i % 5 === 0 ? 'L2' : i % 3 === 0 ? 'L3' : 'RF',
  refDownload: '',
  refUpload: '',
  selected: false,
  caderno: `BASE-v${1 + (i % 5)}`,
  titulo: `Validação de Camada ${i % 2 === 0 ? 'Física' : 'Enlace'} Tipo-${i}`,
  ref: `ANATEL-0${i}`,
  catTR: `TR-${(i % 10) + 1}`,
  local: i % 3 === 0 ? 'Lab RF' : i % 3 === 1 ? 'Câmara Shield' : 'Field Test'
}));

const Modules: React.FC<ModulesProps> = ({ type, title, initialItems }) => {
  const [items, setItems] = useState<ModuleItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [currentItem, setCurrentItem] = useState<ModuleItem | null>(null);
  
  const [specSearch, setSpecSearch] = useState('');
  const [specs, setSpecs] = useState<SpecItem[]>(INITIAL_SPECS);

  const filteredItems = items.filter(item => 
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.fabricante || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.modelo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.titulo || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSpecs = useMemo(() => {
    return specs.filter(spec => 
      spec.id.toLowerCase().includes(specSearch.toLowerCase()) ||
      spec.titulo?.toLowerCase().includes(specSearch.toLowerCase()) ||
      spec.caderno?.toLowerCase().includes(specSearch.toLowerCase())
    );
  }, [specSearch, specs]);

  const isAllSelected = filteredSpecs.length > 0 && filteredSpecs.every(s => s.selected);

  const handleCreateNew = () => {
    setCurrentItem(null);
    setIsViewOnly(false);
    setSpecs(INITIAL_SPECS);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleEdit = (item: ModuleItem) => {
    setCurrentItem(item);
    setIsViewOnly(false);
    if (type === 'profiles' || type === 'notebooks') {
      setSpecs(INITIAL_SPECS.map((s, i) => i < 15 ? { ...s, selected: true } : s));
    }
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleView = (item: ModuleItem) => {
    setCurrentItem(item);
    setIsViewOnly(true);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const toggleAllSpecs = () => {
    if (isViewOnly) return;
    const targetState = !isAllSelected;
    const filteredIds = new Set(filteredSpecs.map(s => s.id));
    setSpecs(prev => prev.map(s => 
      filteredIds.has(s.id) ? { ...s, selected: targetState } : s
    ));
  };

  const toggleSpec = (id: string) => {
    if (isViewOnly) return;
    setSpecs(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const renderTableHeader = () => {
    if (type === 'tests') {
      return (
        <>
          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">id</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">caderno</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">titulo</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">categoria</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">cat. tr</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">local</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">ref</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">especif</th>
        </>
      );
    }
    if (type === 'devices') {
      return (
        <>
          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">#</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">fabricante</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">modelo</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">ver. hw</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">#serie</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">mac 2.4ghz</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">mac 5ghz</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">nss(2.4/5)</th>
        </>
      );
    }
    if (type === 'notebooks') {
      return (
        <>
          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">id</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">descrição</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">tipo de caderno</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">testes</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">cadastro</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">aprovação</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">nome</th>
        </>
      );
    }
    if (type === 'profiles') {
      return (
        <>
          <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">id</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">descrição</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">good put</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">tx down</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">tx up</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">nome</th>
          <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">cadastro</th>
        </>
      );
    }
    return (
      <>
        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">ID</th>
        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Nome</th>
        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status</th>
      </>
    );
  };

  const renderTableRow = (item: ModuleItem) => {
    if (type === 'tests') {
      return (
        <>
          <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-400">#{item.id}</td>
          <td className="px-4 py-4 text-[10px] font-black text-indigo-500 uppercase">{item.caderno || '-'}</td>
          <td className="px-4 py-4 text-xs font-bold text-slate-900 truncate max-w-[150px]">{item.titulo || item.name}</td>
          <td className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase">{item.categoria || '-'}</td>
          <td className="px-4 py-4 text-[10px] font-black text-slate-600">{item.catTR || '-'}</td>
          <td className="px-4 py-4 text-[10px] font-bold text-slate-500 italic">{item.local || '-'}</td>
          <td className="px-4 py-4 text-[10px] font-mono font-bold text-slate-400">{item.ref || '-'}</td>
          <td className="px-4 py-4 text-[10px] font-bold text-slate-500 truncate max-w-[100px]">{item.especif || '-'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => handleView(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
              <button onClick={() => handleEdit(item)} className="p-2 text-indigo-400 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
            </div>
          </td>
        </>
      );
    }
    if (type === 'devices') {
      return (
        <>
          <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-400">#{item.id}</td>
          <td className="px-4 py-4 text-xs font-black text-slate-900 uppercase">{item.fabricante || 'N/A'}</td>
          <td className="px-4 py-4 text-xs font-bold text-indigo-600">{item.modelo || item.name}</td>
          <td className="px-4 py-4 text-xs font-bold text-slate-500">{item.hwVersion || '-'}</td>
          <td className="px-4 py-4 text-[10px] font-mono font-bold text-slate-400">{item.serialNumber || '-'}</td>
          <td className="px-4 py-4 text-[10px] font-mono text-slate-500 uppercase">{item.mac24 || '-'}</td>
          <td className="px-4 py-4 text-[10px] font-mono text-slate-500 uppercase">{item.mac5 || '-'}</td>
          <td className="px-4 py-4 text-xs font-black text-slate-900">{item.nss24 || 0}/{item.nss5 || 0}</td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => handleView(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
              <button onClick={() => handleEdit(item)} className="p-2 text-indigo-400 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
            </div>
          </td>
        </>
      );
    }
    if (type === 'notebooks') {
      return (
        <>
          <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-400">#{item.id}</td>
          <td className="px-4 py-4 text-xs font-medium text-slate-500 italic truncate max-w-[150px]">{item.description || '-'}</td>
          <td className="px-4 py-4 text-[10px] font-black text-indigo-500 uppercase tracking-tight">{item.type || 'N/A'}</td>
          <td className="px-4 py-4 text-xs font-bold text-slate-900">{item.tests || '0'}</td>
          <td className="px-4 py-4 text-xs font-bold text-slate-400">{item.createdAt}</td>
          <td className="px-4 py-4 text-xs font-black text-emerald-600">{item.approval || '100%'}</td>
          <td className="px-4 py-4 text-xs font-bold text-slate-900">{item.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => handleView(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 transition-all rounded-lg border border-slate-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
              <button onClick={() => handleEdit(item)} className="p-2 text-indigo-400 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all rounded-lg border border-indigo-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
            </div>
          </td>
        </>
      );
    }
    if (type === 'profiles') {
      return (
        <>
          <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-400">#{item.id}</td>
          <td className="px-4 py-4 text-xs font-medium text-slate-500 italic truncate max-w-[150px]">{item.description || '-'}</td>
          <td className="px-4 py-4 text-xs font-black text-slate-900">{item.goodPut || '-'}</td>
          <td className="px-4 py-4 text-xs font-black text-slate-900">{item.txDown || '-'}</td>
          <td className="px-4 py-4 text-xs font-black text-slate-900">{item.txUp || '-'}</td>
          <td className="px-4 py-4 text-xs font-bold text-slate-900">{item.name}</td>
          <td className="px-4 py-4 text-xs font-bold text-slate-400">{item.createdAt}</td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => handleView(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
              <button onClick={() => handleEdit(item)} className="p-2 text-indigo-400 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
            </div>
          </td>
        </>
      );
    }
    return (
      <>
        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-slate-500">#{item.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{item.name}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[item.status]}`}>{item.status}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => handleView(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
            <button onClick={() => handleEdit(item)} className="p-2 text-indigo-400 hover:text-indigo-600 bg-indigo-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
          </div>
        </td>
      </>
    );
  };

  const ModalPortal = () => {
    if (!isModalOpen) return null;

    const Input = ({ label, field, placeholder, dark }: { label: string, field: keyof ModuleItem, placeholder?: string, dark?: boolean }) => (
      <div>
        <label className={`block text-[9px] font-black uppercase tracking-widest mb-1.5 px-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
        <input 
          type="text" 
          readOnly={isViewOnly} 
          defaultValue={currentItem?.[field] as string || ''} 
          className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:border-indigo-600 font-bold text-xs shadow-sm transition-all ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} 
          placeholder={placeholder} 
        />
      </div>
    );

    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/60 backdrop-blur-md animate-fadeIn p-4 overflow-hidden">
        <div className="relative w-full max-w-6xl h-full max-h-[92vh] flex flex-col bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-scaleUp border border-slate-200">
          
          <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{isViewOnly ? 'Visualizar' : (currentItem ? 'Editar' : 'Cadastrar Novo')} {title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo de Homologação • Nexus Ecosystem</p>
            </div>
            <button onClick={handleCloseModal} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-100"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#FAFAFF]">
            {type === 'notebooks' && !isViewOnly ? (
              <div className="space-y-10 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Input label="id do caderno" field="id" placeholder="CAD-001" />
                  <Input label="descrição" field="description" placeholder="Notas do Caderno" />
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">tipo de homologação</label>
                    <select disabled={isViewOnly} defaultValue={currentItem?.type || "Completa"} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 font-bold text-slate-900 text-xs shadow-sm outline-none appearance-none cursor-pointer">
                      <option>Completa</option>
                      <option>Delta / Parcial</option>
                      <option>Renovação</option>
                      <option>Manutenção</option>
                    </select>
                  </div>
                  <Input label="quantidade de teste" field="tests" placeholder="0" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                       Matriz de Testes Disponíveis
                       <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full">{specs.length} opções</span>
                    </h4>
                    <div className="flex gap-3">
                       <button onClick={toggleAllSpecs} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isAllSelected ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}>Check All</button>
                       <input type="text" placeholder="Filtrar testes..." className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-900 outline-none w-48 shadow-sm focus:border-indigo-500" value={specSearch} onChange={(e) => setSpecSearch(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto max-h-[50vh] custom-scrollbar">
                      <table className="w-full text-left">
                        <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                          <tr>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center w-12">sel</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">id</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">caderno</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">categoria</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">titulo</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">ref</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">cat.tr</th>
                            <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">local</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredSpecs.map(spec => (
                            <tr key={spec.id} onClick={() => toggleSpec(spec.id)} className={`hover:bg-indigo-50/30 cursor-pointer transition-colors ${spec.selected ? 'bg-indigo-50/50' : ''}`}>
                              <td className="px-4 py-3 text-center">
                                <input type="checkbox" checked={spec.selected} readOnly className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                              </td>
                              <td className="px-4 py-3 font-mono text-[10px] font-bold text-slate-500">#{spec.id}</td>
                              <td className="px-4 py-3 text-[10px] font-black text-indigo-500 uppercase tracking-tight">{spec.caderno}</td>
                              <td className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">{spec.category}</td>
                              <td className="px-4 py-3 text-[11px] font-bold text-slate-900 truncate max-w-[220px]">{spec.titulo}</td>
                              <td className="px-4 py-3 text-[10px] font-black text-slate-600">{spec.ref}</td>
                              <td className="px-4 py-3 text-[10px] font-black text-slate-600">{spec.catTR}</td>
                              <td className="px-4 py-3 text-[10px] font-bold text-slate-500 italic">{spec.local}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : type === 'profiles' && !isViewOnly ? (
               <div className="space-y-10 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Input label="id do podile" field="id" placeholder="P-001" />
                  <Input label="titulo" field="name" placeholder="Nome do Perfil" />
                  <Input label="tx down (profile)" field="txDown" placeholder="800 Mbps" />
                  <Input label="tx upload (profile)" field="txUp" placeholder="200 Mbps" />
                  <Input label="tx de aprovação" field="approval" placeholder="95%" />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                     Lista de Testes Vinculados
                     <span className="bg-indigo-50 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full">{specs.filter(s => s.selected).length} testes</span>
                  </h4>
                  
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto max-h-[50vh] custom-scrollbar">
                      <table className="w-full text-left">
                        <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 z-10">
                          <tr>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">especificação</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">ref. de download</th>
                            <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">ref. de upload</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {specs.filter(s => s.selected).map(spec => (
                            <tr key={spec.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="text-xs font-black text-slate-900">{spec.titulo}</span>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{spec.caderno} • {spec.id}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <input 
                                  type="text" 
                                  placeholder="Inserir valor..." 
                                  defaultValue={spec.refDownload}
                                  className="w-full max-w-[180px] px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 shadow-inner" 
                                />
                              </td>
                              <td className="px-6 py-4">
                                <input 
                                  type="text" 
                                  placeholder="Inserir valor..." 
                                  defaultValue={spec.refUpload}
                                  className="w-full max-w-[180px] px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 shadow-inner" 
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (type === 'devices' || type === 'tests') ? (
              <div className="space-y-10">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Identificação do Hardware
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Input label="fabricante" field="fabricante" />
                    <Input label="modelo" field="modelo" />
                    <Input label="numero de serie" field="serialNumber" />
                    <Input label="versão do hardware" field="hwVersion" />
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Arquitetura do Sistema
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Input label="tipo de dispositivo" field="deviceType" />
                    <Input label="tipo de conexão" field="connectionType" />
                    <Input label="chipset principal" field="mainChipset" />
                    <Input label="Memoria Ram" field="ram" />
                    <Input label="Memoria Flash" field="flash" />
                    <Input label="Ethernet" field="ethernet" />
                    <Input label="versão do Wi-fi" field="wifiVersion" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-5">Interface 2.4GHz</h4>
                    <div className="space-y-4">
                      <Input label="2.4GHz - chipset" field="chipset24" />
                      <Input label="2GHz-NSS" field="nss24" />
                      <Input label="mac address - 2.4GHz" field="mac24" />
                    </div>
                  </div>
                  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-5">Interface 5GHz</h4>
                    <div className="space-y-4">
                      <Input label="chipset-5ghz" field="chipset5" />
                      <Input label="nss-5ghz" field="nss5" />
                      <Input label="mac address -5ghz" field="mac5" />
                    </div>
                  </div>
                  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-5">Interface 6GHz</h4>
                    <div className="space-y-4">
                      <Input label="6ghz-chipset" field="chipset6" />
                      <Input label="6ghz-nss" field="nss6" />
                      <Input label="mac address-6ghz" field="mac6" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                   <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">Interfaces L3 & Acesso Administrativo</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <Input label="mac address -lan" field="macLan" dark />
                        <Input label="mac address -wan" field="macWan" dark />
                      </div>
                      <div className="space-y-4">
                        <Input label="senha wi-fi" field="wifiPassword" dark />
                        <Input label="usuario gui" field="guiUser" dark />
                      </div>
                      <div className="space-y-4">
                        <Input label="senha gui" field="guiPassword" dark />
                      </div>
                   </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 mb-1.5">Observações</label>
                  <textarea readOnly={isViewOnly} defaultValue={currentItem?.description || ''} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[2rem] focus:outline-none focus:border-indigo-600 transition-all font-medium text-slate-900 resize-none h-32 text-sm shadow-sm" />
                </div>
              </div>
            ) : (
               <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Input label="id do caderno" field="id" placeholder="Ex: CAD-001" />
                  <Input label="descrição" field="description" placeholder="..." />
                  <Input label="tipo de homologação" field="type" placeholder="Ex: Delta" />
                  <Input label="quantidade de testes" field="tests" placeholder="0" />
                </div>
              </div>
            )}
          </div>

          <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0 justify-end">
            <button onClick={handleCloseModal} className="px-8 py-3.5 text-[11px] font-black text-slate-500 bg-white border border-slate-200 rounded-2xl uppercase tracking-widest hover:bg-slate-50 transition-all">{isViewOnly ? 'Fechar' : 'Voltar'}</button>
            {!isViewOnly && (
              <button onClick={handleCloseModal} className="px-12 py-3.5 text-[11px] font-black text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/10 hover:bg-indigo-700 transition-all uppercase tracking-widest">{currentItem ? 'Salvar Alterações' : 'Cadastrar'}</button>
            )}
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
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{title}</h2>
          <p className="text-slate-500 text-sm mt-1">Gestão centralizada de ativos do módulo {type}.</p>
        </div>
        <button onClick={handleCreateNew} className="bg-[#e1251a] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-[#bd1c14] transition-all flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Cadastrar Novo
        </button>
      </div>

      <div className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <svg className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder={`Filtrar ${type}...`} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:bg-white transition-all outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-12 animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {renderTableHeader()}
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  {renderTableRow(item)}
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      <ModalPortal />
    </div>
  );
};

export default Modules;
