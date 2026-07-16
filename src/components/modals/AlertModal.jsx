import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function AlertModal({ show, title, message, type = 'info', onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className={`p-4 border-b flex items-center gap-3 ${
          type === 'error' ? 'bg-red-50 border-red-100 text-red-700' :
          type === 'success' ? 'bg-green-50 border-green-100 text-green-700' :
          'bg-blue-50 border-blue-100 text-blue-700'
        }`}>
          {type === 'error' && <AlertTriangle className="w-5 h-5" />}
          {type === 'success' && <CheckCircle className="w-5 h-5" />}
          {type === 'info' && <Info className="w-5 h-5" />}
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="p-6 text-slate-600 text-sm">
          {message}A
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}