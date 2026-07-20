import React, { useState } from 'react';
import { LogIn, MonitorSmartphone, Eye, EyeOff } from 'lucide-react';
import { useAuthForm } from '../hooks/useAuthForm';
import api from '../services/api';
import ResetPasswordModal from '../components/modals/ResetPasswordModal'; // 🌟 Importando o Modal limpo

export default function Login() {
  const hook = useAuthForm();
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleCloseModal = () => {
    setShowResetModal(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
  };

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
      const erroApi = err.response?.data?.error;
      let erroAmigavel = 'Erro ao enviar solicitação. Verifique o e-mail.';

      if (erroApi === 'Bad Request' || erroApi === 'Validation error') {
        erroAmigavel = 'Formato de e-mail inválido. Verifique se você digitou corretamente.';
      } else if (erroApi === 'User not found' || erroApi === 'Usuário não encontrado') {
        erroAmigavel = 'Nenhum servidor encontrado com este endereço de e-mail.';
      } else if (erroApi) {
        erroAmigavel = erroApi; 
      }
      setResetError(erroAmigavel);
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
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="EmailLogin">E-mail Institucional</label>
            <input type="email" id="EmailLogin" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="seu.nome@itapecerica.sp.gov.br" value={hook.email} onChange={(e) => hook.setEmail(e.target.value)} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <button 
                type="button" 
                onClick={() => setShowResetModal(true)}
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

      {/* 🌟 MODAL INJETADO DE FORMA LIMPA */}
      <ResetPasswordModal 
        show={showResetModal}
        onClose={handleCloseModal}
        onSubmit={handleSendResetRequest}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        resetLoading={resetLoading}
        resetError={resetError}
        resetSuccess={resetSuccess}
      />
    </div>
  );
}