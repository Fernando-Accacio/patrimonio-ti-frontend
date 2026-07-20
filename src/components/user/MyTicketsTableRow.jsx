import React, { useState } from 'react';
import { Edit2, UserCircle, AlertTriangle } from 'lucide-react';
import UserTicketHistory from './UserTicketHistory';

export default function MyTicketsTableRow({ 
  ticket, equipments, isExpanded, onToggleExpand, onEditClick, onCancelTicketClick, 
  onResponderConfirmacao, onFastReply
}) {
  const [comentario, setComentario] = useState('');
  const [erroConfirmacao, setErroConfirmacao] = useState('');
  
  const matchedEq = equipments.find(e => e.id === ticket.equipment_id);
  const dataDoChamado = ticket.createdAt || ticket.data_abertura;
  const dataFechamento = ticket.finished_at || ticket.updatedAt || null;
  const nomeTecnico = ticket.tecnico?.nome || null;

  const handleResponder = (aprovado) => {
    if (!aprovado && !comentario.trim()) {
      setErroConfirmacao('Digite o que faltou para concluir antes de retornar o chamado.');
      return;
    }
    
    setErroConfirmacao('');
    onResponderConfirmacao(ticket.id, aprovado, comentario.trim());
    
    setComentario(''); 
  };

  const handleKeyDownConfirmacao = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleResponder(true);
    }
  };

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
      
      <td className="py-3 px-3 text-center">
        <div className="flex flex-col items-center justify-center gap-1 whitespace-nowrap">
          <span className="font-bold text-slate-800 text-sm">
            {ticket.equipment?.patrimonio || `ID: ${ticket.equipment_id}`}
          </span>
          {ticket.equipment?.equipmentType?.nome ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shadow-sm">
              {ticket.equipment.equipmentType.nome}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
              Não identificado
            </span>
          )}
        </div>
      </td>

      <td className="py-3 px-3 text-center">
        {ticket.equipment?.sector ? (
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

      <td className="py-3 px-3 pt-4 min-w-[200px] max-w-[500px] whitespace-normal">
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
        
        {/* 🌟 Componentizado! O código sujo sumiu daqui e virou só 1 linha */}
        <UserTicketHistory ticket={ticket} matchedEq={matchedEq} onFastReply={onFastReply} />

      </td>
      
      <td className="py-3 px-3 text-center pt-4">
        {nomeTecnico ? (
          <div className="flex flex-col items-center gap-1">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${
              ticket.status_chamado === 'Cancelado' 
                ? 'bg-slate-100 text-slate-500 border-slate-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <UserCircle className="w-3.5 h-3.5 text-amber-600" /> {nomeTecnico}
            </div>
            {ticket.tecnico?.ramal && (
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mt-0.5">
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
              onClick={() => onEditClick(ticket)}
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
              onKeyDown={handleKeyDownConfirmacao}
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