import React from 'react';
import { Edit2, UserCircle, AlertTriangle } from 'lucide-react';

export default function MyTicketsTableRow({ 
  ticket, 
  equipments, 
  isExpanded, 
  onToggleExpand, 
  onEditClick, 
  onCancelTicketClick 
}) {
  const matchedEq = equipments.find(e => e.id === ticket.equipment_id);
  const dataDoChamado = ticket.createdAt || ticket.data_abertura;
  const nomeTecnico = ticket.tecnico?.nome || null;

  return (
    <tr className={`border-b align-top transition ${ticket.status_chamado === 'Cancelado' ? 'bg-slate-50/50 opacity-70' : 'hover:bg-slate-50'}`}>
      <td className="py-3 px-3 text-sm font-medium text-slate-500 pt-4">
        {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
      </td>
      <td className="py-3 px-3 pt-4">
        <span className="font-bold text-blue-600 text-sm block">
          {matchedEq ? matchedEq.patrimonio : `ID: ${ticket.equipment_id}`}
        </span>
      </td>
      <td className="py-3 px-3 max-w-xs pt-4">
        <div className="text-slate-600 break-words text-sm leading-relaxed">
          {isExpanded ? ticket.descricao_problema : ticket.descricao_problema.length > 50 ? `${ticket.descricao_problema.substring(0, 50)}...` : ticket.descricao_problema}
        </div>
        {ticket.descricao_problema.length > 50 && (
          <button onClick={() => onToggleExpand(ticket.id)} className="text-xs text-blue-600 hover:underline font-bold block mt-1 cursor-pointer">
            {isExpanded ? 'Ocultar Detalhes' : 'Ler Relato Completo'}
          </button>
        )}
        {ticket.resolucao_ti && (
          <div className={`mt-3 p-2.5 border rounded-lg text-sm shadow-sm ${
            ticket.status_chamado === 'Cancelado' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <strong className="block mb-1 font-bold">
              {ticket.status_chamado === 'Cancelado' ? 'Histórico de Cancelamento:' : 'Resposta do Suporte:'}
            </strong>
            <span className="break-words leading-relaxed">{ticket.resolucao_ti}</span>
          </div>
        )}
      </td>
      
      <td className="py-3 px-3 text-center pt-4">
        {nomeTecnico ? (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${
            ticket.status_chamado === 'Cancelado' 
              ? 'bg-slate-100 text-slate-500 border-slate-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <UserCircle className="w-3.5 h-3.5" /> {nomeTecnico}
          </div>
        ) : ticket.status_chamado === 'Cancelado' ? (
          <span className="text-xs text-slate-400 font-medium">—</span>
        ) : (
          <span className="text-xs text-slate-400 font-medium italic">Aguardando TI</span>
        )}
      </td>

      <td className="py-3 px-3 text-center pt-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
          ticket.status_chamado === 'Concluído' ? 'bg-green-100 text-green-700 border-green-200' : 
          ticket.status_chamado === 'Baixa' ? 'bg-red-50 text-red-700 border-red-200' :
          ticket.status_chamado === 'Cancelado' ? 'bg-slate-200 text-slate-600 border-slate-300' : 
          'bg-blue-100 text-blue-700 border-blue-200' 
        }`}>
          {ticket.status_chamado}
        </span>
      </td>
      
      <td className="py-3 px-3 text-center pt-4">
        {ticket.status_chamado === 'Aberto' ? (
          <div className="flex flex-col gap-2 max-w-fit mx-auto">
            <button onClick={() => onEditClick(ticket)} className="text-blue-600 hover:bg-blue-100 font-bold px-2 py-1.5 rounded transition text-xs flex items-center gap-1 cursor-pointer bg-blue-50">
              <Edit2 className="w-3 h-3" /> Editar
            </button>
            <button onClick={() => onCancelTicketClick(ticket.id)} className="text-red-600 hover:bg-red-100 font-bold px-2 py-1.5 rounded transition text-xs flex items-center gap-1 cursor-pointer bg-red-50">
              <AlertTriangle className="w-3 h-3" /> Cancelar
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic font-medium bg-slate-50 px-2 py-1.5 rounded block border border-slate-100">Trancado</span>
        )}
      </td>
    </tr>
  );
}