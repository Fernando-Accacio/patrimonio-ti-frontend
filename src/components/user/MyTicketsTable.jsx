import React, { useState } from 'react';
import MyTicketsTableRow from './MyTicketsTableRow';
import { Edit2, UserCircle, AlertTriangle, Info, Wrench, Check } from 'lucide-react';

export default function MyTicketsTable({ tickets, equipments, onEditClick, onCancelTicketClick, onResponderConfirmacao }) {
  const [expandedTickets, setExpandedTickets] = useState({});

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Meus Chamados Recentes</h2>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-2">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b sticky top-0 z-10">
            <tr>
              <th className="py-2 px-3">Data / Horário</th>
              <th className="py-2 px-3">Patrimônio</th> 
              <th className="py-2 px-3 w-1/2">Problema</th>
              <th className="py-2 px-3 text-center">Responsável</th>
              <th className="py-2 px-3 text-center">Status</th>
              <th className="py-2 px-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
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