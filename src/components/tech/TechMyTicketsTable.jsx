import React from 'react';
import { Wrench } from 'lucide-react';

export default function TechMyTicketsTable({ meusChamados, equipments }) {
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {meusChamados.length === 0 ? (
              <tr><td colSpan="4" className="py-8 text-center text-slate-400 italic text-sm">Você não possui chamados em andamento. Bom trabalho!</td></tr>
            ) : (
              meusChamados.map((tk) => {
                const eq = equipments.find(e => e.id === tk.equipment_id);
                const dataDoChamado = tk.createdAt || tk.data_abertura; 
                const dataFechamento = tk.finished_at || tk.updatedAt || null;

                return (
                  <tr key={tk.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 text-sm font-medium text-slate-500">
                      <div className="flex flex-col gap-1 leading-tight">
                        <span>Abertura: {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}</span>
                        <span>Fechamento: {dataFechamento ? new Date(dataFechamento).toLocaleString('pt-BR') : (tk.status_chamado === 'Aguardando Confirmação' ? 'Aguardando confirmação' : 'Em aberto')}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-slate-800 block">{tk.user?.nome || 'Removido'}</span>
                      {tk.user?.ramal && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                          Ramal: {tk.user.ramal}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-700">{eq?.patrimonio || 'S/P'}</span>
                        {eq?.tipo && (
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {eq.tipo}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">{eq?.observacao}</span>
                    </td>

                    <td className="py-4 px-4 text-sm leading-relaxed">{tk.descricao_problema}</td>
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
