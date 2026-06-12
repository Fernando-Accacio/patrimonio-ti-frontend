import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export function useAuthForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ramal, setRamal] = useState(''); // 🌟 ADICIONADO: Estado do ramal
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { loginContext } = useContext(AuthContext);

  const tratarErroApi = (error) => {
    const resData = error.response?.data;
    if (resData) {
      if (resData.error === 'Bad Request') return 'Verifique se os dados estão corretos e não há campos vazios.';
      
      // 🌟 CORREÇÃO: Agora ele prioriza a propriedade "message", que é onde o seu UserService
      // joga a string "E-mail já cadastrado." pelo `throw new Error(...)`
      return resData.message || resData.error || 'Erro ao conectar com o servidor.';
    }
    return 'Erro de conexão. Verifique se o servidor está rodando.';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    const emailTrimmed = email.trim().toLowerCase();

    // 🌟 VALIDAÇÃO ESTRITA: Se o e-mail não terminar com o domínio oficial da prefeitura
    if (!emailTrimmed.endsWith('@itapecerica.sp.gov.br')) {
      setErro('Acesso Negado: Use o formato oficial completo do seu e-mail institucional: seu.nome@itapecerica.sp.gov.br');
      return;
    }

    try {
      const response = await api.post('/login', { email: emailTrimmed, senha });
      loginContext(response.data.token, response.data.user);
      
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

    const emailTrimmed = email.trim().toLowerCase();

    // 🌟 VALIDAÇÃO LOCAL: Evita chamadas desnecessárias se o e-mail estiver fora do padrão
    if (!emailTrimmed.endsWith('@itapecerica.sp.gov.br')) {
      setErro('O e-mail precisa obrigatoriamente terminar com @itapecerica.sp.gov.br');
      return;
    }

    if (!ramal.trim()) {
      setErro('O número do ramal é obrigatório para solicitar o acesso.');
      return;
    }

    try {
      // 🌟 ATUALIZADO: Enviando nome, email estruturado e ramal obrigatório
      await api.post('/register', { nome, email: emailTrimmed, ramal, role: 'USER' });
      setSucesso(true);
      setTimeout(() => navigate('/'), 10000);
    } catch (error) {
      setErro(tratarErroApi(error));
    }
  };

  return {
    nome, setNome, email, setEmail, senha, setSenha, ramal, setRamal, // 🌟 EXPORTADO: ramal e setRamal
    erro, sucesso, showPassword, setShowPassword,
    handleLogin, handleRegister, navigate
  };
}