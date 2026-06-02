import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api', 
});

// Interceptor de Requisição (Manda o Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@PatrimonioTI:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta (Escuta a Invalidação)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // BLINDAGEM: As interrogações garantem que, se a internet cair ou o backend estiver desligado, o React não crashe.
    if (error.response && error.response.status === 401 && !error.config?.url?.includes('/login')) {
      localStorage.removeItem('@PatrimonioTI:token');
      localStorage.removeItem('@PatrimonioTI:user');
      window.location.href = '/'; 
    }
    
    return Promise.reject(error);
  }
);

export default api;