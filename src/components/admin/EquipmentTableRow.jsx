import React from 'react';
import { Trash2 } from 'lucide-react';

export default function EquipmentTableRow({ eq, onDeleteClick }) {
  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="py-3 px-4 font-semibold text-slate-800">{eq.patrimonio}</td>
      <td className="py-3 px-4">{eq.tipo}</td>
      
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          eq.criado_por === 'Admin (Manual)' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {eq.criado_por || 'Usuário (Via Chamado)'}
        </span>
      </td>

      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          eq.status === 'Disponível' ? 'bg-green-100 text-green-700' : 
          (eq.status === 'Em Manutenção' || eq.status === 'Aberto') ? 'bg-blue-100 text-blue-700' : 
          'bg-slate-200 text-slate-700'
        }`}>
          {eq.status === 'Em Manutenção' ? 'Aberto' : eq.status}
        </span>
      </td>
      <td className="py-3 px-4 truncate max-w-xs">{eq.observacao}</td>
      
      {/* BOTÃO DE EXCLUIR EQUIPAMENTO COM SOFT-DELETE */}
      <td className="py-3 px-4 text-center">
        <button
          onClick={() => onDeleteClick(eq.id, eq.patrimonio)}
          className="text-red-600 hover:text-red-800 p-1 rounded transition cursor-pointer"
          title="Excluir Equipamento"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}