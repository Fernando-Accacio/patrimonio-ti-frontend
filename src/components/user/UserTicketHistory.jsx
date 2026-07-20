import React, { useState, useEffect } from 'react';
import { Wrench, Send, AlertCircle, X } from 'lucide-react';

export default function UserTicketHistory({ ticket, matchedEq, onFastReply }) {
  const [comentarioDevolucao, setComentarioDevolucao] = useState('');
  const [avisoFechado, setAvisoFechado] = useState(false);

  // 🌟 CONTROLE DO ALERTA PISCANTE DO USUÁRIO
  useEffect(() => {
    if (ticket?.id) {
      const tamanhoConversa = ticket.resolucao_ti ? ticket.resolucao_ti.length : 0;
      const visualizado = localStorage.getItem(`alerta_usuario_visto_${ticket.id}_${tamanhoConversa}`);
      setAvisoFechado(visualizado === 'true');
    }
  }, [ticket?.id, ticket?.resolucao_ti]);

  const handleFecharAviso = (e) => {
    e.stopPropagation();
    const tamanhoConversa = ticket.resolucao_ti ? ticket.resolucao_ti.length : 0;
    localStorage.setItem(`alerta_usuario_visto_${ticket.id}_${tamanhoConversa}`, 'true');
    setAvisoFechado(true);
  };

  let resolucaoVisivel = (ticket?.resolucao_ti || '').toString().trim();
  
  // Se não houver histórico, não renderiza o componente
  if (!resolucaoVisivel) return null;

  if (resolucaoVisivel && !resolucaoVisivel.startsWith('[')) {
    const linhas = resolucaoVisivel.split('\n');
    linhas[0] = `Resolução: "${linhas[0]}"`;
    resolucaoVisivel = linhas.join('\n');
  }

  const textoOriginal = (ticket.resolucao_ti || '').toString();
  const indexSuporte = textoOriginal.lastIndexOf('[OBSERVAÇÃO DO SUPORTE]');
  const indexUsuario = textoOriginal.lastIndexOf('[CONFIRMAÇÃO DO USUÁRIO]');
  const indexRecusa = textoOriginal.lastIndexOf('[RECUSADO PELO USUÁRIO]');
  const indexUltimoUsuario = Math.max(indexUsuario, indexRecusa);

  const chamadoRetornadoParaUsuario = indexSuporte > -1 && indexSuporte > indexUltimoUsuario && ticket.status_chamado === 'Aberto' && !avisoFechado;
  const temObservacaoPendente = indexSuporte > -1 && indexSuporte > indexUltimoUsuario && ticket.status_chamado === 'Aberto';

  resolucaoVisivel = resolucaoVisivel.replace(/\[CANCELADO PELO USUÁRIO\]:\s*/gi, 'Cancelado pelo Usuário: ');
  resolucaoVisivel = resolucaoVisivel.replace(/\[CONFIRMAÇÃO DO USUÁRIO\]:\s*(.+)/gi, 'Confirmação do Usuário: "$1"');
  resolucaoVisivel = resolucaoVisivel.replace(/\[CONFIRMADO PELO USUÁRIO\]:\s*(.+)/gi, 'Confirmação do Usuário: "$1"');
  resolucaoVisivel = resolucaoVisivel.replace(/\[RECUSADO PELO USUÁRIO\]:\s*(.+)/gi, 'Recusa do Usuário: "$1"');
  resolucaoVisivel = resolucaoVisivel.replace(/\[SISTEMA\]:\s*(.+)/gi, 'Sistema: "$1"');
  resolucaoVisivel = resolucaoVisivel.replace(/\[OBSERVAÇÃO DO SUPORTE\]:\s*(.+)/gi, 'Observação do Suporte: "$1"');
  resolucaoVisivel = resolucaoVisivel.replace(/\[RESOLUÇÃO\]:\s*(.+)/gi, 'Resolução: "$1"');
  resolucaoVisivel = resolucaoVisivel.trim();

  const handleEnviarRespostaSuporte = (e) => {
    e.preventDefault();
    if (!comentarioDevolucao.trim()) return;
    
    onFastReply(ticket.id, {
      descricao_problema: ticket.descricao_problema,
      patrimonio: matchedEq ? matchedEq.patrimonio : '',
      equipment_type_id: matchedEq ? matchedEq.equipment_type_id : null,
      sector_id: matchedEq ? matchedEq.sector_id : null,
      resposta_observacao: comentarioDevolucao.trim()
    });
    setComentarioDevolucao('');
  };

  const handleKeyDownSuporte = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEnviarRespostaSuporte(e);
    }
  };

  return (
    <div className="mt-3 p-3 border border-slate-200 border-l-4 rounded-r-lg text-sm shadow-xs bg-slate-50 w-full min-w-[320px] max-w-[400px] border-l-emerald-500">
      
      {chamadoRetornadoParaUsuario && (
        <div className="mb-2 inline-flex items-center gap-2 px-2.5 py-1 bg-orange-100 border border-orange-200 text-orange-700 text-[11px] font-bold rounded-md uppercase tracking-wider animate-pulse w-full justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Atenção: TI solicitou informações</span>
          </div>
          <button 
            onClick={handleFecharAviso}
            className="p-0.5 hover:bg-orange-200 rounded text-orange-800 transition cursor-pointer"
            title="Dispensar alerta"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <strong className="flex items-center gap-1.5 mb-1 font-bold text-xs uppercase tracking-wider text-emerald-700">
        <Wrench className="w-3.5 h-3.5" /> Histórico de Diálogo:
      </strong>
      
      <div className="font-medium text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-slate-100 mt-1 break-words whitespace-pre-wrap">
        {resolucaoVisivel}
      </div>
      
      {temObservacaoPendente && (
        <form onSubmit={handleEnviarRespostaSuporte} className="mt-3 pt-3 border-t border-slate-200/60 flex flex-col gap-2">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Responder Dúvida do Suporte:</span>
          <div className="flex gap-1.5">
            <input 
              type="text" 
              placeholder="Ex: Está correto sim, pode prosseguir!" 
              className="text-xs p-1.5 border rounded border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white flex-1"
              value={comentarioDevolucao}
              onChange={(e) => setComentarioDevolucao(e.target.value)}
              onKeyDown={handleKeyDownSuporte}
            />
            <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white rounded p-1.5 flex items-center justify-center transition cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {ticket.status_chamado === 'Aguardando Confirmação' && ticket.finalizador?.nome && (
        <p className="mt-2 text-[12px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded px-2 py-2 leading-snug">
          Sua análise ainda está aguardando confirmação após o atendimento de {ticket.finalizador.nome}.
        </p>
      )}
    </div>
  );
}