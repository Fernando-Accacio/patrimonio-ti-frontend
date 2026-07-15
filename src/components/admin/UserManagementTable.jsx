import React, { useState, useEffect } from 'react';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import UserManagementTableRow from './UserManagementTableRow';

export default function UserManagementTable({ users, currentUser, onUpdateRole, onDelete, onAddClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('Todos'); // 🌟 ESTADO DO FILTRO
  const itemsPerPage = 10;

  // 🌟 Se o usuário mudar o filtro, volta para a primeira página
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter]);

  const safeUsers = users || [];

  // 🌟 APLICAÇÃO DO FILTRO ANTES DA PAGINAÇÃO
  const filteredUsers = safeUsers.filter(u => {
    if (roleFilter === 'Todos') return true;
    return u.role === roleFilter;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-200">
      
      <div className="bg-slate-50 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Controle de Acesso</h2>
          <p className="text-sm text-slate-500">Gerencie os níveis de permissão dos servidores do sistema.</p>
        </div>
        
        {/* 🌟 CONTAINER DO FILTRO + BOTÃO DE NOVO */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white text-slate-600 font-medium"
          >
            <option value="Todos">Todos os Níveis</option>
            <option value="ADMIN">Administradores</option>
            <option value="TECH">Técnicos (Suporte)</option>
            <option value="USER">Usuários Comuns</option>
          </select>

          <button
            onClick={onAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Novo Funcionário
          </button>
        </div>
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
            {currentUsers.length === 0 ? (
              <tr><td colSpan="4" className="py-8 text-center text-slate-400 italic text-sm">Nenhum servidor encontrado com este filtro.</td></tr>
            ) : (
              currentUsers.map((u) => (
                <UserManagementTableRow 
                  key={u.id} 
                  u={u} 
                  currentUser={currentUser} 
                  onUpdateRole={onUpdateRole} 
                  onDelete={onDelete} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
          <div>
            Exibindo <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> a <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, totalItems)}</span> de <span className="font-semibold text-slate-700">{totalItems}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-50 transition cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700 px-2">Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-50 transition cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}