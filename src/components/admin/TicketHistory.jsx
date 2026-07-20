import React from 'react';
import { Info, Wrench } from 'lucide-react';

export default function TicketHistory({ ticket }) {
  let resolucaoFormatada = (ticket?.resolucao_ti || '').toString();

  // 1. Formata a resposta direta do técnico (primeira linha)
  if (resolucaoFormatada.trim() && !resolucaoFormatada.trim().startsWith('[')) {
    const linhas = resolucaoFormatada.split('\n');
    linhas[0] = `Resolução: "${linhas[0]}"`;
    resolucaoFormatada = linhas.join('\n');
  }

  // 2. Traduz as tags automáticas do sistema
  resolucaoFormatada = resolucaoFormatada.replace(/\[(?:CONFIRMADO PELO USUÁRIO|CONFIRMAÇÃO DO USUÁRIO)\]:\s*(.+)/gi, 'Confirmação do Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[RECUSADO PELO USUÁRIO\]:\s*(.+)/gi, 'Recusa do Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[CANCELADO PELO USUÁRIO\]:\s*(.+)/gi, 'Cancelado pelo Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[SISTEMA\]:\s*(.+)/gi, 'Sistema: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[OBSERVAÇÃO DO SUPORTE\]:\s*(.+)/gi, 'Observação do Suporte: "$1"');

  if (!resolucaoFormatada.trim()) {
    return null; // Não renderiza nada se não houver histórico
  }

  return (
    <div className={`mt-3 p-3 border border-slate-200 border-l-4 rounded-r-lg text-sm shadow-xs bg-slate-50 w-full min-w-[320px] max-w-[400px] ${ticket?.status_chamado === 'Cancelado' ? 'border-l-slate-400' : 'border-l-emerald-500'}`}>
      <strong className={`flex items-center gap-1.5 mb-1 font-bold text-xs uppercase tracking-wider ${ticket?.status_chamado === 'Cancelado' ? 'text-slate-500' : 'text-emerald-700'}`}>
        {ticket?.status_chamado === 'Cancelado' ? <><Info className="w-3.5 h-3.5" /> Motivo do Cancelamento:</> : <><Wrench className="w-3.5 h-3.5" /> Histórico de Diálogo:</>}
      </strong>
      
      <p className="font-medium text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-slate-100 mt-1 break-words whitespace-pre-wrap">
        {resolucaoFormatada}
      </p>   
      
      {ticket?.status_chamado === 'Aguardando Confirmação' && ticket?.finalizador?.nome && (
        <p className="mt-2 text-[12px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded px-2 py-2 leading-snug">
          Aguardando confirmação do usuário. Atendimento enviado por {ticket.finalizador.nome}.
        </p>
      )}
      {ticket?.status_chamado === 'Concluído' && ticket?.confirmador?.nome && (
        <p className="mt-2 text-[12px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded px-2 py-2 leading-snug">
          Confirmado pelo usuário: {ticket.confirmador.nome}.
        </p>
      )}
    </div>
  );
}