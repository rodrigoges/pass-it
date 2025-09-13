
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { LoginResponse, User } from '../../api/types';
import { useAuthStore } from '../../store/authStore';
import { LoginFormData, RegisterFormData } from './authSchemas';

const loginUser = async (credentials: LoginFormData): Promise<LoginResponse> => {
  const { data } = await apiClient.post<{ token: string; userId: string }>('/auth/login', credentials);
  const { useAuthStore } = await import('../../store/authStore');
  useAuthStore.getState().setAuth(data.token, null);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { getUserById } = await import('./getUserById');
  const user = await getUserById(data.userId);
  useAuthStore.getState().setAuth(data.token, user);

  return {
    token: data.token,
    user
  };
};

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert('Login falhou. Verifique suas credenciais.');
    },
  });
};


const registerUser = async (userData: RegisterFormData): Promise<User> => {
    const { data } = await apiClient.post<User>('/users', userData);
    return data;
};

export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            alert('Cadastro realizado com sucesso! Faça o login para continuar.');
            navigate('/login');
        },
        onError: (error) => {
            console.error('Registration failed:', error);
            alert('Falha no cadastro. Verifique os dados e tente novamente.');
        },
    });
}
