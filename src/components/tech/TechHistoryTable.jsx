import React, { useState } from 'react';
import { History, ChevronLeft, ChevronRight, Wrench } from 'lucide-react';

export default function TechHistoryTable({ historicoRecente, equipments }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🌟 BLINDAGEM 1: Garante que historicoRecente seja sempre um array, mesmo se vier undefined da API
  const chamadosSeguros = historicoRecente || [];
  const equipamentosSeguros = equipments || [];

  const totalItems = chamadosSeguros.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = chamadosSeguros.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200 delay-200">
      <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-3">
        <div className="bg-slate-600 p-2 rounded-lg"><History className="w-5 h-5 text-white" /></div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Meu Histórico Recente</h2>
          <p className="text-sm text-slate-500">Últimos chamados que você enviou para confirmação, finalizou ou deu baixa.</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center">Nº Processo</th>
              <th className="py-3 px-4">Datas</th>
              <th className="py-3 px-4">Solicitante</th>
              <th className="py-3 px-4">Equipamento</th>
              <th className="py-3 px-4 w-[400px] max-w-[400px]">Problema & Resolução</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTickets.length === 0 ? (
              <tr><td colSpan="6" className="py-8 text-center text-slate-400 italic text-sm">Nenhum chamado finalizado recentemente.</td></tr>
            ) : (
              currentTickets.map((tk) => {
                // 🌟 BLINDAGEM 2: Busca no array seguro
                const eq = equipamentosSeguros.find(e => e.id === tk?.equipment_id);
                const dataFechamento = tk?.finished_at || tk?.updatedAt || null;
                const dataAbertura = tk?.createdAt || tk?.data_abertura;
                
                // 🌟 BLINDAGEM 3: Converte garantidamente para string para o .replace() não dar tela branca
                let resolucaoFormatada = (tk?.resolucao_ti || '').toString();
                resolucaoFormatada = resolucaoFormatada.replace(/\[(?:CONFIRMADO PELO USUÁRIO|CONFIRMAÇÃO DO USUÁRIO)\]:\s*(.+)/gi, 'Confirmação do Usuário: "$1"');
                resolucaoFormatada = resolucaoFormatada.replace(/\[RECUSADO PELO USUÁRIO\]:\s*(.+)/gi, 'Recusa do Usuário: "$1"');
                resolucaoFormatada = resolucaoFormatada.replace(/\[CANCELADO PELO USUÁRIO\]:\s*(.+)/gi, 'Cancelado pelo Usuário: "$1"');
                resolucaoFormatada = resolucaoFormatada.replace(/\[SISTEMA\]:\s*(.+)/gi, 'Sistema: "$1"');

                return (
                  <tr key={tk?.id} className="hover:bg-slate-50 transition align-top">
                    
                    <td className="py-4 px-4 pt-5 align-top text-center">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded border ${tk?.codigo_processo ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200 font-medium'}`}>
                        {tk?.codigo_processo || 'Antigo / N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-4 pt-5 text-sm font-medium text-slate-500">
                      <div className="flex flex-col gap-1 leading-tight whitespace-nowrap">
                        <span>Abertura: {dataAbertura ? new Date(dataAbertura).toLocaleString('pt-BR') : 'Sem data'}</span>
                        <span>Fechamento: {dataFechamento ? new Date(dataFechamento).toLocaleString('pt-BR') : 'Sem data'}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4 pt-5">
                      <span className="text-sm font-semibold text-slate-800 block leading-tight">{tk?.user?.nome || 'Removido'}</span>
                      {tk?.user?.ramal && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">
                          Ramal: {tk.user.ramal}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 pt-5">
                      <div className="flex items-center gap-1.5 whitespace-nowrap mb-0.5">
                        <span className="text-sm font-bold text-slate-700">{eq?.patrimonio || 'S/P'}</span>
                        {eq?.tipo && (
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {eq.tipo}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 pt-5 text-sm leading-relaxed text-slate-500 w-[400px] max-w-[400px] whitespace-normal">
                      <p className="text-slate-600 break-words">{tk?.descricao_problema || 'Problema não informado.'}</p>
                      
                      {/* 🌟 A MÁGICA AQUI: O max-w-[400px] trava a largura para ficar idêntica à do Admin */}
                      <div className="mt-3 p-3 border border-slate-200 border-l-4 border-l-emerald-500 rounded-r-lg bg-slate-50 shadow-xs max-w-[400px]">
                        <strong className="flex items-center gap-1.5 mb-1 font-bold text-xs uppercase tracking-wider text-emerald-700">
                          <Wrench className="w-3.5 h-3.5" /> Resolução Aplicada:
                        </strong>
                        
                        {/* 🌟 Adicionado o leading-relaxed para a altura da linha ficar suave */}
                        <p className="font-medium text-slate-700 leading-relaxed bg-white/80 p-2 rounded border border-slate-100 mt-1 break-words whitespace-pre-wrap">
                          {resolucaoFormatada || 'Nenhuma resolução descrita.'}
                        </p>
                        
                        {tk?.status_chamado === 'Aguardando Confirmação' && tk?.finalizador?.nome && (
                          <span className="mt-2 block not-italic text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded px-2 py-1.5 leading-snug">
                            Aguardando confirmação do usuário. Atendimento enviado por {tk.finalizador.nome}.
                          </span>
                        )}
                        {tk?.status_chamado === 'Concluído' && tk?.confirmador?.nome && (
                          <span className="mt-2 block not-italic text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1.5 leading-snug">
                            Confirmado pelo usuário: {tk.confirmador.nome}.
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-4 pt-5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded border text-xs font-bold ${
                        tk?.status_chamado === 'Concluído' ? 'bg-green-50 text-green-700 border-green-200' : 
                        tk?.status_chamado === 'Aguardando Confirmação' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {tk?.status_chamado === 'Aguardando Confirmação' ? 'Aguardando usuário' : tk?.status_chamado}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
          <div>
            Exibindo <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> a <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, totalItems)}</span> de <span className="font-semibold text-slate-700">{totalItems}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-50 transition cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700 px-2">Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-50 transition cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}