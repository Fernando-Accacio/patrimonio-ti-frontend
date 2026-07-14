import React, { useState } from 'react';
import MyTicketsTableRow from './MyTicketsTableRow';
import { Edit2, UserCircle, AlertTriangle, Info, Wrench, Check } from 'lucide-react';

export default function MyTicketsTable({ tickets, equipments, onEditClick, onCancelTicketClick, onResponderConfirmacao }) {
  const [expandedTickets, setExpandedTickets] = useState({});

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit flex flex-col">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Meus Chamados Recentes</h2>
      
      {/* 🌟 MAGIA DA ROLAGEM AQUI: max-h-[65vh] garante que a barra sempre fique visível na tela! */}
      <div className="overflow-x-auto overflow-y-auto max-h-[65vh] pr-2 rounded-b-lg">
        {/* Adicionado min-w-[800px] para a tabela não esmagar as colunas e forçar o scroll horizontal bonitinho */}
        <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="py-2 px-3 whitespace-nowrap">Data / Horário</th>
              <th className="py-2 px-3 whitespace-nowrap">Patrimônio</th> 
              <th className="py-2 px-3 w-1/2">Problema</th>
              <th className="py-2 px-3 text-center whitespace-nowrap">Responsável</th>
              <th className="py-2 px-3 text-center whitespace-nowrap">Status</th>
              <th className="py-2 px-3 text-center whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...tickets].sort((a,b) => b.id - a.id).map(ticket => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}