import React, { useEffect } from 'react';
import { X, UserPlus, Lightbulb } from 'lucide-react'; // <-- Lightbulb importado (removi o CreditCard que não estava em uso)

export default function UserFormModal({ show, onClose, onSubmit, novoUser, setNovoUser }) {
  
  useEffect(() => {
    if (!show) {
      setNovoUser({ nome: '', email: '', matricula: '', role: 'USER' });
    }
  }, [show, setNovoUser]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" /> Cadastrar Funcionário / TI
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* CAMPO 1: MATRÍCULA FUNCIONAL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nº da Matrícula Funcional</label>
            <div className="relative">
              <input 
                type="text" 
                required 
                placeholder="Ex: 854.963-A"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition"
                value={novoUser.matricula}
                onChange={(e) => setNovoUser({...novoUser, matricula: e.target.value})}
              />
            </div>
          </div>

          {/* CAMPO 2: NOME */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input 
              type="text" required placeholder="Ex: Carlos Eduardo de Souza"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition"
              value={novoUser.nome}
              onChange={(e) => setNovoUser({...novoUser, nome: e.target.value})}
            />
          </div>

          {/* CAMPO 3: EMAIL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Corporativo</label>
            <input 
              type="email" required placeholder="carlos.souza@prefeitura.gov.br"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition"
              value={novoUser.email}
              onChange={(e) => setNovoUser({...novoUser, email: e.target.value})}
            />
          </div>

          {/* CAMPO 4: CARGO */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nível de Permissão (Cargo)</label>
            <select 
              required 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white text-sm cursor-pointer"
              value={novoUser.role} 
              onChange={(e) => setNovoUser({...novoUser, role: e.target.value})}
            >
              <option value="USER">USER - Funcionário Comum</option>
              <option value="TECH">TECH - Técnico de Suporte TI</option>
              <option value="ADMIN">ADMIN - Administrador do Sistema</option>
            </select>
          </div>

          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-[11px] leading-relaxed border border-blue-100 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Nota de Segurança:</strong> Ao concluir, o sistema associará os dados e gerará uma senha automática forte, mascarando o e-mail no banco por criptografia.
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-xs transition cursor-pointer shadow-sm">
              Concluir Cadastro
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}