import React, { useState } from 'react';
import api from '../../services/api';

export default function TicketTable({ tickets, equipments, usersList, filter, onUpdateStatus }) {
  const [expandedTickets, setExpandedTickets] = useState({});

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tecnicos = usersList.filter(u => u.role === 'TECH');

  const filteredTickets = tickets
    .sort((a, b) => b.id - a.id)
    .filter(tk => filter === 'Todos' || tk.status_chamado === filter);

  const handleAssignTechnician = async (ticketId, tecnicoId) => {
    try {
      const payload = tecnicoId ? { tecnico_id: Number(tecnicoId) } : { tecnico_id: null };
      await api.patch(`/tickets/${ticketId}/assign`, payload);
    } catch (err) {
      alert("Erro ao atribuir técnico: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8 animate-in fade-in duration-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
        Gestão de Chamados 
        {filter !== 'Todos' && <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Filtrado por: {filter}</span>}
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Abertura</th>
              <th className="py-3 px-4">Solicitante</th>
              <th className="py-3 px-4">Patrimônio</th>
              <th className="py-3 px-4 w-1/3">Problema & Solução</th>
              <th className="py-3 px-4 text-center">Responsável (TI)</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTickets.map((tk) => {
              const eq = equipments.find(e => e.id === tk.equipment_id);
              const isExpanded = !!expandedTickets[tk.id];
              const solicitante = usersList.find(u => u.id === tk.user_id); 
              
              const dataDoChamado = tk.createdAt || tk.data_abertura;

              return (
                <tr key={tk.id} className={`align-top transition ${tk.status_chamado === 'Cancelado' ? 'bg-slate-50/50 opacity-80' : 'hover:bg-slate-50'}`}>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-500 font-medium leading-tight">
                    {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800 text-sm">{solicitante ? solicitante.nome : 'Usuário Removido'}</td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-blue-600 text-sm block">{eq ? eq.patrimonio : `ID: ${tk.equipment_id}`}</span>
                    <span className="text-xs text-slate-500 block mt-0.5">{eq ? eq.observacao : 'Não informado'}</span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="text-slate-600 break-words text-sm leading-relaxed">
                      {isExpanded ? tk.descricao_problema : tk.descricao_problema.length > 50 ? `${tk.descricao_problema.substring(0, 50)}...` : tk.descricao_problema}
                    </div>
                    {tk.descricao_problema.length > 50 && (
                      <button onClick={() => toggleExpandirChamado(tk.id)} className="text-sm text-blue-600 hover:underline font-bold block mt-1 cursor-pointer">
                        {isExpanded ? 'Ocultar Detalhes' : 'Ler Relato Completo'}
                      </button>
                    )}

                    {/* ATUALIZADO: CAIXA DE RESOLUÇÃO/CANCELAMENTO DINÂMICA */}
                    {tk.resolucao_ti && (
                      <div className={`mt-3 p-3 border rounded-lg text-sm shadow-sm ${
                        tk.status_chamado === 'Cancelado' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-green-50 border-green-200 text-green-800'
                      }`}>
                        <strong className="block mb-1 font-bold">
                          {tk.status_chamado === 'Cancelado' ? 'Motivo do Cancelamento:' : 'Resolução da TI:'}
                        </strong>
                        <span className="break-words leading-relaxed">{tk.resolucao_ti}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center align-middle">
                    <select 
                      value={tk.tecnico_id || ""}
                      onChange={(e) => handleAssignTechnician(tk.id, e.target.value)}
                      /* ATUALIZADO: Tranca o select também se estiver Cancelado */
                      disabled={tk.status_chamado === 'Concluído' || tk.status_chamado === 'Baixa' || tk.status_chamado === 'Cancelado'}
                      className={`text-xs font-bold border rounded-lg px-2 py-2 outline-none transition cursor-pointer w-full text-center ${
                        tk.tecnico_id 
                          ? 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-2 focus:ring-blue-500' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-2 focus:ring-emerald-500' 
                      } ${
                        (tk.status_chamado === 'Concluído' || tk.status_chamado === 'Baixa' || tk.status_chamado === 'Cancelado') && 'opacity-60 cursor-not-allowed bg-slate-100 text-slate-500 border-slate-200'
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
                      value={tk.status_chamado}
                      disabled={tk.status_chamado !== 'Aberto'}
                      onChange={(e) => onUpdateStatus(tk.id, tk.status_chamado, e.target.value)}
                      className={`px-3 py-2 rounded-full text-xs font-bold border focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer text-center w-full ${
                        tk.status_chamado === 'Aberto' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                        tk.status_chamado === 'Concluído' ? 'bg-green-100 text-green-700 border-green-200 appearance-none pointer-events-none' : 
                        tk.status_chamado === 'Baixa' ? 'bg-red-100 text-red-700 border-red-200 appearance-none pointer-events-none' : 
                        tk.status_chamado === 'Cancelado' ? 'bg-slate-200 text-slate-600 border-slate-300 appearance-none pointer-events-none' : 
                        'bg-slate-200 text-slate-700 border-slate-300 appearance-none pointer-events-none'
                      }`}
                    >
                      <option value="Aberto" className="text-amber-700 font-bold bg-white">Aberto</option>
                      <option value="Concluído" className="text-green-700 font-bold bg-white">Concluído</option>
                      <option value="Baixa" className="text-red-700 font-bold bg-white">Baixa</option>
                      <option value="Cancelado" className="text-slate-700 font-bold bg-white">Cancelado</option>
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