
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
}

const INITIAL_SPECS: SpecItem[] = Array.from({ length: 120 }, (_, i) => ({
  id: `SPEC-${i + 1}`,
  name: `Especificação Técnica #${i + 1} - Validação de Protocolo ${100 + i}`,
  category: i % 5 === 0 ? 'RF' : i % 3 === 0 ? 'Protocolo' : 'UX',
  refDownload: '',
  refUpload: '',
  selected: false
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
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.responsible?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSpecs = useMemo(() => {
    return specs.filter(spec => 
      spec.name.toLowerCase().includes(specSearch.toLowerCase()) ||
      spec.id.toLowerCase().includes(specSearch.toLowerCase())
    );
  }, [specSearch, specs]);

  const selectedCount = useMemo(() => specs.filter(s => s.selected).length, [specs]);
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
    setSpecs(INITIAL_SPECS.map((s, i) => i < 5 ? { ...s, selected: true, refDownload: 'https://storage.nexus/ref1', refUpload: 'https://storage.nexus/up1' } : s));
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleView = (item: ModuleItem) => {
    setCurrentItem(item);
    setIsViewOnly(true);
    setSpecs(INITIAL_SPECS.map((s, i) => i < 5 ? { ...s, selected: true, refDownload: 'https://storage.nexus/ref1', refUpload: 'https://storage.nexus/up1' } : s));
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

  const updateSpec = (id: string, field: keyof SpecItem, value: any) => {
    if (isViewOnly) return;
    setSpecs(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const toggleSpec = (id: string) => {
    if (isViewOnly) return;
    setSpecs(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const renderTableHeader = () => {
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
    return (
      <>
        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Identifier</th>
        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Name</th>
        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Status</th>
      </>
    );
  };

  const renderTableRow = (item: ModuleItem) => {
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
              <button onClick={() => handleView(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 transition-all rounded-lg border border-slate-100" title="Ver">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
              <button onClick={() => handleEdit(item)} className="p-2 text-indigo-400 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all rounded-lg border border-indigo-100" title="Editar">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
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
            <button onClick={() => handleView(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </button>
            <button onClick={() => handleEdit(item)} className="p-2 text-indigo-400 hover:text-indigo-600 bg-indigo-50 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
          </div>
        </td>
      </>
    );
  };

  const ModalPortal = () => {
    if (!isModalOpen) return null;
    const modalId = `modal-nexus-v4-${type}`;

    return createPortal(
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm animate-fadeIn p-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalId}
      >
        <div className="relative w-full max-w-4xl h-full max-h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleUp border border-slate-200">
          
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 z-20">
            <div>
              <h3 id={modalId} className="text-lg font-black text-slate-900 tracking-tight">
                {isViewOnly ? 'Visualizar' : (currentItem ? 'Editar' : 'Novo')} {title}
              </h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Configuração de Protocolo • Nexus v4</p>
            </div>
            <button 
              onClick={handleCloseModal} 
              className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-100"
              aria-label="Fechar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#FAFAFF]">
            {type === 'notebooks' ? (
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Título do Caderno</label>
                    <input 
                      type="text" 
                      defaultValue={currentItem?.name || ''} 
                      readOnly={isViewOnly}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-all font-semibold text-slate-900 text-sm shadow-sm disabled:bg-slate-50" 
                      placeholder="Nome do Caderno" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Taxa de Aprovação</label>
                    <div className="relative">
                      <input type="text" readOnly={isViewOnly} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-bold text-slate-900 text-sm shadow-sm" placeholder="95" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px]">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Versão / Tag</label>
                    <input type="text" readOnly={isViewOnly} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-bold text-slate-900 text-sm shadow-sm" placeholder="v2.0" />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-around gap-4 text-center border border-white/5">
                    <div className="space-y-0.5">
                       <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest opacity-80">Downlink Target</span>
                       <p className="text-lg font-black text-white tracking-tight">1.2 Gbps</p>
                    </div>
                    <div className="w-px h-6 bg-white/10 hidden md:block"></div>
                    <div className="space-y-0.5">
                       <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest opacity-80">Uplink Target</span>
                       <p className="text-lg font-black text-white tracking-tight">500 Mbps</p>
                    </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between px-1">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-black text-slate-900 tracking-tight">Matriz de Especificações</h4>
                        <button 
                          onClick={toggleAllSpecs}
                          disabled={isViewOnly}
                          className={`text-[9px] font-black uppercase px-2 py-1 rounded transition-all ${
                            isAllSelected 
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                              : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
                          }`}
                        >
                          {isAllSelected ? 'Deselecionar Tudo' : 'Selecionar Tudo'}
                        </button>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                        {selectedCount} de {specs.length} ativas • {((selectedCount/specs.length)*100).toFixed(0)}% cobertura
                      </p>
                    </div>
                    <div className="relative w-40">
                       <input 
                        type="text" 
                        placeholder="Buscar..." 
                        className="w-full pl-3 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-900 focus:border-indigo-600 transition-all outline-none"
                        value={specSearch}
                        onChange={(e) => setSpecSearch(e.target.value)}
                       />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[35vh] overflow-y-auto custom-scrollbar pr-1 pb-4">
                    {filteredSpecs.map(spec => (
                      <div 
                        key={spec.id}
                        onClick={() => toggleSpec(spec.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer group/spec ${
                          spec.selected 
                            ? 'bg-indigo-50/70 border-indigo-300 shadow-sm' 
                            : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="relative">
                              <input 
                                type="checkbox"
                                disabled={isViewOnly}
                                checked={spec.selected}
                                onChange={() => {}} // Controlled by row click toggleSpec
                                className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-600/20 cursor-pointer pointer-events-none transition-all"
                                id={`check-${spec.id}`}
                              />
                            </div>
                            <div className="min-w-0 flex flex-col">
                               <label className={`text-[12px] font-black truncate cursor-pointer transition-colors ${spec.selected ? 'text-indigo-900' : 'text-slate-600'}`}>
                                 <span className="text-[9px] font-black text-slate-400 mr-2 uppercase tracking-tighter">#{spec.id}</span>
                                 {spec.name}
                               </label>
                               {spec.selected && (
                                 <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                   <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                                   Ativo na Sequência
                                 </span>
                               )}
                            </div>
                          </div>

                          <div 
                            className={`flex gap-2 flex-1 transition-all ${spec.selected ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}
                            onClick={(e) => e.stopPropagation()} // Prevent row toggle when interacting with inputs
                          >
                            <input 
                              type="text" 
                              readOnly={isViewOnly}
                              value={spec.refDownload}
                              onChange={(e) => updateSpec(spec.id, 'refDownload', e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 focus:border-indigo-500 outline-none shadow-inner" 
                              placeholder="URI DL" 
                            />
                            <input 
                              type="text" 
                              readOnly={isViewOnly}
                              value={spec.refUpload}
                              onChange={(e) => updateSpec(spec.id, 'refUpload', e.target.value)}
                              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-900 focus:border-indigo-500 outline-none shadow-inner" 
                              placeholder="URI UL" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 mb-1.5">Identificação</label>
                    <input type="text" readOnly={isViewOnly} defaultValue={currentItem?.name || ''} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm" placeholder="Nome" />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 mb-1.5">Status</label>
                     <select disabled={isViewOnly} defaultValue={currentItem?.status || ItemStatus.ACTIVE} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none font-bold appearance-none text-slate-900 text-sm">
                      {Object.values(ItemStatus).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 mb-1.5">Notas Técnicas</label>
                  <textarea readOnly={isViewOnly} defaultValue={currentItem?.description || ''} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-all font-medium text-slate-900 resize-none h-32 text-sm shadow-sm" placeholder="..." />
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0 justify-end">
            <button 
              onClick={handleCloseModal} 
              className="px-5 py-2 text-[10px] font-black text-slate-500 bg-white border border-slate-200 rounded-lg uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              {isViewOnly ? 'Fechar' : 'Cancelar'}
            </button>
            {!isViewOnly && (
              <button 
                onClick={handleCloseModal} 
                className="px-8 py-2 text-[10px] font-black text-white bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition-all active:scale-[0.98] uppercase tracking-widest"
              >
                {currentItem ? 'Salvar' : 'Cadastrar'}
              </button>
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
        <button 
          onClick={handleCreateNew}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Cadastrar Novo
        </button>
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder={`Filtrar ${type}...`} 
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold focus:bg-white transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden mb-12 animate-fadeIn">
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
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      <ModalPortal />
    </div>
  );
};

export default Modules;
