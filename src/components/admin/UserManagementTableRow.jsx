import React from 'react';
import { Trash2, ShieldCheck, UserCog, Wrench } from 'lucide-react';

export default function UserManagementTableRow({ u, currentUser, onUpdateRole, onDelete }) {
  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            {u.nome.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-slate-800">
            {u.nome} {u.id === currentUser?.id && '(Você)'}
          </span>
        </div>
      </td>
      <td className="py-4 px-6 font-mono text-xs text-slate-500">{u.email}</td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
          u.role === 'TECH' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {u.role === 'ADMIN' && <ShieldCheck className="w-3 h-3" />}
          {u.role === 'TECH' && <Wrench className="w-3 h-3" />}
          {u.role === 'USER' && <UserCog className="w-3 h-3" />}
          {u.role}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-2">
          {u.id !== currentUser?.id ? (
            <>
              <select
                value={u.role}
                onChange={(e) => onUpdateRole(u.id, u.nome, e.target.value)}
                className="text-xs border border-slate-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
              >
                <option value="USER">Usuário Comum</option>
                <option value="TECH">Técnico TI (Suporte)</option>
                <option value="ADMIN">Administrador</option>
              </select>
              
              <button
                onClick={() => onDelete(u.id, u.nome)}
                className="p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer"
                title="Remover Acesso"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">Conta Ativa</span>
          )}
        </div>
      </td>
    </tr>
  );
}