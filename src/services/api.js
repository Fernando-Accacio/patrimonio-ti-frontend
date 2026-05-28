import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api', // A porta onde seu Fastify está rodando
});

// Interceptor para mandar o Token de segurança se o usuário estiver logado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@PatrimonioTI:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;