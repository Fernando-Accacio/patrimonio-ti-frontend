import React from 'react';
import { Wrench, Check, Trash2 } from 'lucide-react';

export default function TechMyTicketsTable({ meusChamados, equipments, usersList, onAtualizarStatus }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-blue-50/50 px-6 py-4 border-b flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg"><Wrench className="w-5 h-5 text-white" /></div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Meus Chamados em Andamento</h2>
          <p className="text-sm text-slate-500">Tarefas que estão sob sua responsabilidade neste momento.</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Abertura</th>
              <th className="py-3 px-4">Solicitante</th>
              <th className="py-3 px-4">Equipamento</th>
              <th className="py-3 px-4 w-1/3">Problema</th>
              <th className="py-3 px-4 text-center">Ações de Resolução</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {meusChamados.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center text-slate-400 italic text-sm">Você não possui chamados em andamento. Bom trabalho!</td></tr>
            ) : (
              meusChamados.map((tk) => {
                const eq = equipments.find(e => e.id === tk.equipment_id);
                const solicitante = usersList.find(u => u.id === tk.user_id);
                const dataDoChamado = tk.createdAt || tk.data_abertura; 

                return (
                  <tr key={tk.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 text-sm font-medium text-slate-500">
                      {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-slate-800">{solicitante?.nome || 'Removido'}</td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-blue-600 block">{eq?.patrimonio}</span>
                      <span className="text-xs text-slate-500 block mt-0.5">{eq?.observacao}</span>
                    </td>
                    <td className="py-4 px-4 text-sm leading-relaxed">{tk.descricao_problema}</td>
                    
                    <td className="py-4 px-4 text-center align-middle">
                      <div className="flex flex-col gap-2">
                        <button onClick={() => onAtualizarStatus(tk.id, 'Concluído')} className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-bold px-3 py-2 rounded-lg text-sm transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4" /> Finalizar
                        </button>
                        <button onClick={() => onAtualizarStatus(tk.id, 'Baixa')} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-3 py-2 rounded-lg text-sm transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5">
                          <Trash2 className="w-4 h-4" /> Dar Baixa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}