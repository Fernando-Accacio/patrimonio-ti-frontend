import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import EquipmentTableRow from './EquipmentTableRow'; // <-- IMPORTANDO A LINHA AQUI!

export default function EquipmentTable({ equipments, onNewClick, onDeleteClick }) {
  const [showAllEquipments, setShowAllEquipments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEquipments = equipments
    .sort((a, b) => b.id - a.id)
    .filter(eq => eq.patrimonio.toLowerCase().includes(searchTerm.toLowerCase()));

  const displayedEquipments = (showAllEquipments || searchTerm) 
    ? filteredEquipments 
    : filteredEquipments.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 border-b pb-4">
        
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Equipamentos Cadastrados Recentemente
          
          {!searchTerm && filteredEquipments.length > 5 && (
            <button 
              onClick={() => setShowAllEquipments(!showAllEquipments)}
              className="text-xs font-normal text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-0.5 rounded transition ml-2 cursor-pointer"
            >
              {showAllEquipments ? 'Ver apenas recentes (5)' : 'Exibir todos'}
            </button>
          )}
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
            {displayedEquipments.map((eq) => (
              <EquipmentTableRow 
                key={eq.id} 
                eq={eq} 
                onDeleteClick={onDeleteClick} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}