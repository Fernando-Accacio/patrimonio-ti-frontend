import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordModal({ 
  show, onClose, onSubmit, resetEmail, setResetEmail, resetLoading, resetError, resetSuccess 
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800">Recuperação de Acesso</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 cursor-pointer transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {resetError && <div className="p-3 bg-red-100 text-red-700 text-xs rounded font-medium">{resetError}</div>}
          
          {resetSuccess ? (
            <div className="p-4 bg-green-50 text-green-800 rounded-lg text-xs border border-green-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-green-900 mb-0.5">Solicitação Pendente!</strong>
                Seu pedido de redefinição foi enviado para a equipe de TI. Assim que um administrador aprovar, sua nova senha automática chegará no seu e-mail institucional.
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 leading-relaxed">
                Insira seu e-mail institucional cadastrado abaixo. O suporte técnico analisará seu pedido para liberar uma nova senha segura.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1" htmlFor="email-reset">Seu E-mail Cadastrado</label>
                <input 
                  type="email" id="email-reset" required 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                  placeholder="seu.nome@itapecerica.sp.gov.br"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs cursor-pointer transition">
              {resetSuccess ? 'Fechar Janela' : 'Cancelar'}
            </button>
            {!resetSuccess && (
              <button type="submit" disabled={resetLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-xs disabled:bg-blue-400 cursor-pointer transition">
                {resetLoading ? 'Enviando...' : 'Solicitar ao TI'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}