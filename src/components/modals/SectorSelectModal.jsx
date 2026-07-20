import React, { useState } from 'react';
import { Search, Building, X } from 'lucide-react';

export default function SectorSelectModal({ isOpen, onClose, setores, onSelectSector }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredSectors = setores.filter(setor =>
    setor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setor.prefixo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id) => {
    onSelectSector(id);
    setSearchTerm(''); // Limpa a busca ao selecionar
  };

  const handleClose = () => {
    onClose();
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            <h3 className="text-md font-bold text-slate-800">Selecione o seu Setor</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-red-500 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Input de Busca */}
        <div className="p-4 border-b bg-slate-50/50">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquise o setor pelo nome ou sigla..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Lista de Setores */}
        <div className="max-h-64 overflow-y-auto p-4 space-y-1">
          {filteredSectors.length > 0 ? (
            filteredSectors.map((setor) => (
              <button
                key={setor.id}
                type="button"
                onClick={() => handleSelect(setor.id)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{setor.nome}</span>
                <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 bg-slate-100 group-hover:bg-blue-100 px-2 py-0.5 rounded">
                  {setor.prefixo}
                </span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-400">Nenhum setor encontrado para "{searchTerm}".</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-2 px-4 rounded-lg transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}