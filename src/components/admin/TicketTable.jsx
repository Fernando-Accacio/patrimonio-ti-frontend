import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'; 
import TicketTableRow from './TicketTableRow';

export default function TicketTable({ tickets, equipments, usersList, filter, onUpdateStatus, onAssignTechnician, onDevolverClick }) {
  const [expandedTickets, setExpandedTickets] = useState({});
  const [searchCode, setSearchCode] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🌟 REFS E ESTADOS DA BARRA DE ROLAGEM DUPLA
  const topScrollRef = useRef(null);
  const tableScrollRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(1000);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchCode]);

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tecnicos = usersList.filter(u => u.role === 'TECH');

  const filteredTickets = tickets
    .sort((a, b) => b.id - a.id)
    .filter(tk => {
      if (searchCode) {
        const termoBusca = searchCode.toLowerCase();
        const matchProcesso = tk.codigo_processo?.toLowerCase().includes(termoBusca);
        const eq = equipments.find(e => e.id === tk.equipment_id);
        const matchPatrimonio = eq?.patrimonio?.toLowerCase().includes(termoBusca);

        if (!matchProcesso && !matchPatrimonio) return false;
      }

      if (filter === 'Todos') return true;
      if (filter === 'Pendentes') {
        return tk.status_chamado === 'Aberto' || tk.status_chamado === 'Em Andamento';
      }
      if (filter === 'Resolvidos') {
        return tk.status_chamado === 'Concluído' || tk.status_chamado === 'Baixa';
      }
      return tk.status_chamado === filter;
    });

  const totalItems = filteredTickets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

  // 🌟 FUNÇÕES PARA SINCRONIZAR AS BARRAS DE ROLAGEM
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8 animate-in fade-in duration-200 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-4 gap-4">
        <h2 className="text-lg font-bold text-slate-800 flex flex-wrap items-center gap-2">
          Gestão de Chamados 
          {filter !== 'Todos' && (
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Filtrado por: {filter}
            </span>
          )}
        </h2>
        
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Buscar Processo ou Patrimônio..." 
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>
      
      {/* 🌟 BARRA DE ROLAGEM SUPERIOR (Sincronizada) */}
      <div 
        ref={topScrollRef} 
        onScroll={handleTopScroll}
        className="overflow-x-auto overflow-y-hidden h-3 w-full mb-2 custom-scrollbar"
      >
        <div style={{ width: `${tableWidth}px`, height: '1px' }}></div>
      </div>

      {/* 🌟 TABELA ORIGINAL (Com ref e min-width garantido) */}
      <div 
        ref={tableScrollRef}
        onScroll={handleTableScroll}
        className="overflow-x-auto custom-scrollbar"
      >
        <table className="w-full text-left text-slate-600 min-w-[1000px]">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center whitespace-nowrap">Nº Processo</th> 
              <th className="py-3 px-4 whitespace-nowrap">Abertura</th>
              <th className="py-3 px-4 whitespace-nowrap">Solicitante</th>
              <th className="py-3 px-4 whitespace-nowrap">Patrimônio</th>
              <th className="py-3 px-4 w-[400px]">Problema & Solução</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Responsável (TI)</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTickets.length > 0 ? (
              currentTickets.map((tk, index) => (
                <TicketTableRow 
                  key={tk.id}
                  ticket={tk}
                  equipments={equipments}
                  usersList={usersList}
                  tecnicos={tecnicos}
                  isExpanded={!!expandedTickets[tk.id]}
                  onToggleExpand={toggleExpandirChamado}
                  onAssignTechnician={onAssignTechnician}
                  onUpdateStatus={onUpdateStatus}
                  onDevolverClick={onDevolverClick}
                  isLast={index >= currentTickets.length - 4} 
                  isLastTech={index >= currentTickets.length - 1}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500">
                  Nenhum chamado encontrado com esses filtros ou termos de busca.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-slate-100 text-sm text-slate-500">
          <div>
            Exibindo <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> a <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, totalItems)}</span> de <span className="font-semibold text-slate-700">{totalItems}</span> chamados
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1 font-medium text-slate-700">
              <span>Página</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">{currentPage}</span>
              <span>de</span>
              <span>{totalPages}</span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}