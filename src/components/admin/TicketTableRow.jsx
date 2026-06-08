import React from 'react';

export default function TicketTableRow({ 
  ticket, 
  equipments, 
  usersList, 
  tecnicos, 
  isExpanded, 
  onToggleExpand, 
  onAssignTechnician, 
  onUpdateStatus 
}) {
  const eq = equipments.find(e => e.id === ticket.equipment_id);
  const dataDoChamado = ticket.createdAt || ticket.data_abertura;

  return (
    <tr className={`align-top transition ${ticket.status_chamado === 'Cancelado' ? 'bg-slate-50/50 opacity-80' : 'hover:bg-slate-50'}`}>
      <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500 font-medium leading-tight pt-5">
        {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
      </td>
      
      {/* Solicitante */}
      <td className="py-4 px-4 pt-5">
        <span className="font-semibold text-slate-800 text-sm block leading-tight">
          {ticket.user ? ticket.user.nome : 'Usuário Removido'}
        </span>
        {ticket.user?.ramal && (
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">
            Ramal: {ticket.user.ramal}
          </span>
        )}
      </td>

      {/* Equipamento */}
      <td className="py-4 px-4 pt-5">
        <div className="flex items-center gap-1.5 whitespace-nowrap mb-0.5">
          <span className="font-bold text-blue-600 text-sm">
            {eq ? eq.patrimonio : `ID: ${ticket.equipment_id}`}
          </span>
          {eq?.tipo && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {eq.tipo}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500 block leading-tight">{eq ? eq.observacao : 'Não informado'}</span>
      </td>
      
      {/* Problema */}
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
          <div className={`mt-3 p-3 border rounded-lg text-sm shadow-sm ${
            ticket.status_chamado === 'Cancelado' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <strong className="block mb-1 font-bold">
              {ticket.status_chamado === 'Cancelado' ? 'Motivo do Cancelamento:' : 'Resolução da TI:'}
            </strong>
            <span className="break-words leading-relaxed">{ticket.resolucao_ti}</span>
          </div>
        )}
      </td>

      {/* Responsável TI */}
      <td className="py-4 px-4 text-center align-middle min-w-[220px] pt-4">
        <select 
          value={ticket.tecnico_id || ""}
          onChange={(e) => onAssignTechnician(ticket.id, e.target.value)}
          disabled={ticket.status_chamado === 'Concluído' || ticket.status_chamado === 'Baixa' || ticket.status_chamado === 'Cancelado'}
          className={`text-xs font-bold border rounded-lg px-3 py-2.5 outline-none transition cursor-pointer w-full text-left pr-8 bg-white ${
            ticket.tecnico_id ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          <option value="" className="text-emerald-700 font-bold">Aguardando...</option>
          {tecnicos.map(tec => (
            <option key={tec.id} value={tec.id} className="text-blue-700 font-bold">
              {tec.nome} {tec.ramal ? `(Ramal: ${tec.ramal})` : ''}
            </option>
          ))}
        </select>
      </td>

      {/* Status (🌟 Cor do Aberto igualada ao Aguardando e com largura corrigida) */}
      <td className="py-4 px-4 text-center align-middle min-w-[170px] pt-4">
        <select 
          value={ticket.status_chamado}
          disabled={ticket.status_chamado !== 'Aberto' && ticket.status_chamado !== 'Em Andamento'}
          onChange={(e) => onUpdateStatus(ticket.id, ticket.status_chamado, e.target.value)}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold border outline-none transition cursor-pointer text-center w-full pr-8 bg-white ${
            ticket.status_chamado === 'Aberto' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
            ticket.status_chamado === 'Em Andamento' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            ticket.status_chamado === 'Concluído' ? 'bg-green-50 text-green-700 border-green-200 pointer-events-none' : 
            'bg-red-50 text-red-700 border-red-200 pointer-events-none'
          }`}
        >
          <option value="Aberto" disabled>Aberto</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluído">Concluído</option>
          <option value="Baixa">Baixa</option>
        </select>
      </td>
    </tr>
  );
}