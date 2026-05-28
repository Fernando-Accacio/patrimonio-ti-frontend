import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, MonitorSmartphone, Eye, EyeOff } from 'lucide-react'; // Importados Eye e EyeOff
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    try {
      await api.post('/register', {
        nome,
        email,
        senha,
        role: 'USER'
      });

      setSucesso(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao realizar o cadastro. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-md">
            <MonitorSmartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Prefeitura Municipal</h1>
          <p className="text-slate-500 font-medium">Criar Conta de Acesso</p>
        </div>

        {/* Feedback de Erro */}
        {erro && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 text-sm text-center font-medium">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200 text-sm text-center font-medium">
            Conta criada com sucesso! Redirecionando...
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Institucional</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
              placeholder="seu.nome@prefeitura.gov.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha de Acesso</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus className="w-5 h-5" />
            Finalizar Cadastro
          </button>
        </form>

        {/* Link Interativo para Retornar ao Login */}
        <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-4">
          Já possui uma conta?{' '}
          <button 
            onClick={() => navigate('/')} 
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition"
          >
            Fazer Login
          </button>
        </div>
        
      </div>
    </div>
  );
}