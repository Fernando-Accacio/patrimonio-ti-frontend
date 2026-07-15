import React, { useState, useRef, useEffect } from 'react';
import MyTicketsTableRow from './MyTicketsTableRow';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MyTicketsTable({ tickets, equipments, onEditClick, onCancelTicketClick, onResponderConfirmacao }) {
  const [expandedTickets, setExpandedTickets] = useState({});
  
  // 🌟 ESTADOS DA PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🌟 REFS PARA SINCRONIZAR AS BARRAS DE ROLAGEM
  const topScrollRef = useRef(null);
  const tableScrollRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(800);

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 🌟 LÓGICA DE PAGINAÇÃO E ORDENAÇÃO
  const safeTickets = tickets || [];
  const sortedTickets = [...safeTickets].sort((a, b) => b.id - a.id);
  
  const totalItems = sortedTickets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirstItem, indexOfLastItem);

  // 🌟 Atualiza a largura da barra falsa para ter o tamanho exato da tabela real
  useEffect(() => {
    if (tableScrollRef.current) {
      setTableWidth(tableScrollRef.current.scrollWidth);
    }
  }, [currentTickets, expandedTickets]);

  // 🌟 Funções que fazem uma barra seguir a outra
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit flex flex-col">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Meus Chamados Recentes</h2>
      
      {/* 🌟 BARRA DE ROLAGEM SUPERIOR (Sincronizada) */}
      <div 
        ref={topScrollRef} 
        onScroll={handleTopScroll}
        className="overflow-x-auto overflow-y-hidden h-3 w-full mb-2 custom-scrollbar"
      >
        {/* Div invisível que simula a largura da tabela */}
        <div style={{ width: `${tableWidth}px`, height: '1px' }}></div>
      </div>

      {/* 🌟 TABELA ORIGINAL (Com ref e evento de scroll adicionados) */}
      <div 
        ref={tableScrollRef}
        onScroll={handleTableScroll}
        className="overflow-x-auto pr-2 rounded-b-lg custom-scrollbar"
      >
        <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="py-2 px-3 text-center whitespace-nowrap">Nº Processo</th>
              <th className="py-2 px-3 whitespace-nowrap">Data / Horário</th>
              <th className="py-2 px-3 whitespace-nowrap">Patrimônio</th> 
              <th className="py-2 px-3 w-1/2">Problema</th>
              <th className="py-2 px-3 text-center whitespace-nowrap">Responsável</th>
              <th className="py-2 px-3 text-center whitespace-nowrap">Status</th>
              <th className="py-2 px-3 text-center whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTickets.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-slate-400 italic text-sm">Você ainda não possui chamados abertos.</td></tr>
            ) : (
              currentTickets.map(ticket => (
                <MyTicketsTableRow 
                  key={ticket.id}
                  ticket={ticket}
                  equipments={equipments}
                  isExpanded={!!expandedTickets[ticket.id]}
                  onToggleExpand={toggleExpandirChamado}
                  onEditClick={onEditClick}
                  onCancelTicketClick={onCancelTicketClick}
                  onResponderConfirmacao={onResponderConfirmacao}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-4 mt-2 border-t border-slate-100 text-sm text-slate-500">
          <div>
            Exibindo <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> a <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, totalItems)}</span> de <span className="font-semibold text-slate-700">{totalItems}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700 px-2">Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}