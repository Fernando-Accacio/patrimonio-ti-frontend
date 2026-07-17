import React, { useState, useEffect, useRef } from 'react';
import { Inbox, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function TechQueueTable({ chamadosLivres, equipments }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCode, setSearchCode] = useState(''); // 🌟 ESTADO DA PESQUISA
  const itemsPerPage = 10;
  
  const [expandedTickets, setExpandedTickets] = useState({});

  const topScrollRef = useRef(null);
  const tableScrollRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(1000);

  useEffect(() => { setCurrentPage(1); }, [searchCode]);

  // 🌟 LÓGICA DE FILTRAGEM
  const filteredTickets = chamadosLivres.filter(tk => {
    if (!searchCode) return true;
    const termoBusca = searchCode.toLowerCase();
    const matchProcesso = tk.codigo_processo?.toLowerCase().includes(termoBusca);
    const eq = equipments.find(e => e.id === tk.equipment_id);
    const matchPatrimonio = eq?.patrimonio?.toLowerCase().includes(termoBusca);
    return matchProcesso || matchPatrimonio;
  });

  const totalItems = filteredTickets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (tableScrollRef.current) {
      setTableWidth(tableScrollRef.current.scrollWidth);
    }
  }, [currentTickets, expandedTickets]);

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

  const toggleExpandirChamado = (id) => {
    setExpandedTickets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200 delay-100 flex flex-col">
      {/* 🌟 CABEÇALHO COM A BARRA DE PESQUISA */}
      <div className="bg-amber-50/30 px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg"><Inbox className="w-5 h-5 text-white" /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Fila de Espera Geral</h2>
            <p className="text-sm text-slate-500">Chamados novos que ainda não foram atribuídos a nenhum técnico.</p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            placeholder="Buscar Processo ou Patrimônio..." 
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>
      
      <div 
        ref={topScrollRef} 
        onScroll={handleTopScroll}
        className="overflow-x-auto overflow-y-hidden h-3 w-full mb-2 mt-2 custom-scrollbar"
      >
        <div style={{ width: `${tableWidth}px`, height: '1px' }}></div>
      </div>

      <div 
        ref={tableScrollRef}
        onScroll={handleTableScroll}
        className="overflow-x-auto custom-scrollbar min-h-[320px] pb-24"
      >
        <table className="w-full text-left text-slate-600 min-w-[1000px]">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-sm uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center whitespace-nowrap">Nº Processo</th>
              <th className="py-3 px-4 whitespace-nowrap">Abertura</th>
              <th className="py-3 px-4 whitespace-nowrap">Solicitante</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Equipamento</th>
              <th className="py-3 px-4 text-center whitespace-nowrap">Setor</th>
              <th className="py-3 px-4 min-w-[300px]">Problema</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTickets.length === 0 ? (
              <tr><td colSpan="6" className="py-8 text-center text-slate-400 italic text-sm">Nenhum chamado encontrado na fila geral.</td></tr>
            ) : (
              currentTickets.map((tk) => {
                const eq = equipments.find(e => e.id === tk.equipment_id);
                const dataDoChamado = tk.createdAt || tk.data_abertura;

                return (
                  <tr key={tk.id} className="hover:bg-slate-50 transition align-top">
                    <td className="py-4 px-4 pt-5 align-top text-center">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded border ${tk.codigo_processo ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-400 border-slate-200 font-medium'}`}>
                        {tk.codigo_processo || 'Antigo / N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-4 pt-5 text-sm font-medium text-slate-500 whitespace-nowrap">
                      {dataDoChamado ? new Date(dataDoChamado).toLocaleString('pt-BR') : 'Sem data'}
                    </td>
                    
                    <td className="py-4 px-4 pt-5">
                      <span className="text-sm font-semibold text-slate-800 block leading-tight">{tk.user?.nome || 'Removido'}</span>
                      {tk.user?.ramal && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 inline-block mt-1">
                          Ramal: {tk.user.ramal}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 pt-5 text-center">
                      <div className="flex flex-col items-center justify-center gap-1 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-800">{eq?.patrimonio || 'S/P'}</span>
                        {tk.equipment?.equipmentType?.nome ? (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shadow-sm">
                            {tk.equipment.equipmentType.nome}
                          </span>
                        ) : eq?.tipo ? (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded shadow-sm">
                            {eq.tipo}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                            Não identificado
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 pt-5 text-center">
                      {tk.equipment?.sector ? (
                        <div className="flex flex-col items-center justify-center gap-0.5 whitespace-nowrap">
                          <span className="text-xs font-bold text-slate-700">{tk.equipment.sector.nome}</span>
                          {tk.equipment.sector.prefixo && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {tk.equipment.sector.prefixo}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Não informado</span>
                      )}
                    </td>

                    <td className="py-4 px-4 pt-5 min-w-[300px] max-w-[400px]">
                      <div className="text-slate-600 break-words whitespace-pre-wrap text-sm leading-relaxed">
                        {expandedTickets[tk.id] ? tk.descricao_problema : tk.descricao_problema?.length > 50 ? `${tk.descricao_problema.substring(0, 50)}...` : tk.descricao_problema}
                      </div>
                      {tk.descricao_problema?.length > 50 && (
                        <button onClick={() => toggleExpandirChamado(tk.id)} className="text-xs mt-1 text-blue-600 hover:underline font-bold block cursor-pointer">
                          {expandedTickets[tk.id] ? 'Ocultar Detalhes' : 'Ler Relato Completo'}
                        </button>
                      )}
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