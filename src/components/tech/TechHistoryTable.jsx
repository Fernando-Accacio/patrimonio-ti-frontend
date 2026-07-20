import React, { useState, useEffect, useRef } from 'react';
import { History, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import TechHistoryTableRow from './TechHistoryTableRow';

export default function TechHistoryTable({ historicoRecente, equipments }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCode, setSearchCode] = useState('');
  const itemsPerPage = 10;
  
  const [expandedTickets, setExpandedTickets] = useState({});

  const topScrollRef = useRef(null);
  const tableScrollRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(1000);

  const chamadosSeguros = historicoRecente || [];
  const equipamentosSeguros = equipments || [];

  useEffect(() => { setCurrentPage(1); }, [searchCode]);

  const filteredTickets = chamadosSeguros.filter(tk => {
    if (!searchCode) return true;
    const termoBusca = searchCode.toLowerCase();
    const matchProcesso = tk.codigo_processo?.toLowerCase().includes(termoBusca);
    const eq = equipamentosSeguros.find(e => e.id === tk.equipment_id);
    const matchPatrimonio = eq?.patrimonio?.toLowerCase().includes(termoBusca);
    return matchProcesso || matchPatrimonio;
  });

  const totalItems = filteredTickets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (tableScrollRef.current) {
      setTableWidth(tableScrollRef.current.scrollWidth);
    }
  }, [currentTickets, expandedTickets]);

  const handleTopScroll = () => {
    if (tableScrollRef.current && topScrollRef.current) {
      if (tableScrollRef.current.scrollLeft !== topScrollRef.current.scrollLeft) {
        tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
      }
    }
  };

  const handleTableScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      if (topScrollRef.current.scrollLeft !== tableScrollRef.current.scrollLeft) {
        topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
      }
    }
  };

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200 delay-200 flex flex-col">
      <div className="bg-slate-50 px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-600 p-2 rounded-lg"><History className="w-5 h-5 text-white" /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Meu Histórico de Chamados</h2>
            <p className="text-sm text-slate-500">Chamados que você enviou para confirmação, finalizou ou deu baixa.</p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Buscar Processo ou Patrimônio..." 
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-600 focus:border-slate-600 transition bg-white"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>
      
      <div 
        ref={topScrollRef} 
        onScroll={handleTopScroll}
        className="overflow-x-auto overflow-y-hidden h-3 w-full mb-2 mt-2 custom-scrollbar"
      >
        <div style={{ width: `${tableWidth}px`, height: '1px' }}></div>
      </div>

      <div 
        ref={tableScrollRef}
        onScroll={handleTableScroll}
        className="overflow-x-auto custom-scrollbar min-h-[320px] pb-24"
      >
        <table className="w-full text-left text-slate-600 min-w-[1000px]">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center whitespace-nowrap">Nº Processo</th>
              <th className="py-3 px-4 whitespace-nowrap">Datas</th>
              <th className="py-3 px-4 whitespace-nowrap">Solicitante</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Equipamento</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Setor</th>
              <th className="py-3 px-4 w-[400px]">Problema & Resolução</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTickets.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400 italic text-sm">Nenhum chamado encontrado.</td></tr>
            ) : (
              currentTickets.map((tk) => (
                <TechHistoryTableRow 
                  key={tk.id}
                  ticket={tk}
                  equipments={equipamentosSeguros}
                  isExpanded={!!expandedTickets[tk.id]}
                  onToggleExpand={toggleExpandirChamado}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
          <div>
            Exibindo <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> a <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, totalItems)}</span> de <span className="font-semibold text-slate-700">{totalItems}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-50 transition cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700 px-2">Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-50 transition cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}