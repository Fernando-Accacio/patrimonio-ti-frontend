import React from 'react';
import { Wrench } from 'lucide-react';

export default function TechHistoryTableRow({ ticket, equipments, isExpanded, onToggleExpand }) {
  const eq = equipments.find(e => e.id === ticket?.equipment_id);
  const dataFechamento = ticket?.finished_at || ticket?.updatedAt || null;
  const dataAbertura = ticket?.createdAt || ticket?.data_abertura;

  let resolucaoFormatada = (ticket?.resolucao_ti || '').toString();

  // Formata a resposta direta do técnico (primeira linha)
  if (resolucaoFormatada.trim() && !resolucaoFormatada.trim().startsWith('[')) {
    const linhas = resolucaoFormatada.split('\n');
    linhas[0] = `Resolução: "${linhas[0]}"`;
    resolucaoFormatada = linhas.join('\n');
  }

  // Traduz as tags automáticas do sistema
  resolucaoFormatada = resolucaoFormatada.replace(/\[(?:CONFIRMADO PELO USUÁRIO|CONFIRMAÇÃO DO USUÁRIO)\]:\s*(.+)/gi, 'Resposta do Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[RECUSADO PELO USUÁRIO\]:\s*(.+)/gi, 'Recusa do Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[CANCELADO PELO USUÁRIO\]:\s*(.+)/gi, 'Cancelado pelo Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[SISTEMA\]:\s*(.+)/gi, 'Sistema: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[OBSERVAÇÃO DO SUPORTE\]:\s*(.+)/gi, 'Observação do Suporte: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[RESOLUÇÃO\]:\s*(.+)/gi, 'Resolução: "$1"');

  return (
    <tr className="hover:bg-slate-50 transition align-top">
      <td className="py-4 px-4 pt-5 align-top text-center">
        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded border ${ticket?.codigo_processo ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200 font-medium'}`}>
          {ticket?.codigo_processo || 'Antigo / N/A'}
        </span>
      </td>

      <td className="py-4 px-4 pt-5 text-sm font-medium text-slate-500">
        <div className="flex flex-col gap-1 leading-tight whitespace-nowrap">
          <span>Abertura: {dataAbertura ? new Date(dataAbertura).toLocaleString('pt-BR') : 'Sem data'}</span>
          <span>Fechamento: {dataFechamento ? new Date(dataFechamento).toLocaleString('pt-BR') : 'Sem data'}</span>
        </div>
      </td>
      
      <td className="py-4 px-4 pt-5">
        <span className="text-sm font-semibold text-slate-800 block leading-tight">{ticket?.user?.nome || 'Removido'}</span>
        {ticket?.user?.ramal && (
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">
            Ramal: {ticket.user.ramal}
          </span>
        )}
      </td>

      <td className="py-4 px-4 pt-5 text-center">
        <div className="flex flex-col items-center justify-center gap-1 whitespace-nowrap">
          <span className="text-sm font-bold text-slate-800">{eq?.patrimonio || 'S/P'}</span>
          {ticket?.equipment?.equipmentType?.nome ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shadow-sm">
              {ticket.equipment.equipmentType.nome}
            </span>
          ) : eq?.tipo ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shadow-sm">
              {eq.tipo}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
              Não identificado
            </span>
          )}
        </div>
      </td>

      <td className="py-4 px-4 pt-5 text-center">
        {ticket?.equipment?.sector ? (
          <div className="flex flex-col items-center justify-center gap-0.5 whitespace-nowrap">
            <span className="text-xs font-bold text-slate-700">{ticket.equipment.sector.nome}</span>
            {ticket.equipment.sector.prefixo && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                {ticket.equipment.sector.prefixo}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Não informado</span>
        )}
      </td>

      <td className="py-4 px-4 pt-5 text-sm leading-relaxed w-[400px] max-w-[400px] whitespace-normal">
        <div className="text-slate-600 break-words whitespace-pre-wrap leading-relaxed">
          {isExpanded ? ticket?.descricao_problema : ticket?.descricao_problema?.length > 50 ? `${ticket.descricao_problema.substring(0, 50)}...` : ticket?.descricao_problema || 'Problema não informado.'}
        </div>
        {ticket?.descricao_problema?.length > 50 && (
          <button onClick={() => onToggleExpand(ticket.id)} className="text-xs mt-1 text-blue-600 hover:underline font-bold block cursor-pointer">
            {isExpanded ? 'Ocultar Detalhes' : 'Ler Relato Completo'}
          </button>
        )}
        
        <div className="mt-3 p-3 border border-slate-200 border-l-4 border-l-emerald-500 rounded-r-lg bg-slate-50 shadow-xs w-full min-w-[320px] max-w-[400px]">
          <strong className="flex items-center gap-1.5 mb-1 font-bold text-xs uppercase tracking-wider text-emerald-700">
            <Wrench className="w-3.5 h-3.5" /> Resolução Aplicada:
          </strong>
          
          <p className="font-medium text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-slate-100 mt-1 break-words whitespace-pre-wrap">
            {resolucaoFormatada || 'Nenhuma resolução descrita.'}
          </p>
          
          {ticket?.status_chamado === 'Aguardando Confirmação' && ticket?.finalizador?.nome && (
            <span className="mt-2 block not-italic text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded px-2 py-1.5 leading-snug">
              Aguardando confirmação do usuário. Atendimento enviado por {ticket.finalizador.nome}.
            </span>
          )}
          {ticket?.status_chamado === 'Concluído' && ticket?.confirmador?.nome && (
            <span className="mt-2 block not-italic text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5 leading-snug">
              Confirmado pelo usuário: {ticket.confirmador.nome}.
            </span>
          )}
        </div>
      </td>
      
      <td className="py-4 px-4 pt-5 text-center">
        <span className={`inline-block px-2.5 py-1 rounded border text-xs font-bold ${
          ticket?.status_chamado === 'Concluído' ? 'bg-green-50 text-green-700 border-green-200' : 
          ticket?.status_chamado === 'Aguardando Confirmação' ? 'bg-purple-50 text-purple-700 border-purple-200' :
          'bg-red-50 text-red-700 border-red-200'
        }`}>
          {ticket?.status_chamado === 'Aguardando Confirmação' ? 'Aguardando usuário' : ticket?.status_chamado}
        </span>
      </td>
    </tr>
  );
}