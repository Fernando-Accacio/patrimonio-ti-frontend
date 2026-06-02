import React from 'react';
import { UserPlus, MonitorSmartphone, Eye, EyeOff } from 'lucide-react';
import { useAuthForm } from '../hooks/useAuthForm';

export default function Register() {
  const hook = useAuthForm();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-md"><MonitorSmartphone className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-bold text-slate-800">Prefeitura Municipal</h1>
          <p className="text-slate-500 font-medium">Criar Conta de Acesso</p>
        </div>

        {hook.erro && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">{hook.erro}</div>}
        {hook.sucesso && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center font-medium">Conta criada com sucesso! Redirecionando...</div>}

        <form onSubmit={hook.handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ex: João da Silva" value={hook.nome} onChange={(e) => hook.setNome(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Institucional</label>
            <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="seu.nome@prefeitura.gov.br" value={hook.email} onChange={(e) => hook.setEmail(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha de Acesso</label>
            <div className="relative">
              <input type={hook.showPassword ? 'text' : 'password'} required minLength={6} maxLength={50} className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Mínimo 6 caracteres" value={hook.senha} onChange={(e) => hook.setSenha(e.target.value)} />
              <button type="button" onClick={() => hook.setShowPassword(!hook.showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {hook.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5" /> Finalizar Cadastro
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-4">
          Já possui uma conta? <button onClick={() => hook.navigate('/')} className="text-blue-600 hover:underline font-semibold">Fazer Login</button>
        </div>
        
      </div>
    </div>
  );
}