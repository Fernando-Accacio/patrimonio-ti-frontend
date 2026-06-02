import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export function useAuthForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { loginContext } = useContext(AuthContext);

  // Função tradutora de erros do Fastify
  const tratarErroApi = (error) => {
    const resData = error.response?.data;
    if (resData) {
      if (resData.error === 'Bad Request') {
        return 'Verifique se o formato do e-mail é válido e se não há campos vazios.';
      }
      return resData.error || resData.message || 'Erro ao conectar com o servidor.';
    }
    return 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const response = await api.post('/login', { email, senha });
      loginContext(response.data.token, response.data.user);
      navigate(response.data.user.role === 'ADMIN' ? '/admin' : '/user');
    } catch (error) {
      // Usa o nosso tradutor de erros
      setErro(tratarErroApi(error));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso(false);
    try {
      await api.post('/register', { nome, email, senha, role: 'USER' });
      setSucesso(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      // Usa o nosso tradutor de erros
      setErro(tratarErroApi(error));
    }
  };

  return {
    nome, setNome, email, setEmail, senha, setSenha,
    erro, sucesso, showPassword, setShowPassword,
    handleLogin, handleRegister, navigate
  };
}