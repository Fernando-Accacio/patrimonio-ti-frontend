import React from 'react';
import { History } from 'lucide-react';

export default function TechHistoryTable({ historicoRecente, equipments, usersList }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200 delay-200">
      <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-3">
        <div className="bg-slate-600 p-2 rounded-lg"><History className="w-5 h-5 text-white" /></div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Meu Histórico Recente</h2>
          <p className="text-sm text-slate-500">Últimos 5 chamados que você finalizou ou deu baixa.</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Data Finalização</th>
              <th className="py-3 px-4">Solicitante</th>
              <th className="py-3 px-4">Equipamento</th>
              <th className="py-3 px-4 w-1/3">Resolução Aplicada</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {historicoRecente.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center text-slate-400 italic text-sm">Nenhum chamado finalizado recentemente.</td></tr>
            ) : (
              historicoRecente.map((tk) => {
                const eq = equipments.find(e => e.id === tk.equipment_id);
                const solicitante = usersList.find(u => u.id === tk.user_id);
                // Usa a data de atualização como a data em que o chamado foi fechado
                const dataFechamento = tk.updatedAt || tk.createdAt || tk.data_abertura;

                return (
                  <tr key={tk.id} className="hover:bg-slate-50 transition opacity-80">
                    <td className="py-4 px-4 text-sm font-medium text-slate-500">
                      {dataFechamento ? new Date(dataFechamento).toLocaleString('pt-BR') : 'Sem data'}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-slate-800">{solicitante?.nome || 'Removido'}</td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-slate-600 block">{eq?.patrimonio}</span>
                    </td>
                    <td className="py-4 px-4 text-sm leading-relaxed italic text-slate-500">
                      "{tk.resolucao_ti || 'Nenhuma resolução descrita.'}"
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                        tk.status_chamado === 'Concluído' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {tk.status_chamado}
                      </span>
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