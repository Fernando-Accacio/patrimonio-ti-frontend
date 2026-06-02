import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

// Interceptor de Requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@PatrimonioTI:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // CORREÇÃO: Se der 401, MAS NÃO FOR a rota de login, aí sim ele desloga a pessoa.
    if (error.response && error.response.status === 401 && !error.config.url.includes('/login')) {
      localStorage.removeItem('@PatrimonioTI:token');
      localStorage.removeItem('@PatrimonioTI:user');
      window.location.href = '/'; 
    }
    
    return Promise.reject(error);
  }
);

export default api;