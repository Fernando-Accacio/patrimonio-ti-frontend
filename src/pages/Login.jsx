import React, { useState } from 'react';
import { LogIn, MonitorSmartphone, Eye, EyeOff, X, CheckCircle2 } from 'lucide-react';
import { useAuthForm } from '../hooks/useAuthForm';
import api from '../services/api';

export default function Login() {
  const hook = useAuthForm();
  
  // Estados locais para gerenciar o modal de Esqueci a Senha
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSendResetRequest = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess(false);

    try {
      await api.post('/password-resets/request', { email: resetEmail });
      setResetSuccess(true);
      setResetEmail('');
    } catch (err) {
      setResetError(err.response?.data?.error || 'Erro ao enviar solicitação. Verifique o e-mail.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-md"><MonitorSmartphone className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-bold text-slate-800">Prefeitura Municipal</h1>
          <p className="text-slate-500 font-medium">Gestão de Patrimônio e Helpdesk</p>
        </div>

        {hook.erro && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">{hook.erro}</div>}

        <form onSubmit={hook.handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Institucional</label>
            <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="seu.nome@prefeitura.gov.br" value={hook.email} onChange={(e) => hook.setEmail(e.target.value)} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              {/* Botão Esqueci minha senha */}
              <button 
                type="button" 
                onClick={() => { setShowResetModal(true); setResetError(''); setResetSuccess(false); }}
                className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <input type={hook.showPassword ? 'text' : 'password'} required className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="••••••••" value={hook.senha} onChange={(e) => hook.setSenha(e.target.value)} />
              <button type="button" onClick={() => hook.setShowPassword(!hook.showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {hook.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition">
            <LogIn className="w-5 h-5" /> Acessar Sistema
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-4">
          Novo por aqui? <button onClick={() => hook.navigate('/register')} className="text-blue-600 hover:underline font-semibold cursor-pointer">Cadastre-se aqui</button>
        </div>
      </div>

      {/* MODAL DE SOLICITAÇÃO DE SUPORTE (ESQUECI A SENHA) */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800">Recuperação de Acesso</h3>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-red-500 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSendResetRequest} className="p-6 space-y-4">
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
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Seu E-mail Cadastrado</label>
                    <input 
                      type="email" required 
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                      placeholder="seu.nome@prefeitura.gov.br"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowResetModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs cursor-pointer">
                  {resetSuccess ? 'Fechar Janela' : 'Cancelar'}
                </button>
                {!resetSuccess && (
                  <button type="submit" disabled={resetLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-xs disabled:bg-blue-400 cursor-pointer">
                    {resetLoading ? 'Enviando...' : 'Solicitar ao TI'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}