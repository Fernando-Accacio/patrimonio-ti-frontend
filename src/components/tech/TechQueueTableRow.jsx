import React from 'react';

export default function TechQueueTableRow({ ticket, equipments, isExpanded, onToggleExpand }) {
  // Garantimos que equipments não é undefined antes do find
  const eq = equipments?.find(e => e.id === ticket.equipment_id);
  const dataDoChamado = ticket.createdAt || ticket.data_abertura;

  // O SEGREDO ESTÁ AQUI: Fallback unificado
  const currentEq = ticket.equipment || eq;

  return (
    <tr className="hover:bg-slate-50 transition align-top">
      {/* ... (Colunas de Processo, Data e Solicitante continuam iguais) ... */}
      <td className="py-4 px-4 pt-5 align-top text-center">
        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded border ${ticket.codigo_processo ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200 font-medium'}`}>
          {ticket.codigo_processo || 'Antigo / N/A'}
        </span>
      </td>

      <td className="py-4 px-4 pt-5 text-sm font-medium text-slate-500 whitespace-nowrap">
        {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
      </td>
      
      <td className="py-4 px-4 pt-5">
        <span className="text-sm font-semibold text-slate-800 block leading-tight">{ticket.user?.nome || 'Removido'}</span>
        {ticket.user?.ramal && (
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">
            Ramal: {ticket.user.ramal}
          </span>
        )}
      </td>

      {/* COLUNA DE EQUIPAMENTO ATUALIZADA */}
      <td className="py-4 px-4 pt-5 text-center">
        <div className="flex flex-col items-center justify-center gap-1 whitespace-nowrap">
          <span className="text-sm font-bold text-slate-800">{currentEq?.patrimonio || 'S/P'}</span>
          {currentEq?.equipmentType?.nome ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shadow-sm">
              {currentEq.equipmentType.nome}
            </span>
          ) : currentEq?.tipo ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shadow-sm">
              {currentEq.tipo}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
              Não identificado
            </span>
          )}
        </div>
      </td>

      {/* COLUNA DE SETOR ATUALIZADA */}
      <td className="py-4 px-4 pt-5 text-center">
        {currentEq?.sector ? (
          <div className="flex flex-col items-center justify-center gap-0.5 whitespace-nowrap">
            <span className="text-xs font-bold text-slate-700">{currentEq.sector.nome}</span>
            {currentEq.sector.prefixo && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                {currentEq.sector.prefixo}
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Não informado</span>
        )}
      </td>

      <td className="py-4 px-4 pt-5 min-w-[300px] max-w-[400px]">
        <div className="text-slate-600 break-words whitespace-pre-wrap text-sm leading-relaxed">
          {isExpanded ? ticket.descricao_problema : ticket.descricao_problema?.length > 50 ? `${ticket.descricao_problema.substring(0, 50)}...` : ticket.descricao_problema}
        </div>
        {ticket.descricao_problema?.length > 50 && (
          <button onClick={() => onToggleExpand(ticket.id)} className="text-xs mt-1 text-blue-600 hover:underline font-bold block cursor-pointer">
            {isExpanded ? 'Ocultar Detalhes' : 'Ler Relato Completo'}
          </button>
        )}
      </td>
    </tr>
  );
}