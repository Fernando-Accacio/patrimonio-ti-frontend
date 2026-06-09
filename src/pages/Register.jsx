import React from 'react';
import { UserPlus, MonitorSmartphone, CheckCircle2 } from 'lucide-react'; 
import { useAuthForm } from '../hooks/useAuthForm';

export default function Register() {
  const hook = useAuthForm();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-md"><MonitorSmartphone className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-bold text-slate-800">Prefeitura Municipal</h1>
          <p className="text-slate-500 font-medium">Solicitar Conta de Acesso</p>
        </div>

        {hook.erro && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">{hook.erro}</div>}
        
        {hook.sucesso && (
          <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg text-sm border border-green-200 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-green-900 mb-1">Solicitação Enviada!</strong>
              Sua conta foi pré-cadastrada com sucesso. Uma senha provisória de acesso (de 8 a 12 caracteres) foi gerada e será enviada para o seu e-mail institucional em instantes.
            </div>
          </div>
        )}

        {!hook.sucesso && (
          <form onSubmit={hook.handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition" placeholder="Ex: João da Silva" value={hook.nome} onChange={(e) => hook.setNome(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Institucional</label>
              <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition" placeholder="seu.nome@itapecerica.sp.gov.br" value={hook.email} onChange={(e) => hook.setEmail(e.target.value)} />
            </div>

            {/* 🌟 NOVO CAMPO: Input de Ramal Interno Obrigatório */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ramal Interno</label>
              <input 
                type="text" 
                required 
                maxLength={4}
                placeholder="Ex: 2415" 
                value={hook.ramal} 
                onChange={(e) => hook.setRamal(e.target.value.replace(/\D/g, ''))} // Limita apenas a números
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition" 
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition">
              <UserPlus className="w-5 h-5" /> Enviar Solicitação
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-4">
          Já possui acesso? <button onClick={() => hook.navigate('/')} className="text-blue-600 hover:underline font-semibold cursor-pointer">Fazer Login</button>
        </div>
        
      </div>
    </div>
  );
}