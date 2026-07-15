import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ResetRequestsTable({ requests, onApprove, onReject }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const safeRequests = requests || [];
  const totalItems = safeRequests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = safeRequests.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200 mb-8">
      <div className="bg-slate-50 px-6 py-4 border-b">
        <h2 className="text-base font-bold text-slate-800">Solicitações Pendentes de Análise</h2>
        <p className="text-xs text-slate-500">Pedidos aguardando liberação de acesso por parte da gerência de TI.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-xs uppercase">
            <tr>
              <th className="py-3 px-6">Servidor</th>
              <th className="py-3 px-6">E-mail (Ofuscado)</th>
              <th className="py-3 px-6">Data do Pedido</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRequests.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-slate-400 italic text-xs">
                  Nenhuma solicitação pendente no momento.
                </td>
              </tr>
            ) : (
              currentRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6 font-semibold text-slate-800">{req.nome}</td>
                  <td className="py-4 px-6 font-mono text-slate-600 text-xs">{req.email}</td>
                  <td className="py-4 px-6 text-slate-500 text-xs">{new Date(req.dataSolicitacao).toLocaleString('pt-BR')}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onApprove(req.id)} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shadow-sm">Aprovar</button>
                      <button onClick={() => onReject(req.id)} className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer">Recusar</button>
                    </div>
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