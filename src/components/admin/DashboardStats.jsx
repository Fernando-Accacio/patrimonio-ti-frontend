import React from 'react';
import { Monitor, Ticket, CheckCircle } from 'lucide-react';

export default function DashboardStats({ equipments, tickets, currentFilter, setFilter }) {
  const chamadosPendentes = tickets.filter(t => t.status_chamado === 'Aberto' || t.status_chamado === 'Em Andamento').length;
  
  // 🌟 FIX: Agora a matemática conta tanto os Concluídos quanto as Baixas!
  const chamadosResolvidos = tickets.filter(t => t.status_chamado === 'Concluído' || t.status_chamado === 'Baixa').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* CARD 1: TODOS */}
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

      {/* CARD 2: PENDENTES */}
      <div 
        onClick={() => setFilter('Pendentes')}
        className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 cursor-pointer transition transform hover:scale-[1.01] ${
          currentFilter === 'Pendentes' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200'
        }`}
      >
        <div className="bg-amber-100 p-3 rounded-lg text-amber-600"><Ticket className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Chamados Pendentes</p>
          <p className="text-2xl font-bold text-slate-800">{chamadosPendentes}</p>
        </div>
      </div>

      {/* CARD 3: RESOLVIDOS */}
      <div 
        // 🌟 FIX: Alterado de 'Concluído' para 'Resolvidos'
        onClick={() => setFilter('Resolvidos')}
        className={`bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4 cursor-pointer transition transform hover:scale-[1.01] ${
          currentFilter === 'Resolvidos' ? 'border-green-600 ring-2 ring-green-100' : 'border-slate-200'
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