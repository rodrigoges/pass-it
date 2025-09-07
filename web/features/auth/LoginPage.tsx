
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, LoginFormData } from './authSchemas';
import { useLogin } from './useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              crie uma nova conta
            </Link>
          </p>
        </div>
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Senha"
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              error={errors.password?.message}
            />
            <div>
              <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
                Entrar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
