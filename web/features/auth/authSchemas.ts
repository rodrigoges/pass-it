
import { z } from 'zod';
import { UserType } from '../../api/types';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  nationalIdentifier: z.string().min(11, 'CPF/CNPJ inválido'),
  userType: z.nativeEnum(UserType),
  address: z.object({
      street: z.string().min(1, 'Rua é obrigatória'),
      city: z.string().min(1, 'Cidade é obrigatória'),
      state: z.string().min(2, 'Estado é obrigatório').max(2, 'Use a sigla do estado'),
      zipCode: z.string().min(8, 'CEP inválido'),
  })
});

export type RegisterFormData = z.infer<typeof registerSchema>;
