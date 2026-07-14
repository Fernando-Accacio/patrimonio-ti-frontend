import React from 'react';
import { Info, Wrench } from 'lucide-react';
import TechDropdown from './dropdowns/TechDropdown';
import StatusDropdown from './dropdowns/StatusDropdown';

export default function TicketTableRow({ 
  ticket, equipments, usersList, tecnicos, isExpanded, onToggleExpand, onAssignTechnician, onUpdateStatus, isLast, isLastTech 
}) {
  const eq = equipments.find(e => e.id === ticket.equipment_id);
  const dataDoChamado = ticket.createdAt || ticket.data_abertura;
  const dataFechamento = ticket.finished_at || ticket.updatedAt || null;
  const atualTecnico = ticket.tecnico || tecnicos.find(tec => tec.id === ticket.tecnico_id);
  
  const isFinalizado = ['Concluído', 'Baixa', 'Cancelado', 'Aguardando Confirmação'].includes(ticket.status_chamado);

  let resolucaoFormatada = ticket.resolucao_ti || '';
  resolucaoFormatada = resolucaoFormatada.replace(/\[CONFIRMAÇÃO DO USUÁRIO\]:\s*(.+)/g, 'Confirmação do Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[RECUSADO PELO USUÁRIO\]:\s*(.+)/g, 'Recusa do Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[CANCELADO PELO USUÁRIO\]:\s*(.+)/g, 'Cancelado pelo Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[SISTEMA\]:\s*(.+)/g, 'Sistema: "$1"');

  return (
    <tr className="align-top transition hover:bg-slate-50 border-b border-slate-100">
      
      {/* 🌟 CÓDIGO DO PROCESSO AGORA É A PRIMEIRA CÉLULA */}
      <td className="py-4 px-4 pt-5 align-top text-center">
        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded border ${ticket.codigo_processo ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200 font-medium'}`}>
          {ticket.codigo_processo || 'Antigo / N/A'}
        </span>
      </td>

      {/* 🌟 DATAS AGORA SÃO A SEGUNDA CÉLULA */}
      <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500 font-medium leading-tight pt-5">
        <div className="flex flex-col gap-1 whitespace-normal leading-tight">
          <span>Abertura: {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}</span>
          <span>Fechamento: {dataFechamento ? new Date(dataFechamento).toLocaleString('pt-BR') : (ticket.status_chamado === 'Aguardando Confirmação' ? 'Aguardando confirmação' : 'Em aberto')}</span>
        </div>
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

        {resolucaoFormatada && (
          <div className={`mt-3 p-3 border border-slate-200 border-l-4 rounded-r-lg text-sm shadow-xs bg-slate-50 ${ticket.status_chamado === 'Cancelado' ? 'border-l-slate-400' : 'border-l-emerald-500'}`}>
            <strong className={`flex items-center gap-1.5 mb-1 font-bold text-xs uppercase tracking-wider ${ticket.status_chamado === 'Cancelado' ? 'text-slate-500' : 'text-emerald-700'}`}>
              {ticket.status_chamado === 'Cancelado' ? <><Info className="w-3.5 h-3.5" /> Motivo do Cancelamento:</> : <><Wrench className="w-3.5 h-3.5" /> Resolução Aplicada:</>}
            </strong>
            <p className="font-medium text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-slate-100 mt-1 break-words whitespace-pre-wrap">
  {resolucaoFormatada}
            </p>   
            {ticket.status_chamado === 'Aguardando Confirmação' && ticket.finalizador?.nome && (
              <p className="mt-2 text-[12px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded px-2 py-2">
                Aguardando confirmação do usuário. Atendimento enviado por {ticket.finalizador.nome}.
              </p>
            )}
            {ticket.status_chamado === 'Aguardando Confirmação' && (
              <p className="mt-2 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded px-2 py-1.5">
                Se o cliente não confirmar, a solução será validada automaticamente em 3 dias.
              </p>
            )}
            {ticket.status_chamado === 'Concluído' && ticket.confirmador?.nome && (
              <p className="mt-2 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5">
                Confirmado pelo usuário: {ticket.confirmador.nome}.
              </p>
            )}
          </div>
        )}
      </td>

      <td className="py-4 px-4 text-center align-middle min-w-[220px] pt-4">
        <TechDropdown ticketId={ticket.id} tecnicos={tecnicos} atualTecnico={atualTecnico} isFinalizado={isFinalizado} onAssignTechnician={onAssignTechnician} isLast={isLast} isLastTech={isLastTech} />
      </td>

      <td className="py-4 px-4 text-center align-middle min-w-[170px] pt-4">
        <StatusDropdown ticketId={ticket.id} currentStatus={ticket.status_chamado} tecnicoId={ticket.tecnico_id} isFinalizado={isFinalizado} onUpdateStatus={onUpdateStatus} isLast={isLast} solicitanteNome={ticket.user?.nome || ''} />
      </td>
    </tr>
  );
}