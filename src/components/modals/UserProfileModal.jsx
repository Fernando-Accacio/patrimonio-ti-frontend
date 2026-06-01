import React, { useState } from 'react';
import { X, User, KeyRound } from 'lucide-react';
import api from '../../services/api';

export default function UserProfileModal({ show, onClose, user, onSuccess }) {
  const [activeTab, setActiveTab] = useState('perfil'); // 'perfil' ou 'senha'
  
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [novaSenha, setNovaSenha] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!show) return null;

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true); setErro('');

    try {
      if (activeTab === 'senha') {
        await api.patch('/users/me/password', { novaSenha });
        onSuccess('Senha alterada com sucesso!');
      } else {
        await api.put('/users/me/profile', { nome, email });
        onSuccess('Perfil atualizado com sucesso! Faça login novamente para refletir as alterações.');
      }
      onClose();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao processar alteração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Configurações da Conta</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition cursor-pointer"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex border-b text-sm font-medium">
          <button onClick={() => { setActiveTab('perfil'); setErro(''); }} className={`flex-1 py-3 flex items-center justify-center gap-2 cursor-pointer transition ${activeTab === 'perfil' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <User className="w-4 h-4" /> Dados Pessoais
          </button>
          <button onClick={() => { setActiveTab('senha'); setErro(''); }} className={`flex-1 py-3 flex items-center justify-center gap-2 cursor-pointer transition ${activeTab === 'senha' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <KeyRound className="w-4 h-4" /> Segurança
          </button>
        </div>

        <form onSubmit={handleSalvar} className="p-6 space-y-4">
          {erro && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{erro}</div>}
          
          {activeTab === 'perfil' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input type="text" required maxLength={100} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Institucional</label>
                <input type="email" required maxLength={100} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha de Acesso</label>
              <input type="password" required minLength={6} maxLength={50} placeholder="Mínimo 6 caracteres" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
              <span className="text-xs text-slate-500 mt-1 block">A senha deve ter entre 6 e 50 caracteres.</span>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg cursor-pointer">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg disabled:bg-blue-400 cursor-pointer">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}