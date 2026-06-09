import React from 'react';
import { Inbox } from 'lucide-react';

export default function TechQueueTable({ chamadosLivres, equipments, onAssumirChamado }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200 delay-100">
      <div className="bg-amber-50/30 px-6 py-4 border-b flex items-center gap-3">
        <div className="bg-amber-500 p-2 rounded-lg"><Inbox className="w-5 h-5 text-white" /></div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Fila de Espera Geral</h2>
          <p className="text-sm text-slate-500">Chamados novos que ainda não foram atribuídos a nenhum técnico.</p>
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
              <th className="py-3 px-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {chamadosLivres.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center text-slate-400 italic text-sm">Nenhum chamado pendente na fila geral.</td></tr>
            ) : (
              chamadosLivres.map((tk) => {
                const eq = equipments.find(e => e.id === tk.equipment_id);
                const dataDoChamado = tk.createdAt || tk.data_abertura;

                return (
                  <tr key={tk.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 text-sm font-medium text-slate-500">
                      {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
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
                    <td className="py-4 px-4 text-center">
                      {/* 🌟 BOTÃO ATUALIZADO COM BORDA ELEGANTE */}
                      <button 
                        onClick={() => onAssumirChamado(tk.id)} 
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 hover:border-amber-400 font-bold px-4 py-2.5 rounded-lg text-sm transition cursor-pointer shadow-sm"
                      >
                        Assumir Chamado
                      </button>
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