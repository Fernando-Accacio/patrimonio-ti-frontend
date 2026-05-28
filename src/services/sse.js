import api from './api';

export const getSseUrl = () => {
  const baseUrl = api.defaults.baseURL || window.location.origin;
  return new URL('/api/stream', baseUrl).toString();
};