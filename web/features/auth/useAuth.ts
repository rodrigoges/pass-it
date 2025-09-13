
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { LoginResponse, User } from '../../api/types';
import { useAuthStore } from '../../store/authStore';
import { LoginFormData, RegisterFormData } from './authSchemas';

// Login Mutation
const loginUser = async (credentials: LoginFormData): Promise<LoginResponse> => {
  const { data: token } = await apiClient.post<string>('/auth/login', credentials);

  // Após login, buscar usuário real pelo email
  const { getUserByEmail } = await import('./getUserByEmail');
  const user = await getUserByEmail(credentials.email);

  return {
    token,
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
      // Here you would typically show a toast notification
      console.error('Login failed:', error);
      alert('Login falhou. Verifique suas credenciais.');
    },
  });
};


// Register Mutation
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
