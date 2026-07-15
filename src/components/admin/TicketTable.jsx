import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'; 
import TicketTableRow from './TicketTableRow';

export default function TicketTable({ tickets, equipments, usersList, filter, onUpdateStatus, onAssignTechnician, onDevolverClick }) {
  const [expandedTickets, setExpandedTickets] = useState({});
  const [searchCode, setSearchCode] = useState('');
  
  // 🌟 ESTADOS DA PAGINAÇÃO
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Se o usuário mudar o filtro ou digitar na busca, voltamos para a página 1 para evitar bugs de paginação vazia
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchCode]);

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tecnicos = usersList.filter(u => u.role === 'TECH');

  // 1. Filtragem e ordenação (A pesquisa pelo código roda na base completa de dados)
  const filteredTickets = tickets
    .sort((a, b) => b.id - a.id)
    .filter(tk => {
      if (searchCode && !tk.codigo_processo?.toLowerCase().includes(searchCode.toLowerCase())) {
        return false;
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

  // 🌟 2. Lógica de Paginação (Fatia a lista filtrada para exibir apenas 10 por página)
  const totalItems = filteredTickets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-4 gap-4">
        <h2 className="text-lg font-bold text-slate-800 flex flex-wrap items-center gap-2">
          Gestão de Chamados 
          {filter !== 'Todos' && (
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Filtrado por: {filter}
            </span>
          )}
        </h2>
        
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Buscar por Nº do Processo..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center">Nº Processo</th> 
              <th className="py-3 px-4">Abertura</th>
              <th className="py-3 px-4">Solicitante</th>
              <th className="py-3 px-4">Patrimônio</th>
              <th className="py-3 px-4 w-1/3">Problema & Solução</th>
              <th className="py-3 px-4 text-center">Responsável (TI)</th>
              <th className="py-3 px-4 text-center">Status</th>
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
                  // Corrigido para as novas regras de paginação dinâmica
                  isLast={index >= currentTickets.length - 4} 
                  isLastTech={index >= currentTickets.length - 1}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500">
                  Nenhum chamado encontrado com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🌟 CONTROLES DE PAGINAÇÃO NO RODAPÉ */}
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