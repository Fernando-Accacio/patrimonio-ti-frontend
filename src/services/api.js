import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api', 
});

// Interceptor de Requisição (Manda o Token)
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('@PatrimonioTI:token');
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
      sessionStorage.removeItem('@PatrimonioTI:token');
      sessionStorage.removeItem('@PatrimonioTI:user');
      window.location.href = '/'; 
    }
    
    return Promise.reject(error);
  }
);

// 🌟 NOVA FUNÇÃO CONECTADA
export const responderConfirmacaoTicket = async (id, aprovado, motivo = '') => {
  const response = await api.patch(`/tickets/${id}/confirmar`, { aprovado, motivo });
  return response.data;
};

export default api;
