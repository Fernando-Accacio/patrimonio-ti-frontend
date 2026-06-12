import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import EquipmentTableRow from './EquipmentTableRow';

export default function EquipmentTable({ equipments, onNewClick, onDeleteClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Filtra pela busca e garante a ordenação decrescente
  const filteredEquipments = equipments
    .sort((a, b) => b.id - a.id)
    .filter(eq => eq.patrimonio.toLowerCase().includes(searchTerm.toLowerCase()));

  // 2. Se o usuário estiver buscando algo, mostra os resultados.
  //    Se não estiver buscando, exibe RIGOROSAMENTE apenas os 5 últimos.
  const displayedEquipments = searchTerm 
    ? filteredEquipments 
    : filteredEquipments.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 border-b pb-4">
        
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Equipamentos Cadastrados Recentemente
        </h2>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por patrimônio..."
              className="pl-10 pr-3 py-1.5 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            onClick={onNewClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Novo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b sticky top-0">
            <tr>
              <th className="py-3 px-4">Patrimônio</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Origem do Cadastro</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Local / Observação</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayedEquipments.length > 0 ? (
              displayedEquipments.map((eq) => (
                <EquipmentTableRow 
                  key={eq.id} 
                  eq={eq} 
                  onDeleteClick={onDeleteClick} 
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                  Nenhum equipamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}