
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { ApiError } from './types';

const VITE_API_BASE_URL = 'http://localhost:8080/passit'; // As per instructions, not using .env

const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Adicionar explicitamente
});

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    
    console.log('🔍 Interceptor - URL:', config.url);
    console.log('🔍 Interceptor - Método:', config.method);
    console.log('🔍 Interceptor - Token original:', token);
    console.log('🔍 Interceptor - Token tipo:', typeof token);
    
    if (token) {
      // Garantir que o token seja sempre uma string
      const tokenValue = typeof token === 'string' ? token : (token as any).token;
      console.log('🔍 Interceptor - Token value:', tokenValue);
      
      if (tokenValue) {
        config.headers.Authorization = `Bearer ${tokenValue}`;
        console.log('🔍 Interceptor - Header Authorization:', `Bearer ${tokenValue.substring(0, 20)}...`);
      }
    } else {
      console.log('❌ Interceptor - Nenhum token encontrado');
    }
    
    console.log('🔍 Interceptor - Headers finais:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ Interceptor - Erro:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.hash = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
