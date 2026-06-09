import React, { useState } from 'react';
import api from '../../services/api';
import TicketTableRow from './TicketTableRow';

export default function TicketTable({ tickets, equipments, usersList, filter, onUpdateStatus, onAssignTechnician }) {
  const [expandedTickets, setExpandedTickets] = useState({});

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tecnicos = usersList.filter(u => u.role === 'TECH');

  const filteredTickets = tickets
    .sort((a, b) => b.id - a.id)
    .filter(tk => filter === 'Todos' || tk.status_chamado === filter);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8 animate-in fade-in duration-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
        Gestão de Chamados 
        {filter !== 'Todos' && <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Filtrado por: {filter}</span>}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Abertura</th>
              <th className="py-3 px-4">Solicitante</th>
              <th className="py-3 px-4">Patrimônio</th>
              <th className="py-3 px-4 w-1/3">Problema & Solução</th>
              <th className="py-3 px-4 text-center">Responsável (TI)</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* 🌟 CORRIGIDO: Adicionamos o 'index' aqui para que a variável isLast funcione e não quebre a tela! */}
            {filteredTickets.map((tk, index) => (
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
                isLast={index === filteredTickets.length - 1} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}