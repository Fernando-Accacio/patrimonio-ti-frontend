import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Save, Send } from 'lucide-react';

export default function ModalDevolucao({ show, onClose, onSubmit, ticket, equipments }) {
  const [observacao, setObservacao] = useState('');
  const [patrimonio, setPatrimonio] = useState('');

  useEffect(() => {
    if (ticket) {
      // Procura o patrimônio atual para já vir preenchido no campo de texto
      const eq = equipments.find(e => e.id === ticket.equipment_id);
      setPatrimonio(eq ? eq.patrimonio : '');
      setObservacao('');
    }
  }, [ticket, equipments]);

  if (!show || !ticket) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia o patrimônio como string solta e a observação
    onSubmit(ticket.id, { observacao, patrimonio });
  };

  const isDevolucao = observacao.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* 🌟 O FUNDO: Separado e leve para não travar a animação do navegador */}
      <div 
        className="absolute inset-0 bg-slate-900/50 transition-opacity" 
        onClick={onClose}
      ></div>

      {/* 🌟 O MODAL: Anima sozinho por cima do fundo */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="w-5 h-5" />
            <h2 className="font-bold">Editar Patrimônio ou Devolver</h2>
          </div>
          <button onClick={onClose} className="p-2 text-amber-600/60 hover:text-amber-700 transition rounded-lg hover:bg-amber-100/50 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Patrimônio Informado</label>
            <p className="text-xs text-slate-500 mb-2">Edite livremente se o usuário tiver digitado errado.</p>
            <input
              type="text"
              value={patrimonio}
              onChange={(e) => setPatrimonio(e.target.value)}
              placeholder="Ex: 123456 ou S/P"
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Observação / Dúvida (Opcional)</label>
            <p className="text-xs text-slate-500 mb-2">
              Se preenchido, o chamado será <strong>devolvido para a fila (Aberto)</strong> para o usuário responder.
            </p>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder='Ex: "O número do patrimônio correto é este mesmo?"'
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 resize-none h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer">
              Cancelar
            </button>
            
            <button 
              type="submit" 
              className={`px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm flex items-center gap-2 transition cursor-pointer ${
                isDevolucao ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isDevolucao ? (
                <><Send className="w-4 h-4" /> Salvar e Devolver</>
              ) : (
                <><Save className="w-4 h-4" /> Apenas Salvar Correção</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}