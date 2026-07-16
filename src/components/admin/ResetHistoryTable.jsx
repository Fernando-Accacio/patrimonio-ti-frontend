import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function ResetHistoryTable({ history }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState(''); // 🌟 NOVO: Estado da busca
  const itemsPerPage = 10;

  const safeHistory = history || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName]);

  // 🌟 APLICAÇÃO DO FILTRO DE BUSCA POR NOME
  const filteredHistory = safeHistory.filter(hist => {
    if (!searchName.trim()) return true;
    return hist.nome?.toLowerCase().includes(searchName.toLowerCase());
  });

  const totalItems = filteredHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistory = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200">
      
      <div className="bg-slate-50 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Histórico de Ações</h2>
          <p className="text-xs text-slate-500">Registro de auditoria global com todas as redefinições de acesso processadas pelo TI.</p>
        </div>
        
        {/* 🌟 BARRA DE BUSCA */}
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Buscar por nome do servidor..."
            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-xs uppercase">
            <tr>
              <th className="py-3 px-6">Servidor</th>
              <th className="py-3 px-6">E-mail (Ofuscado)</th>
              <th className="py-3 px-6">Processado em</th>
              <th className="py-3 px-6 text-center">Resultado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentHistory.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-slate-400 italic text-xs">
                  {searchName ? 'Nenhum histórico encontrado com esse nome.' : 'Nenhum histórico de redefinição registrado no sistema.'}
                </td>
              </tr>
            ) : (
              currentHistory.map((hist) => (
                <tr key={hist.id} className="bg-slate-50/40 text-slate-500 transition hover:bg-slate-50">
                  <td className="py-3 px-6 font-medium text-slate-700">{hist.nome}</td>
                  <td className="py-3 px-6 font-mono text-xs">{hist.email}</td>
                  <td className="py-3 px-6 text-xs">{new Date(hist.dataProcessamento).toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                      hist.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {hist.status}
                    </span>
                  </td>
                </tr>
              ))
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