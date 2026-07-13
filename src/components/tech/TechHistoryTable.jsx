import React from 'react';
import { History } from 'lucide-react';

export default function TechHistoryTable({ historicoRecente, equipments }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200 delay-200">
      <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-3">
        <div className="bg-slate-600 p-2 rounded-lg"><History className="w-5 h-5 text-white" /></div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Meu Histórico Recente</h2>
          <p className="text-sm text-slate-500">Últimos 5 chamados que você enviou para confirmação, finalizou ou deu baixa.</p>
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
                const dataFechamento = tk.updatedAt || tk.createdAt || tk.data_abertura;
                const dataAbertura = tk.createdAt || tk.data_abertura;
                const [resolucaoAplicada, confirmacaoUsuario] = (tk.resolucao_ti || '')
                  .split(/\n\s*\n\[(?:CONFIRMADO PELO USUÁRIO|CONFIRMAÇÃO DO USUÁRIO)\]:\s*/i);

                return (
                  <tr key={tk.id} className="hover:bg-slate-50 transition opacity-80">
                    <td className="py-4 px-4 text-sm font-medium text-slate-500">
                      <div className="flex flex-col gap-1 leading-tight">
                        <span>Abertura: {dataAbertura ? new Date(dataAbertura).toLocaleString('pt-BR') : 'Sem data'}</span>
                        <span>Fechamento: {dataFechamento ? new Date(dataFechamento).toLocaleString('pt-BR') : 'Sem data'}</span>
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
                    </td>

                    <td className="py-4 px-4 text-sm leading-relaxed text-slate-500 break-all whitespace-pre-wrap">
                      <p className="text-slate-600">{tk.descricao_problema || 'Problema não informado.'}</p>
                      <div className="mt-3 border border-slate-200 border-l-4 border-l-emerald-500 rounded-r-lg bg-slate-50 p-3">
                        <strong className="flex items-center gap-1.5 mb-1 font-bold text-xs uppercase tracking-wider text-emerald-700">
                          Resolução Aplicada:
                        </strong>
                        <p className="font-medium text-slate-700 bg-white/80 p-2 rounded border border-slate-100 whitespace-pre-wrap">
                          {resolucaoAplicada || 'Nenhuma resolução descrita.'}
                        </p>
                      {confirmacaoUsuario && (
                        <p className="mt-2 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5 whitespace-normal">
                          [CONFIRMAÇÃO DO USUÁRIO]: {confirmacaoUsuario}
                        </p>
                      )}
                      {tk.status_chamado === 'Aguardando Confirmação' && tk.finalizador?.nome && (
                        <span className="mt-2 block not-italic text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded px-2 py-1.5">
                          Aguardando confirmação do usuário. Atendimento enviado por {tk.finalizador.nome}.
                        </span>
                      )}
                      {tk.confirmador?.nome && (
                        <span className="mt-2 block not-italic text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5">
                          Confirmado pelo usuário: {tk.confirmador.nome}.
                        </span>
                      )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                        tk.status_chamado === 'Concluído' ? 'bg-green-100 text-green-700 border-green-200' : 
                        tk.status_chamado === 'Aguardando Confirmação' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {tk.status_chamado === 'Aguardando Confirmação' 
                          ? 'Aguardando usuário' 
                          : tk.status_chamado}
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
