import React from 'react';
import { Monitor, Ticket, CheckCircle } from 'lucide-react';

export default function DashboardStats({ equipments, tickets, currentFilter, setFilter }) {
  const chamadosAbertos = tickets.filter(t => t.status_chamado === 'Aberto').length;
  const chamadosResolvidos = tickets.filter(t => t.status_chamado === 'Concluído').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div 
        onClick={() => setFilter('Todos')}
        className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 cursor-pointer transition transform hover:scale-[1.01] ${
          currentFilter === 'Todos' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
        }`}
      >
        <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Monitor className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Total de Equipamentos</p>
          <p className="text-2xl font-bold text-slate-800">{equipments.length}</p>
        </div>
      </div>

      <div 
        onClick={() => setFilter('Aberto')}
        className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 cursor-pointer transition transform hover:scale-[1.01] ${
          currentFilter === 'Aberto' ? 'border-red-600 ring-2 ring-red-100' : 'border-slate-200'
        }`}
      >
        <div className="bg-red-100 p-3 rounded-lg text-red-600"><Ticket className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Chamados Abertos</p>
          <p className="text-2xl font-bold text-slate-800">{chamadosAbertos}</p>
        </div>
      </div>

      <div 
        onClick={() => setFilter('Concluído')}
        className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 cursor-pointer transition transform hover:scale-[1.01] ${
          currentFilter === 'Concluído' ? 'border-green-600 ring-2 ring-green-100' : 'border-slate-200'
        }`}
      >
        <div className="bg-green-100 p-3 rounded-lg text-green-600"><CheckCircle className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Chamados Resolvidos</p>
          <p className="text-2xl font-bold text-slate-800">{chamadosResolvidos}</p>
        </div>
      </div>
    </div>
  );
}