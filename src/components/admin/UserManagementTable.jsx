import React from 'react';
import { UserPlus } from 'lucide-react';
import UserManagementTableRow from './UserManagementTableRow'; // <-- IMPORTANDO A LINHA

export default function UserManagementTable({ users, currentUser, onUpdateRole, onDelete, onAddClick }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200">
      
      <div className="bg-slate-50 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Controle de Acesso</h2>
          <p className="text-sm text-slate-500">Gerencie os níveis de permissão dos servidores do sistema.</p>
        </div>
        <button
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Novo Funcionário
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-6">Servidor</th>
              <th className="py-3 px-6">E-mail Institucional</th>
              <th className="py-3 px-6">Nível de Acesso</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <UserManagementTableRow 
                key={u.id} 
                u={u} 
                currentUser={currentUser} 
                onUpdateRole={onUpdateRole} 
                onDelete={onDelete} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}