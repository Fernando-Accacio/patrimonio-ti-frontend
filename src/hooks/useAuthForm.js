import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export function useAuthForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ramal, setRamal] = useState('');
  const [matricula, setMatricula] = useState(''); // 🌟 Já estava aqui, excelente!
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { loginContext } = useContext(AuthContext);

  const tratarErroApi = (error) => {
    const resData = error.response?.data;
    if (resData) {
      if (resData.error === 'Bad Request') return 'Verifique se os dados estão corretos e não há campos vazios.';
      
      // 🌟 CORREÇÃO DE RETORNO: O seu Express envia a mensagem de erro em 'error' 
      // (ex: res.status(400).send({ error: e.message })), então priorizamos 'error' e depois 'message'
      return resData.error || resData.message || 'Erro ao conectar com o servidor.';
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

    if (!matricula.trim()) {
      setErro('A matrícula funcional é obrigatória para solicitar o acesso.');
      return;
    }

    if (!ramal.trim()) {
      setErro('O número do ramal é obrigatório para solicitar o acesso.');
      return;
    }

    try {
      await api.post('/register', { 
        nome, 
        email: emailTrimmed, 
        matricula, 
        ramal, 
        role: 'USER' 
      });
      setSucesso(true);
      setTimeout(() => navigate('/'), 10000);
    } catch (error) {
      setErro(tratarErroApi(error));
    }
  };

  return {
    nome, setNome, 
    email, setEmail, 
    senha, setSenha, 
    ramal, setRamal,
    matricula, setMatricula,
    erro, sucesso, showPassword, setShowPassword,
    handleLogin, handleRegister, navigate
  };
}