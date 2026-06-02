import React, { useState, useEffect } from 'react';
import { X, User, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';

export default function UserProfileModal({ show, onClose, user, onSuccess }) {
  const [activeTab, setActiveTab] = useState('perfil'); 
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // NOVO: O "Faxineiro" do React! Sempre que o modal fechar, ele limpa tudo.
  useEffect(() => {
    if (!show) {
      setNovaSenha('');
      setConfirmarSenha('');
      setErro('');
      setActiveTab('perfil');
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [show]);

  if (!show) return null;

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (activeTab === 'perfil') return;

    setErro('');

    if (novaSenha !== confirmarSenha) {
      setErro('A nova senha e a confirmação não coincidem. Verifique a digitação.');
      return;
    }

    setLoading(true);
    try {
      await api.patch('/users/me/password', { novaSenha });
      onSuccess('Senha alterada com sucesso!');
      onClose(); // O useEffect ali de cima vai se encarregar de limpar os campos!
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao processar alteração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[70] p-4 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Configurações da Conta</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition cursor-pointer"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex border-b text-sm font-medium">
          <button type="button" onClick={() => { setActiveTab('perfil'); setErro(''); }} className={`flex-1 py-3 flex items-center justify-center gap-2 cursor-pointer transition ${activeTab === 'perfil' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <User className="w-4 h-4" /> Dados Pessoais
          </button>
          <button type="button" onClick={() => { setActiveTab('senha'); setErro(''); }} className={`flex-1 py-3 flex items-center justify-center gap-2 cursor-pointer transition ${activeTab === 'senha' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <KeyRound className="w-4 h-4" /> Segurança
          </button>
        </div>

        <form onSubmit={handleSalvar} className="p-6 space-y-4">
          {erro && <div className="p-3 bg-red-100 text-red-700 text-sm rounded font-medium">{erro}</div>}
          
          {activeTab === 'perfil' ? (
            <>
              <div className="flex items-center gap-2 mb-4 p-3 bg-slate-100 text-slate-600 text-[11px] leading-tight rounded border border-slate-200">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                Por motivos de conformidade e segurança institucional, não é possível alterar o Nome e o E-mail cadastrados.
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nome Completo</label>
                <input type="text" readOnly className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none text-sm" value={user?.nome || ''} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">E-mail Institucional</label>
                <input type="email" readOnly className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none text-sm" value={user?.email || ''} />
              </div>

              <div className="pt-4">
                <button type="button" onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg cursor-pointer transition text-sm">Fechar</button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha de Acesso</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    minLength={6} 
                    maxLength={50} 
                    placeholder="Mínimo 6 caracteres" 
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition" 
                    value={novaSenha} 
                    onChange={(e) => setNovaSenha(e.target.value)} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Repita a Nova Senha</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    required 
                    minLength={6} 
                    maxLength={50} 
                    placeholder="Confirme a mesma senha" 
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition" 
                    value={confirmarSenha} 
                    onChange={(e) => setConfirmarSenha(e.target.value)} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 block leading-tight">A alteração exige que as duas caixas de texto contenham exatamente os mesmos caracteres.</span>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg cursor-pointer text-sm">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg disabled:bg-blue-400 cursor-pointer text-sm">
                  {loading ? 'Salvando...' : 'Atualizar Senha'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}