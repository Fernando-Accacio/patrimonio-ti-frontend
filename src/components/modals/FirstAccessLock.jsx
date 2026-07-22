import React, { useState } from 'react';
import { Lock, LogOut, AlertCircle, MonitorSmartphone, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function FirstAccessLock({ user, logoutContext, loginContext, onSuccess }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroLock, setErroLock] = useState('');
  const [loadingLock, setLoadingLock] = useState(false);

  const handleForcedPasswordChange = async (e) => {
    e.preventDefault();
    setErroLock('');

    if (novaSenha !== confirmarSenha) {
      setErroLock('As senhas não coincidem. Verifique a digitação.');
      return;
    }

    setLoadingLock(true);
    try {
      await api.patch('/users/me/password', { novaSenha });
      
      const token = sessionStorage.getItem('@PatrimonioTI:token');
      
      loginContext(token, { ...user, primeira_senha: false });
      
      if (onSuccess) onSuccess('Senha atualizada com sucesso! Acesso liberado.');
    } catch (err) {
      setErroLock(err.response?.data?.error || 'Erro ao atualizar senha.');
    } finally {
      setLoadingLock(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 fixed inset-0 z-[999]">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 animate-in fade-in zoom-in duration-300">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-md">
            <MonitorSmartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Prefeitura Municipal</h1>
          <p className="text-slate-500 font-medium text-center">Configuração de Primeiro Acesso</p>
        </div>

        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-3">
          <Lock className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5 text-amber-900">Segurança Obrigatória</strong>
            Detectamos que você está usando uma senha provisória. Por favor, crie uma senha pessoal para liberar o sistema.
          </div>
        </div>

        <form onSubmit={handleForcedPasswordChange} className="space-y-5">
          {erroLock && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {erroLock}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
            <div className="relative">
              <input 
                type="password" required minLength={6} maxLength={50} autoFocus
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition" 
                placeholder="Mínimo de 6 caracteres"
                value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nova Senha</label>
            <div className="relative">
              <input 
                type="password" required minLength={6} maxLength={50}
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition" 
                placeholder="Repita a nova senha"
                value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button 
              type="submit" disabled={loadingLock} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition disabled:bg-blue-400 shadow-md"
            >
              {loadingLock ? 'Processando...' : 'Salvar e Acessar Sistema'}
              {!loadingLock && <CheckCircle2 className="w-5 h-5" />}
            </button>
            
            <button 
              type="button" onClick={logoutContext} 
              className="w-full text-slate-500 hover:text-red-600 text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer mt-2"
            >
              <LogOut className="w-4 h-4" /> Cancelar e Sair
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}