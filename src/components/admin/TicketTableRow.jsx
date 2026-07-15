import React, { useState, useEffect } from 'react';
import { Info, Wrench, AlertCircle, X } from 'lucide-react';
import TechDropdown from './dropdowns/TechDropdown';
import StatusDropdown from './dropdowns/StatusDropdown';

export default function TicketTableRow({ 
  ticket, equipments, usersList, tecnicos, isExpanded, onToggleExpand, onAssignTechnician, onUpdateStatus, isLast, isLastTech, onDevolverClick
}) {
  const safeEquipments = equipments || [];
  const safeTecnicos = tecnicos || [];
  
  const eq = safeEquipments.find(e => e.id === ticket?.equipment_id);
  const dataDoChamado = ticket?.createdAt || ticket?.data_abertura;
  const dataFechamento = ticket?.finished_at || ticket?.updatedAt || null;
  const atualTecnico = ticket?.tecnico || safeTecnicos.find(tec => tec.id === ticket?.tecnico_id);
  
  const isFinalizado = ['Concluído', 'Baixa', 'Cancelado', 'Aguardando Confirmação'].includes(ticket?.status_chamado);

  const [avisoFechado, setAvisoFechado] = useState(false);

  // Monitora alterações para resetar o dismiss do aviso caso novas mensagens cheguem
  useEffect(() => {
    if (ticket?.id) {
      const visualizado = localStorage.getItem(`alerta_visto_${ticket.id}`);
      if (visualizado === 'true') {
        setAvisoFechado(true);
      } else {
        setAvisoFechado(false);
      }
    }
  }, [ticket?.id, ticket?.resolucao_ti]);

  // Formatação do histórico para a tela do Admin
  let resolucaoFormatada = (ticket?.resolucao_ti || '').toString();
  resolucaoFormatada = resolucaoFormatada.replace(/\[CONFIRMAÇÃO DO USUÁRIO\]:\s*(.+)/gi, 'Resposta do Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[RECUSADO PELO USUÁRIO\]:\s*(.+)/gi, 'Recusa do Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[CANCELADO PELO USUÁRIO\]:\s*(.+)/gi, 'Cancelado pelo Usuário: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[SISTEMA\]:\s*(.+)/gi, 'Sistema: "$1"');
  resolucaoFormatada = resolucaoFormatada.replace(/\[OBSERVAÇÃO DO SUPORTE\]:\s*(.+)/gi, 'Observação do Suporte: "$1"');

  // 🌟 REGRA À PROVA DE FALHAS: Isola a última tag inserida na string
  const textoResolucao = (ticket?.resolucao_ti || '').toString().trim();
  const tagsEncontradas = [...textoResolucao.matchAll(/\[(OBSERVAÇÃO DO SUPORTE|CONFIRMAÇÃO DO USUÁRIO)\]/g)];
  
  let respondidoPeloCliente = false;
  if (tagsEncontradas.length > 0) {
    const ultimaTag = tagsEncontradas[tagsEncontradas.length - 1][1];
    respondidoPeloCliente = ultimaTag === 'CONFIRMAÇÃO DO USUÁRIO';
  }

  const chamadoRetornado = respondidoPeloCliente && ['Aberto', 'Em Andamento'].includes(ticket?.status_chamado) && !avisoFechado;

  const handleFecharAviso = (e) => {
    e.stopPropagation();
    localStorage.setItem(`alerta_visto_${ticket.id}`, 'true');
    setAvisoFechado(true);
  };

  return (
    <tr className="align-top transition hover:bg-slate-50 border-b border-slate-100">
      <td className="py-4 px-4 pt-5 align-top text-center">
        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded border ${ticket?.codigo_processo ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200 font-medium'}`}>
          {ticket?.codigo_processo || 'Antigo / N/A'}
        </span>
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500 font-medium leading-tight pt-5">
        <div className="flex flex-col gap-1 whitespace-normal leading-tight">
          <span>Abertura: {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}</span>
          <span>Fechamento: {dataFechamento ? new Date(dataFechamento).toLocaleString('pt-BR') : (ticket?.status_chamado === 'Aguardando Confirmação' ? 'Aguardando confirmação' : 'Em aberto')}</span>
        </div>
      </td>

      <td className="py-4 px-4 pt-5">
        <span className="font-semibold text-slate-800 text-sm block leading-tight">{ticket?.user ? ticket.user.nome : 'Usuário Removido'}</span>
        {ticket?.user?.ramal && <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">Ramal: {ticket.user.ramal}</span>}
      </td>

      <td className="py-4 px-4 pt-5">
        <div className="flex items-center gap-1.5 whitespace-nowrap mb-0.5">
          <span className="font-bold text-blue-600 text-sm">{eq ? eq.patrimonio : `ID: ${ticket?.equipment_id}`}</span>
          {eq?.tipo && <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{eq.tipo}</span>}
        </div>
        <span className="text-xs text-slate-500 block leading-tight">{eq ? eq.observacao : 'Não informado'}</span>
        
        {!isFinalizado && (
          <button 
            onClick={() => onDevolverClick(ticket)} 
            className="mt-2 text-[10px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center gap-1 transition cursor-pointer"
          >
            <Info className="w-3 h-3" /> Editar Pat. ou Devolver
          </button>
        )}
      </td>
      
      <td className="py-4 px-4 pt-5">
        {chamadoRetornado && (
          <div className="mb-2 inline-flex items-center gap-2 px-2.5 py-1 bg-orange-100 border border-orange-200 text-orange-700 text-[11px] font-bold rounded-md uppercase tracking-wider animate-pulse">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Atenção: Chamado Retornado / Editado</span>
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

        <div className="text-slate-600 break-words text-sm leading-relaxed">
          {isExpanded ? ticket?.descricao_problema : ticket?.descricao_problema?.length > 50 ? `${ticket.descricao_problema.substring(0, 50)}...` : ticket?.descricao_problema}
        </div>
        {ticket?.descricao_problema?.length > 50 && (
          <button onClick={() => onToggleExpand(ticket.id)} className="text-sm text-blue-600 hover:underline font-bold block mt-1 cursor-pointer">
            {isExpanded ? 'Ocultar Detalhes' : 'Ler Relato Completo'}
          </button>
        )}

        {resolucaoFormatada.trim() && (
          <div className={`mt-3 p-3 border border-slate-200 border-l-4 rounded-r-lg text-sm shadow-xs bg-slate-50 ${ticket?.status_chamado === 'Cancelado' ? 'border-l-slate-400' : 'border-l-emerald-500'}`}>
            <strong className={`flex items-center gap-1.5 mb-1 font-bold text-xs uppercase tracking-wider ${ticket?.status_chamado === 'Cancelado' ? 'text-slate-500' : 'text-emerald-700'}`}>
              {ticket?.status_chamado === 'Cancelado' ? <><Info className="w-3.5 h-3.5" /> Motivo do Cancelamento:</> : <><Wrench className="w-3.5 h-3.5" /> Histórico de Diálogo:</>}
            </strong>
            <p className="font-medium text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-slate-100 mt-1 break-words whitespace-pre-wrap">
              {resolucaoFormatada}
            </p>   
            {ticket?.status_chamado === 'Aguardando Confirmação' && ticket?.finalizador?.nome && (
              <p className="mt-2 text-[12px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded px-2 py-2">
                Aguardando confirmação do usuário. Atendimento enviado por {ticket.finalizador.nome}.
              </p>
            )}
          </div>
        )}
      </td>

      <td className="py-4 px-4 text-center align-middle min-w-[220px] pt-4">
        <TechDropdown ticketId={ticket?.id} tecnicos={safeTecnicos} atualTecnico={atualTecnico} isFinalizado={isFinalizado} onAssignTechnician={onAssignTechnician} isLast={isLast} isLastTech={isLastTech} />
      </td>

      <td className="py-4 px-4 text-center align-middle min-w-[170px] pt-4">
        <StatusDropdown ticketId={ticket?.id} currentStatus={ticket?.status_chamado} tecnicoId={ticket?.tecnico_id} isFinalizado={isFinalizado} onUpdateStatus={onUpdateStatus} isLast={isLast} solicitanteNome={ticket?.user?.nome || ''} />
      </td>
    </tr>
  );
}