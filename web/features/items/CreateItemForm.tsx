import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createItemSchema, CreateItemFormData } from './itemSchemas';
import { useCreateItem } from './useItems';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ItemCategory } from '../../api/types';
import { useAuthStore } from '../../store/authStore';

interface CreateItemFormProps {
  onSuccess?: () => void;
  initialData?: {
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
  };
  readOnly?: boolean;
  title?: string;
}

export const CreateItemForm: React.FC<CreateItemFormProps> = ({ 
  onSuccess, 
  initialData, 
  readOnly = false, 
  title = "Cadastrar Novo Item" 
}) => {
  const createItemMutation = useCreateItem();
  const { token, user } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: CreateItemFormData) => {
    // Se estiver em modo somente leitura, não fazer nada
    if (readOnly) {
      return;
    }

    // Verificar se o usuário está autenticado
    if (!token || !user) {
      console.error('❌ Usuário não autenticado');
      return;
    }

    try {
      await createItemMutation.mutateAsync({
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: data.imageUrl || undefined,
      });
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar item:', error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <Input
              id="title"
              type="text"
              {...register('title')}
              placeholder="Digite o título do item"
              className={`border-gray-300 ${errors.title ? 'border-red-500' : ''}`}
              readOnly={readOnly}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              placeholder="Descreva o item em detalhes"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.description ? 'border-red-500' : ''
              }`}
              readOnly={readOnly}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              id="category"
              {...register('category')}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.category ? 'border-red-500' : ''
              }`}
              disabled={readOnly}
            >
              <option value="">Selecione uma categoria</option>
              {Object.values(ItemCategory).map((category) => (
                <option key={category} value={category}>
                  {category === 'CLOTHES' && 'Roupas'}
                  {category === 'FOOD' && 'Alimentos'}
                  {category === 'TOYS' && 'Brinquedos'}
                  {category === 'FURNITURE' && 'Móveis'}
                  {category === 'OTHER' && 'Outros'}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem (opcional)
            </label>
            <Input
              id="imageUrl"
              type="url"
              {...register('imageUrl')}
              placeholder="https://exemplo.com/imagem.jpg"
              className={`border-gray-300 ${errors.imageUrl ? 'border-red-500' : ''}`}
              readOnly={readOnly}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
            )}
          </div>

          {!readOnly && (
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => reset()}
                disabled={createItemMutation.isPending}
              >
                Limpar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createItemMutation.isPending}
              >
                {createItemMutation.isPending ? 'Cadastrando...' : 'Cadastrar Item'}
              </Button>
            </div>
          )}

          {createItemMutation.isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                Erro ao cadastrar item. Verifique se você está logado e tente novamente.
              </p>
              <p className="text-xs text-red-500 mt-1">
                Se o problema persistir, verifique o console do navegador para mais detalhes.
              </p>
            </div>
          )}

          {createItemMutation.isSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">
                Item cadastrado com sucesso!
              </p>
            </div>
          )}
        </form>
      </div>
    </Card>
  );
};
