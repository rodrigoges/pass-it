
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { ApiError } from './types';

const VITE_API_BASE_URL = 'http://localhost:8080/passit';

const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      const tokenValue = typeof token === 'string' ? token : (token as any).token;
      if (tokenValue) {
        config.headers.Authorization = `Bearer ${tokenValue}`;
      }
    }
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
