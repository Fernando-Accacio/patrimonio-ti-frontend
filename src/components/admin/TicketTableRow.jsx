import React from 'react';
import { Info, Wrench } from 'lucide-react';
import TechDropdown from './dropdowns/TechDropdown';
import StatusDropdown from './dropdowns/StatusDropdown';

export default function TicketTableRow({ 
  ticket, equipments, usersList, tecnicos, isExpanded, onToggleExpand, onAssignTechnician, onUpdateStatus, isLast 
}) {
  const eq = equipments.find(e => e.id === ticket.equipment_id);
  const dataDoChamado = ticket.createdAt || ticket.data_abertura;
  const atualTecnico = ticket.tecnico || tecnicos.find(tec => tec.id === ticket.tecnico_id);
  const isFinalizado = ['Concluído', 'Baixa', 'Cancelado'].includes(ticket.status_chamado);

  return (
    <tr className="align-top transition hover:bg-slate-50 border-b border-slate-100">
      <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500 font-medium leading-tight pt-5">
        {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
      </td>
      
      <td className="py-4 px-4 pt-5">
        <span className="font-semibold text-slate-800 text-sm block leading-tight">{ticket.user ? ticket.user.nome : 'Usuário Removido'}</span>
        {ticket.user?.ramal && <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">Ramal: {ticket.user.ramal}</span>}
      </td>

      <td className="py-4 px-4 pt-5">
        <div className="flex items-center gap-1.5 whitespace-nowrap mb-0.5">
          <span className="font-bold text-blue-600 text-sm">{eq ? eq.patrimonio : `ID: ${ticket.equipment_id}`}</span>
          {eq?.tipo && <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{eq.tipo}</span>}
        </div>
        <span className="text-xs text-slate-500 block leading-tight">{eq ? eq.observacao : 'Não informado'}</span>
      </td>
      
      <td className="py-4 px-4 pt-5">
        <div className="text-slate-600 break-words text-sm leading-relaxed">
          {isExpanded ? ticket.descricao_problema : ticket.descricao_problema.length > 50 ? `${ticket.descricao_problema.substring(0, 50)}...` : ticket.descricao_problema}
        </div>
        {ticket.descricao_problema.length > 50 && (
          <button onClick={() => onToggleExpand(ticket.id)} className="text-sm text-blue-600 hover:underline font-bold block mt-1 cursor-pointer">
            {isExpanded ? 'Ocultar Detalhes' : 'Ler Relato Completo'}
          </button>
        )}

        {ticket.resolucao_ti && (
          <div className={`mt-3 p-3 border border-slate-200 border-l-4 rounded-r-lg text-sm shadow-xs bg-slate-50 ${ticket.status_chamado === 'Cancelado' ? 'border-l-slate-400' : 'border-l-emerald-500'}`}>
            <strong className={`flex items-center gap-1.5 mb-1 font-bold text-xs uppercase tracking-wider ${ticket.status_chamado === 'Cancelado' ? 'text-slate-500' : 'text-emerald-700'}`}>
              {ticket.status_chamado === 'Cancelado' ? <><Info className="w-3.5 h-3.5" /> Motivo do Cancelamento:</> : <><Wrench className="w-3.5 h-3.5" /> Resolução Aplicada:</>}
            </strong>
            {/* 🌟 FIX: Proteção contra palavras gigantes na resposta da TI */}
            <p className="font-medium text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-slate-100 mt-1 break-all whitespace-pre-wrap">
            {ticket.resolucao_ti}
            </p>
          </div>
        )}
      </td>

      <td className="py-4 px-4 text-center align-middle min-w-[220px] pt-4">
        <TechDropdown ticketId={ticket.id} tecnicos={tecnicos} atualTecnico={atualTecnico} isFinalizado={isFinalizado} onAssignTechnician={onAssignTechnician} isLast={isLast} />
      </td>

      <td className="py-4 px-4 text-center align-middle min-w-[170px] pt-4">
        <StatusDropdown ticketId={ticket.id} currentStatus={ticket.status_chamado} tecnicoId={ticket.tecnico_id} isFinalizado={isFinalizado} onUpdateStatus={onUpdateStatus} isLast={isLast} />
      </td>
    </tr>
  );
}