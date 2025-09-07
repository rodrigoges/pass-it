
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { LoginResponse, User } from '../../api/types';
import { useAuthStore } from '../../store/authStore';
import { LoginFormData, RegisterFormData } from './authSchemas';

// Login Mutation
const loginUser = async (credentials: LoginFormData): Promise<LoginResponse> => {
  const { data } = await apiClient.post<string>('/auth/login', credentials);
  console.log('🔑 Resposta do login:', data);
  
  // A API retorna apenas o token como string, não um objeto
  // Vamos criar um objeto temporário com o token e um usuário mock
  // TODO: Implementar endpoint para buscar dados do usuário
  const mockUser: User = {
    id: 'temp-user-id',
    name: 'Usuário',
    email: credentials.email,
    userType: 'DONOR' as any,
    nationalIdentifier: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return {
    token: data,
    user: mockUser
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
