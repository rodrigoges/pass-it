
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema, RegisterFormData } from './authSchemas';
import { useRegister as useRegisterMutation } from './useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { UserType } from '../../api/types';

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const registerMutation = useRegisterMutation();

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Faça o login
            </Link>
          </p>
        </div>
        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nome Completo" {...register('name')} error={errors.name?.message} />
                <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                <Input label="Senha" type="password" {...register('password')} error={errors.password?.message} />
                <Input label="CPF ou CNPJ" {...register('nationalIdentifier')} error={errors.nationalIdentifier?.message} />
                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700">Tipo de Usuário</label>
                  <select id="userType" {...register('userType')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                    <option value={UserType.DONOR}>Doador</option>
                    <option value={UserType.REQUESTER}>Solicitante</option>
                    <option value={UserType.INSTITUTION}>Instituição</option>
                  </select>
                  {errors.userType && <p className="mt-2 text-sm text-red-600">{errors.userType.message}</p>}
                </div>
            </div>
            <fieldset className="mt-6">
                <legend className="text-base font-medium text-gray-900">Endereço</legend>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-4">
                        <Input label="Rua" {...register('address.street')} error={errors.address?.street?.message} />
                    </div>
                     <div className="sm:col-span-2">
                        <Input label="Cidade" {...register('address.city')} error={errors.address?.city?.message} />
                    </div>
                     <div className="sm:col-span-2">
                        <Input label="Estado (UF)" {...register('address.state')} error={errors.address?.state?.message} />
                    </div>
                     <div className="sm:col-span-2">
                        <Input label="CEP" {...register('address.zipCode')} error={errors.address?.zipCode?.message} />
                    </div>
                </div>
            </fieldset>

            <div>
              <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
                Cadastrar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
