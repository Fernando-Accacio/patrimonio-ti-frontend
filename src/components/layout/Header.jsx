import React from 'react';
import { LogOut, Wrench } from 'lucide-react';

export default function Header({ title, user, onLogout, onEditProfileClick }) {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wrench className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onEditProfileClick}
            className="text-sm bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded-full font-medium transition cursor-pointer"
            title="Editar meu perfil"
          >
            Olá, {user?.nome}
          </button>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-1 hover:text-red-300 transition cursor-pointer" 
            title="Sair do sistema"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}