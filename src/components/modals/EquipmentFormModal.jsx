import React from 'react';
import { X } from 'lucide-react';

export default function EquipmentFormModal({ show, onClose, onSubmit, novoEq, setNovoEq }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Cadastrar Novo Equipamento</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            {/* CORREÇÃO: Atualizado para 7 dígitos */}
            <label className="block text-sm font-medium text-slate-700 mb-1">Nº do Patrimônio (7 Dígitos)</label>
            <input 
              type="text" required maxLength={7} placeholder="Ex: 4658522"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
              value={novoEq.patrimonio}
              onChange={(e) => setNovoEq({...novoEq, patrimonio: e.target.value.replace(/\D/g, '')})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Equipamento</label>
            <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white" value={novoEq.tipo} onChange={(e) => setNovoEq({...novoEq, tipo: e.target.value})}>
              <option value="">Selecione...</option>
              <option value="Computador Desktop">Computador Desktop</option>
              <option value="Notebook">Notebook</option>
              <option value="Impressora">Impressora</option>
              <option value="Monitor">Monitor</option>
              <option value="Telefone IP">Telefone IP</option>
              <option value="Projetor">Projetor</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Localização / Observação</label>
            <input type="text" required placeholder="Ex: Gabinete do Prefeito" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={novoEq.observacao} onChange={(e) => setNovoEq({...novoEq, observacao: e.target.value})}/>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition cursor-pointer">Cancelar</button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}