import React from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function PromptModal({ show, title, placeholder, inputValue, setInputValue, onCancel, onConfirm, isPassword, allowEmpty = false }) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Bloqueia o envio se for inválido
    if ((!allowEmpty && !inputValue.trim()) || (isPassword && inputValue.trim().length < 6)) {
      return;
    }
    onConfirm();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit(); // Dispara o handleSubmit do form
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b bg-blue-50 border-blue-100 flex justify-between items-center">
          <h3 className="font-bold text-blue-800 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> {title}
          </h3>
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-red-500 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 🌟 Adicionado form unificado */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {isPassword ? 'Nova Senha:' : allowEmpty ? 'Resolução / Solução Aplicada (opcional):' : 'Resolução / Solução Aplicada:'}
            </label>
            {!isPassword && allowEmpty && (
              <p className="mb-2 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-tight text-slate-500">
                Você pode deixar em branco ao confirmar a solução. Se o chamado não for confirmado, ele será marcado automaticamente após 3 dias.
              </p>
            )}
            
            {isPassword ? (
               <input 
                 type="text" 
                 autoFocus
                 minLength={6}
                 maxLength={50}
                 placeholder={placeholder}
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
               />
            ) : (
              <textarea 
                autoFocus 
                rows="4" 
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none text-sm"
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown} // 🌟 Captura o Enter aqui
              />
            )}
            
            {isPassword && (
               <span className="text-xs text-slate-500 mt-1 block">
                 A senha deve ter entre 6 e 50 caracteres.
               </span>
            )}
          </div>
          
          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
            <button 
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 font-semibold rounded-lg transition text-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" // 🌟 Convertido para submit real do form
              disabled={(!allowEmpty && !inputValue.trim()) || (isPassword && inputValue.trim().length < 6)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-lg transition text-sm cursor-pointer"
            >
              Salvar e Concluir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}