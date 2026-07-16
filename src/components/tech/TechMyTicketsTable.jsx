import React, { useState, useEffect, useRef } from 'react';
import { Wrench, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TechMyTicketsTable({ meusChamados, equipments }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🌟 REFS E ESTADOS DA BARRA DE ROLAGEM DUPLA
  const topScrollRef = useRef(null);
  const tableScrollRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(1000);

  const totalItems = meusChamados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = meusChamados.slice(indexOfFirstItem, indexOfLastItem);

  // 🌟 SINCRONIZAÇÃO DAS BARRAS
  useEffect(() => {
    if (tableScrollRef.current) {
      setTableWidth(tableScrollRef.current.scrollWidth);
    }
  }, [currentTickets]);

  const handleTopScroll = () => {
    if (tableScrollRef.current && topScrollRef.current) {
      if (tableScrollRef.current.scrollLeft !== topScrollRef.current.scrollLeft) {
        tableScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
      }
    }
  };

  const handleTableScroll = () => {
    if (topScrollRef.current && tableScrollRef.current) {
      if (topScrollRef.current.scrollLeft !== tableScrollRef.current.scrollLeft) {
        topScrollRef.current.scrollLeft = tableScrollRef.current.scrollLeft;
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200 flex flex-col">
      <div className="bg-blue-50/50 px-6 py-4 border-b flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg"><Wrench className="w-5 h-5 text-white" /></div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Meus Chamados em Andamento</h2>
          <p className="text-sm text-slate-500">Tarefas que estão sob sua responsabilidade neste momento.</p>
        </div>
      </div>
      
      {/* 🌟 BARRA DE ROLAGEM SUPERIOR */}
      <div 
        ref={topScrollRef} 
        onScroll={handleTopScroll}
        className="overflow-x-auto overflow-y-hidden h-3 w-full mb-2 mt-2 custom-scrollbar"
      >
        <div style={{ width: `${tableWidth}px`, height: '1px' }}></div>
      </div>

      {/* 🌟 TABELA */}
      <div 
        ref={tableScrollRef}
        onScroll={handleTableScroll}
        className="overflow-x-auto custom-scrollbar pb-2"
      >
        <table className="w-full text-left text-slate-600 min-w-[1000px]">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center whitespace-nowrap">Nº Processo</th>
              <th className="py-3 px-4 whitespace-nowrap">Datas</th>
              <th className="py-3 px-4 whitespace-nowrap">Solicitante</th>
              <th className="py-3 px-4 whitespace-nowrap">Equipamento</th>
              <th className="py-3 px-4 w-1/3">Problema</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTickets.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center text-slate-400 italic text-sm">Você não possui chamados em andamento. Bom trabalho!</td></tr>
            ) : (
              currentTickets.map((tk) => {
                const eq = equipments.find(e => e.id === tk.equipment_id);
                const dataDoChamado = tk.createdAt || tk.data_abertura; 
                const dataFechamento = tk.finished_at || tk.updatedAt || null;

                return (
                  <tr key={tk.id} className="hover:bg-slate-50 transition align-top">
                    <td className="py-4 px-4 pt-5 align-top text-center">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded border ${tk.codigo_processo ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200 font-medium'}`}>
                        {tk.codigo_processo || 'Antigo / N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-4 pt-5 text-sm font-medium text-slate-500">
                      <div className="flex flex-col gap-1 leading-tight whitespace-nowrap">
                        <span>Abertura: {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}</span>
                        <span>Fechamento: {dataFechamento ? new Date(dataFechamento).toLocaleString('pt-BR') : (tk.status_chamado === 'Aguardando Confirmação' ? 'Aguardando usuário' : 'Em aberto')}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4 pt-5">
                      <span className="text-sm font-semibold text-slate-800 block leading-tight">{tk.user?.nome || 'Removido'}</span>
                      {tk.user?.ramal && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">
                          Ramal: {tk.user.ramal}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 pt-5">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-700">{eq?.patrimonio || 'S/P'}</span>
                        {eq?.tipo && (
                          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {eq.tipo}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 block mt-1 leading-tight">{eq?.observacao}</span>
                    </td>

                    <td className="py-4 px-4 pt-5 text-sm leading-relaxed break-words">{tk.descricao_problema}</td>
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