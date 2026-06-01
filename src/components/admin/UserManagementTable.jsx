import React from 'react';
import { Trash2, Key } from 'lucide-react';

export default function UserManagementTable({ users, currentUser, onUpdateRole, onDelete, onResetPasswordClick }) {
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Controle de Acesso dos Servidores</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-medium border-b">
            <tr>
              <th className="py-3 px-4">Nome Funcionário</th>
              <th className="py-3 px-4">E-mail Institucional</th>
              <th className="py-3 px-4">Nível de Acesso (Role)</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((us) => (
              <tr key={us.id} className="border-b hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-800">{us.nome}</td>
                <td className="py-3 px-4">{us.email}</td>
                <td className="py-3 px-4">
                  <select 
                    value={us.role}
                    disabled={us.id === currentUser?.id}
                    onChange={(e) => onUpdateRole(us.id, us.nome, e.target.value)}
                    className={`px-2 py-1 rounded font-bold text-xs border cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none ${
                      us.role === 'ADMIN' ? 'text-purple-700 border-purple-200 bg-purple-50' : 'text-blue-700 border-blue-200 bg-blue-50'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <option value="USER">USER (Funcionário)</option>
                    <option value="ADMIN">ADMIN (Suporte TI)</option>
                  </select>
                </td>
                <td className="py-3 px-4 flex justify-center gap-4">
                  <button
                    onClick={() => onResetPasswordClick(us)}
                    className="text-amber-600 hover:text-amber-800 p-1 rounded transition cursor-pointer"
                    title="Alterar senha deste usuário"
                  >
                    <Key className="w-5 h-5" />
                  </button>

                  <button 
                    onClick={() => onDelete(us.id, us.nome)}
                    className="text-red-600 hover:text-red-800 p-1 rounded transition disabled:opacity-40 cursor-pointer"
                    disabled={us.id === currentUser?.id}
                    title="Remover acesso"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}