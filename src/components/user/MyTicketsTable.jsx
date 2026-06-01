import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';

export default function MyTicketsTable({ tickets, equipments, onEditClick }) {
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
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {[...tickets].sort((a,b) => b.id - a.id).map(ticket => {
              const matchedEq = equipments.find(e => e.id === ticket.equipment_id);
              const isExpanded = !!expandedTickets[ticket.id];
              const dataDoChamado = ticket.createdAt || ticket.data_abertura;

              return (
                <tr key={ticket.id} className="border-b hover:bg-slate-50 align-top">
                  {/* ALTERADO: Mudamos para toLocaleString para exibir as horas, minutos e segundos */}
                  <td className="py-3 px-3 whitespace-nowrap pt-4 text-xs text-slate-500 font-medium">
                    {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 pt-4">
                    {matchedEq ? matchedEq.patrimonio : `ID: ${ticket.equipment_id}`}
                  </td>
                  <td className="py-3 px-3 max-w-xs pt-4">
                    <div className="text-slate-600 break-words">
                      {isExpanded ? ticket.descricao_problema : ticket.descricao_problema.length > 50 ? `${ticket.descricao_problema.substring(0, 50)}...` : ticket.descricao_problema}
                    </div>
                    {ticket.descricao_problema.length > 50 && (
                      <button onClick={() => toggleExpandirChamado(ticket.id)} className="text-xs text-blue-600 hover:underline font-semibold block mt-1 cursor-pointer">
                        {isExpanded ? 'Ver menos' : 'Ver mais'}
                      </button>
                    )}
                    {ticket.resolucao_ti && (
                      <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 shadow-sm">
                        <strong className="block mb-1 text-green-900 font-bold">Resposta do Suporte TI:</strong>
                        <span className="break-words leading-relaxed">{ticket.resolucao_ti}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 pt-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status_chamado === 'Concluído' ? 'bg-green-100 text-green-700' : 
                      ticket.status_chamado === 'Baixa' ? 'bg-slate-200 text-slate-700' :
                      'bg-blue-100 text-blue-700' 
                    }`}>
                      {ticket.status_chamado}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center pt-4">
                    {ticket.status_chamado === 'Aberto' ? (
                      <button onClick={() => onEditClick(ticket)} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1 mx-auto text-xs cursor-pointer">
                        <Edit2 className="w-3 h-3" /> Editar
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-medium">Trancado</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {tickets.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  Você ainda não abriu nenhum chamado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}