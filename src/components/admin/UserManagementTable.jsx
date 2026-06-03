import React from 'react';
import { Trash2, ShieldCheck, UserCog, UserPlus, Wrench } from 'lucide-react';

export default function UserManagementTable({ users, currentUser, onUpdateRole, onDelete, onAddClick }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200">
      
      {/* CABEÇALHO ATUALIZADO COM O BOTÃO DE ADICIONAR */}
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
              <tr key={u.id} className="hover:bg-slate-50 transition">
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
                  {/* BADGES REESTILIZADOS INCLUINDO O PERFIL 'TECH' */}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}