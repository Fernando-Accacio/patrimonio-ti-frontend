import React, { useState } from 'react';

export default function TicketTable({ tickets, equipments, usersList, filter, onUpdateStatus }) {
  const [expandedTickets, setExpandedTickets] = useState({});

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTickets = tickets
    .sort((a, b) => b.id - a.id)
    .filter(tk => filter === 'Todos' || tk.status_chamado === filter);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
        Gestão de Chamados 
        {filter !== 'Todos' && <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-2">Filtrado por: {filter}</span>}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b">
            <tr>
              <th className="py-3 px-4">Data / Horário</th>
              <th className="py-3 px-4">Solicitante</th>
              <th className="py-3 px-4">Patrimônio</th>
              <th className="py-3 px-4">Local / Setor</th>
              <th className="py-3 px-4 w-1/3">Problema Relatado</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((tk) => {
              const eq = equipments.find(e => e.id === tk.equipment_id);
              const isExpanded = !!expandedTickets[tk.id];
              const solicitante = usersList.find(u => u.id === tk.user_id); 
              
              const dataDoChamado = tk.createdAt || tk.data_abertura;

              return (
                <tr key={tk.id} className="border-b hover:bg-slate-50 align-top">
                  {/* ALTERADO: Mudamos para toLocaleString para exibir as horas, minutos e segundos */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                    {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800">{solicitante ? solicitante.nome : 'Usuário Deletado'}</td>
                  <td className="py-4 px-4 font-semibold text-blue-600">{eq ? eq.patrimonio : `ID: ${tk.equipment_id}`}</td>
                  <td className="py-4 px-4 text-slate-700 font-medium">{eq ? eq.observacao : 'Não informado'}</td>
                  
                  <td className="py-4 px-4 max-w-xs">
                    <div className="text-slate-600 break-words">
                      {isExpanded ? tk.descricao_problema : tk.descricao_problema.length > 50 ? `${tk.descricao_problema.substring(0, 50)}...` : tk.descricao_problema}
                    </div>
                    {tk.descricao_problema.length > 50 && (
                      <button onClick={() => toggleExpandirChamado(tk.id)} className="text-xs text-blue-600 hover:underline font-semibold block mt-1 cursor-pointer">
                        {isExpanded ? 'Ver menos' : 'Ver mais'}
                      </button>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <select 
                      value={tk.status_chamado}
                      disabled={tk.status_chamado !== 'Aberto'}
                      onChange={(e) => onUpdateStatus(tk.id, tk.status_chamado, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-bold border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                        tk.status_chamado === 'Aberto' ? 'bg-blue-100 text-blue-700 border-blue-200 cursor-pointer' : 
                        tk.status_chamado === 'Concluído' ? 'bg-green-100 text-green-700 border-green-200 appearance-none' : 
                        'bg-slate-200 text-slate-700 border-slate-300 appearance-none'
                      }`}
                    >
                      <option value="Aberto">Aberto</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Baixa">Baixa</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}