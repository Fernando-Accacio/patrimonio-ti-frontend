import React from 'react';

export default function ResetHistoryTable({ history }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-slate-50 px-6 py-4 border-b">
        <h2 className="text-base font-bold text-slate-800">Histórico de Ações Recentes (Últimos 5)</h2>
        <p className="text-xs text-slate-500">Registro de auditoria local das últimas redefinições gerenciadas nesta sessão.</p>
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
            {history.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-slate-400 italic text-xs">
                  Nenhum histórico registrado nesta sessão.
                </td>
              </tr>
            ) : (
              history.map((hist) => (
                <tr key={hist.id} className="bg-slate-50/40 text-slate-500">
                  <td className="py-3 px-6 font-medium text-slate-700">{hist.nome}</td>
                  <td className="py-3 px-6 font-mono text-xs">{hist.email}</td>
                  <td className="py-3 px-6 text-xs">{new Date(hist.dataProcessamento).toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
    </div>
  );
}