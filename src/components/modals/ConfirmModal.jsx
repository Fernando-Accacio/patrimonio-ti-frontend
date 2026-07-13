import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ show, title, message, onCancel, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b bg-orange-50 border-orange-100 text-orange-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="p-6 text-slate-600 text-sm leading-relaxed">
          {message}
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 font-semibold rounded-lg transition text-sm cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition text-sm cursor-pointer"
          >
            Sim, Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}