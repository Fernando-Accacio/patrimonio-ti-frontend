import React, { useState, useContext } from 'react';
import { LogIn, MonitorSmartphone, Eye, EyeOff } from 'lucide-react'; // Importados Eye e EyeOff
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade
  
  const navigate = useNavigate();
  const { loginContext } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    
    try {
      const response = await api.post('/login', { email, senha });
      
      loginContext(response.data.token, response.data.user);
      
      if (response.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
      
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao conectar com o servidor.');
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
          <p className="text-slate-500 font-medium">Gestão de Patrimônio e Helpdesk</p>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 text-sm text-center font-medium">
            {erro}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
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
            <LogIn className="w-5 h-5" />
            Acessar Sistema
          </button>
        </form>

        {/* Link Interativo para Cadastro */}
        <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-4">
          Novo por aqui?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition"
          >
            Cadastre-se aqui
          </button>
        </div>
        
      </div>
    </div>
  );
}