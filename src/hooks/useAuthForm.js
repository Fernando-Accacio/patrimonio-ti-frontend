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

  const tratarErroApi = (error) => {
    const resData = error.response?.data;
    if (resData) {
      if (resData.error === 'Bad Request') return 'Verifique se os dados estão corretos e não há campos vazios.';
      return resData.error || resData.message || 'Erro ao conectar com o servidor.';
    }
    return 'Erro de conexão. Verifique se o servidor está rodando.';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const response = await api.post('/login', { email, senha });
      loginContext(response.data.token, response.data.user);
      
      // NOVO: Roteamento de trânsito inteligente para os 3 perfis!
      const role = response.data.user.role;
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'TECH') {
        navigate('/tech');
      } else {
        navigate('/user');
      }
    } catch (error) {
      setErro(tratarErroApi(error));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso(false);
    try {
      await api.post('/register', { nome, email, role: 'USER' });
      setSucesso(true);
      setTimeout(() => navigate('/'), 10000);
    } catch (error) {
      setErro(tratarErroApi(error));
    }
  };

  return {
    nome, setNome, email, setEmail, senha, setSenha,
    erro, sucesso, showPassword, setShowPassword,
    handleLogin, handleRegister, navigate
  };
}