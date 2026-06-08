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
  const solicitante = usersList.find(u => u.id === ticket.user_id); 
  const dataDoChamado = ticket.createdAt || ticket.data_abertura;

  return (
    <tr className={`align-top transition ${ticket.status_chamado === 'Cancelado' ? 'bg-slate-50/50 opacity-80' : 'hover:bg-slate-50'}`}>
      <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500 font-medium leading-tight">
        {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
      </td>
      <td className="py-4 px-4 font-semibold text-slate-800 text-sm">
        {solicitante ? solicitante.nome : 'Usuário Removido'}
      </td>
      
      {/* 🌟 CÉLULA ATUALIZADA: PATRIMÔNIO + BADGE DE TIPO + OBSERVAÇÃO EMBAIXO */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5 whitespace-nowrap mb-0.5">
          <span className="font-semibold text-blue-600 text-sm">
            {eq ? eq.patrimonio : `ID: ${ticket.equipment_id}`}
          </span>
          {eq?.tipo && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {eq.tipo}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500 block">{eq ? eq.observacao : 'Não informado'}</span>
      </td>
      
      <td className="py-4 px-4">
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

      <td className="py-4 px-4 text-center align-middle">
        <select 
          value={ticket.tecnico_id || ""}
          onChange={(e) => onAssignTechnician(ticket.id, e.target.value)}
          disabled={ticket.status_chamado === 'Concluído' || ticket.status_chamado === 'Baixa' || ticket.status_chamado === 'Cancelado'}
          className={`text-xs font-bold border rounded-lg px-2 py-2 outline-none transition cursor-pointer w-full text-center ${
            ticket.tecnico_id 
              ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-500' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-2 focus:ring-emerald-500' 
          } ${
            (ticket.status_chamado === 'Concluído' || ticket.status_chamado === 'Baixa' || ticket.status_chamado === 'Cancelado') && 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          <option value="" className="text-emerald-700 font-bold bg-white">Aguardando...</option>
          {tecnicos.map(tec => (
            <option key={tec.id} value={tec.id} className="text-blue-700 font-bold bg-white">{tec.nome}</option>
          ))}
        </select>
      </td>

      <td className="py-4 px-4 text-center align-middle">
        <select 
          value={ticket.status_chamado}
          disabled={ticket.status_chamado !== 'Aberto'}
          onChange={(e) => onUpdateStatus(ticket.id, ticket.status_chamado, e.target.value)}
          className={`px-3 py-2 rounded-full text-xs font-bold border focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer text-center w-full ${
            ticket.status_chamado === 'Aberto' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
            ticket.status_chamado === 'Concluído' ? 'bg-green-100 text-green-700 border-green-200 appearance-none pointer-events-none' : 
            ticket.status_chamado === 'Baixa' ? 'bg-red-100 text-red-700 border-red-200 appearance-none pointer-events-none' : 
            ticket.status_chamado === 'Cancelado' ? 'bg-slate-200 text-slate-600 border-slate-300 appearance-none pointer-events-none' : 
            'bg-slate-200 text-slate-700 border-slate-300 appearance-none pointer-events-none'
          }`}
        >
          <option value="Aberto" className="text-amber-700 font-bold bg-white">Aberto</option>
          <option value="Concluído" className="text-green-700 font-bold bg-white">Concluído</option>
          <option value="Baixa" className="text-red-700 font-bold bg-white">Baixa</option>
          
          {ticket.status_chamado === 'Cancelado' && (
            <option value="Cancelado" className="text-slate-700 font-bold bg-white">Cancelado</option>
          )}
        </select>
      </td>
    </tr>
  );
}