import React, { useState } from 'react';
import { Edit2, UserCircle, AlertTriangle, Wrench, Send } from 'lucide-react';

export default function MyTicketsTableRow({ 
  ticket, equipments, isExpanded, onToggleExpand, onEditClick, onCancelTicketClick, 
  onResponderConfirmacao, onFastReply // 🌟 1. Adicionado aqui!
}) {
  const [comentario, setComentario] = useState('');
  const [comentarioDevolucao, setComentarioDevolucao] = useState('');
  const [erroConfirmacao, setErroConfirmacao] = useState('');
  const matchedEq = equipments.find(e => e.id === ticket.equipment_id);
  const dataDoChamado = ticket.createdAt || ticket.data_abertura;
  const dataFechamento = ticket.finished_at || ticket.updatedAt || null;
  const nomeTecnico = ticket.tecnico?.nome || null;

  let resolucaoVisivel = (ticket.resolucao_ti || '').toString();

  resolucaoVisivel = resolucaoVisivel.replace(/\[CANCELADO PELO USUÁRIO\]:\s*/gi, '');
  resolucaoVisivel = resolucaoVisivel.replace(/\[CONFIRMAÇÃO DO USUÁRIO\]:\s*(.+)/gi, 'Resposta do Usuário: "$1"');
  resolucaoVisivel = resolucaoVisivel.replace(/\[RECUSADO PELO USUÁRIO\]:\s*(.+)/gi, 'Recusa do Usuário: "$1"');
  resolucaoVisivel = resolucaoVisivel.replace(/\[SISTEMA\]:\s*(.+)/gi, 'Sistema: "$1"');
  resolucaoVisivel = resolucaoVisivel.replace(/\[OBSERVAÇÃO DO SUPORTE\]:\s*(.+)/gi, 'Observação do Suporte: "$1"');
  resolucaoVisivel = resolucaoVisivel.trim();

  const handleResponder = (aprovado) => {
    if (!aprovado && !comentario.trim()) {
      setErroConfirmacao('Digite o que faltou para concluir antes de retornar o chamado.');
      return;
    }
    setErroConfirmacao('');
    onResponderConfirmacao(ticket.id, aprovado, comentario.trim());
  };

  const handleEnviarRespostaSuporte = (e) => {
    e.preventDefault();
    if (!comentarioDevolucao.trim()) return;
    
    // 🌟 2. Mudamos para onFastReply e atualizamos os nomes pro formato novo do BD!
    onFastReply(ticket.id, {
      descricao_problema: ticket.descricao_problema,
      patrimonio: matchedEq ? matchedEq.patrimonio : '',
      equipment_type_id: matchedEq ? matchedEq.equipment_type_id : null,
      sector_id: matchedEq ? matchedEq.sector_id : null,
      resposta_observacao: comentarioDevolucao.trim()
    });
    setComentarioDevolucao('');
  };

  // Enviar a dúvida de suporte ao dar Enter na barra pequena de input
  const handleKeyDownSuporte = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEnviarRespostaSuporte(e);
    }
  };

  // Enviar confirmação positiva ao dar Enter na caixa de fechamento do chamado
  const handleKeyDownConfirmacao = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleResponder(true); // Confirma a solução nativamente por padrão ao dar Enter
    }
  };

  const textoOriginal = (ticket.resolucao_ti || '').toString();
  const indexSuporte = textoOriginal.lastIndexOf('[OBSERVAÇÃO DO SUPORTE]');
  const indexUsuario = textoOriginal.lastIndexOf('[CONFIRMAÇÃO DO USUÁRIO]');
  
  const temObservacaoPendente = indexSuporte > -1 && indexSuporte > indexUsuario && ticket.status_chamado === 'Aberto';

  return (
    <tr className={`border-b align-top transition ${ticket.status_chamado === 'Cancelado' ? 'bg-slate-50/50 opacity-70' : 'hover:bg-slate-50'}`}>
      <td className="py-3 px-3 align-top text-center pt-4">
        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded border ${ticket.codigo_processo ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200 font-medium'}`}>
          {ticket.codigo_processo || 'Antigo / N/A'}
        </span>
      </td>

      <td className="py-3 px-3 text-sm font-medium text-slate-500 pt-4">
        <div className="flex flex-col gap-1 whitespace-nowrap">
          <span>Abertura: {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}</span>
          <span>Fechamento: {dataFechamento ? new Date(dataFechamento).toLocaleString('pt-BR') : (ticket.status_chamado === 'Aguardando Confirmação' ? 'Aguardando confirmação' : 'Em aberto')}</span>
        </div>
      </td>
      
      <td className="py-3 px-3 pt-4">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-bold text-blue-600 text-sm">
            {matchedEq ? matchedEq.patrimonio : `ID: ${ticket.equipment_id}`}
          </span>
          {/* 🌟 Aqui estava matchedEq.tipo (a string sumiu do banco). 
              Se quiser mostrar o nome do tipo na tabela, teremos que incluir o EquipmentType no include do backend depois, 
              mas por enquanto deixei comentado pra não quebrar. */}
          {/* {matchedEq?.equipmentType?.nome && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {matchedEq.equipmentType.nome}
            </span>
          )} */}
        </div>
      </td>

      <td className="py-3 px-3 pt-4 w-[400px] min-w-[350px] max-w-[400px] whitespace-normal">
        {/* 🌟 Essa div garante que o conteúdo respeite o tamanho, segurando a elasticidade */}
        <div className="w-full max-w-[380px]">
          <div className="text-slate-600 break-words whitespace-pre-wrap text-sm leading-relaxed">
            {isExpanded ? ticket.descricao_problema : ticket.descricao_problema.length > 50 ? `${ticket.descricao_problema.substring(0, 50)}...` : ticket.descricao_problema}
          </div>
          {ticket.descricao_problema.length > 50 && (
            <button onClick={() => onToggleExpand(ticket.id)} className="text-xs text-blue-600 hover:underline font-bold block mt-1 cursor-pointer">
              {isExpanded ? 'Ocultar Detalhes' : 'Ler Relato Completo'}
            </button>
          )}
        </div>
        
        {/* Histórico */}
        {(ticket.resolucao_ti || '').toString().trim() && (
          <div className="mt-3 p-3 border border-slate-200 border-l-4 rounded-r-lg text-sm shadow-xs bg-slate-50 w-full min-w-[320px] max-w-[400px] border-l-emerald-500">
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
                    onKeyDown={handleKeyDownSuporte} // 🌟 Envia no Enter nativo do input
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
        )}
      </td>
      
      <td className="py-3 px-3 text-center pt-4">
        {nomeTecnico ? (
          <div className="flex flex-col items-center gap-0.5">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${
              ticket.status_chamado === 'Cancelado' 
                ? 'bg-slate-100 text-slate-500 border-slate-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <UserCircle className="w-3.5 h-3.5" /> {nomeTecnico}
            </div>
            {ticket.tecnico?.ramal && (
              <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                Ramal: {ticket.tecnico.ramal}
              </span>
            )}
          </div>
        ) : ticket.status_chamado === 'Cancelado' ? (
          <span className="text-xs text-slate-400 font-medium">—</span>
        ) : (
          <span className="text-xs text-slate-400 font-medium italic">Aguardando TI</span>
        )}
      </td>

      <td className="py-3 px-3 text-center pt-4">
        <span className={`whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-bold border ${
          ticket.status_chamado === 'Concluído' ? 'bg-green-100 text-green-700 border-green-200' : 
          ticket.status_chamado === 'Baixa' ? 'bg-red-50 text-red-700 border-red-200' :
          ticket.status_chamado === 'Cancelado' ? 'bg-slate-200 text-slate-600 border-slate-300' : 
          ticket.status_chamado === 'Aguardando Confirmação' ? 'bg-purple-100 text-purple-700 border-purple-200 animate-pulse' :
          'bg-blue-100 text-blue-700 border-blue-200' 
        }`}>
          {ticket.status_chamado}
        </span>
      </td>
      
      <td className="py-3 px-3 text-center pt-4">
        {ticket.status_chamado === 'Aberto' ? (
          <div className="flex min-w-[122px] flex-col gap-2 mx-auto">
            <button
              type="button"
              onClick={() => onEditClick(ticket)} // 🌟 Editar continua chamando onEditClick
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 shadow-sm transition hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5 transition-transform group-hover:-rotate-6" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => onCancelTicketClick(ticket.id)}
              className="group inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 shadow-sm transition hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              Cancelar
            </button>
          </div>
        ) : ticket.status_chamado === 'Aguardando Confirmação' ? (
          <div className="flex flex-col gap-2 max-w-[180px] mx-auto">
            {erroConfirmacao && (
              <div className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700 text-left leading-tight">
                {erroConfirmacao}
              </div>
            )}
            <textarea 
              placeholder="Comentário opcional sobre a solução..." 
              className="text-xs p-2 border rounded border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-400 w-full resize-none h-16"
              value={comentario}
              onChange={(e) => {
                setComentario(e.target.value);
                if (erroConfirmacao) setErroConfirmacao('');
              }}
              onKeyDown={handleKeyDownConfirmacao} // 🌟 Ao apertar Enter, confirma a solução
            />
            <div className="flex gap-1">
              <button type="button" onClick={() => handleResponder(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-[10px] flex-1 cursor-pointer">
                Confirmar solução
              </button>
              <button type="button" onClick={() => handleResponder(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-[10px] flex-1 cursor-pointer">
                Não foi concluído
              </button>
            </div>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic font-medium bg-slate-50 px-2 py-1.5 rounded block border border-slate-100">Trancado</span>
        )}
      </td>
    </tr>
  );
}