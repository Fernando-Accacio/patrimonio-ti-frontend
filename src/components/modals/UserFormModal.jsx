import React, { useState, useEffect } from 'react';
import { X, User, Mail, Hash, Phone, Shield } from 'lucide-react';

export default function UserFormModal({ isOpen, onClose, onSave, editingUser }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [ramal, setRamal] = useState('');
  const [role, setRole] = useState('USER');
  const [erro, setErro] = useState('');

  // Preenche os campos caso seja uma edição (futura)
  useEffect(() => {
    if (editingUser) {
      setNome(editingUser.nome || '');
      setEmail(editingUser.email || '');
      setMatricula(editingUser.matricula || '');
      setRamal(editingUser.ramal || '');
      setRole(editingUser.role || 'USER');
    } else {
      setNome('');
      setEmail('');
      setMatricula('');
      setRamal('');
      setRole('USER');
    }
    setErro('');
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErro('');

    const emailTrimmed = email.trim().toLowerCase();

    // Validação estrita no frontend para poupar requisição inválida
    if (!emailTrimmed.endsWith('@itapecerica.sp.gov.br')) {
      setErro('O e-mail precisa obrigatoriamente terminar com @itapecerica.sp.gov.br');
      return;
    }

    if (!ramal.trim()) {
      setErro('O número do ramal é obrigatório.');
      return;
    }

    // Dispara a função de salvar passando os dados estruturados
    onSave({
      nome,
      email: emailTrimmed,
      matricula,
      ramal,
      role
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Cabeçalho */}
        <div className="bg-slate-50 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800">
              {editingUser ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 rounded-lg leading-relaxed">
              {erro}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nome Completo</label>
            <div className="relative">
              <input type="text" required placeholder="Ex: João da Silva" value={nome} onChange={(e) => setNome(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* E-mail Institucional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">E-mail Institucional</label>
            <div className="relative">
              <input type="email" required placeholder="usuario@itapecerica.sp.gov.br" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Domínio obrigatório: @itapecerica.sp.gov.br</p>
          </div>

          {/* Matrícula */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Matrícula Funcional</label>
            <div className="relative">
              <input type="text" required placeholder="Ex: 46585" value={matricula} onChange={(e) => setMatricula(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Ramal (🌟 NOVO!) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Ramal Interno</label>
            <div className="relative">
              <input type="text" required placeholder="Ex: 2415" value={ramal} onChange={(e) => setRamal(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Nível de Acesso */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nível de Acesso (Cargo)</label>
            <div className="relative">
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white transition cursor-pointer appearance-none">
                <option value="USER">Usuário Comum (Servidor)</option>
                <option value="TECH">Técnico de Suporte (TI)</option>
                <option value="ADMIN">Administrador do Sistema</option>
              </select>
              <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Botões */}
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose}
              className="w-1/2 border border-slate-300 text-slate-700 font-bold py-2.5 rounded-lg text-sm hover:bg-slate-50 transition cursor-pointer text-center">
              Cancelar
            </button>
            <button type="submit"
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition cursor-pointer text-center">
              {editingUser ? 'Salvar Alterações' : 'Concluir Cadastro'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}