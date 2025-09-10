import { z } from 'zod';
import { ItemCategory } from '../../api/types';

export const createItemSchema = z.object({
  title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  category: z.nativeEnum(ItemCategory, {
    errorMap: () => ({ message: 'Selecione uma categoria válida' })
  }),
  imageUrl: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
});

export type CreateItemFormData = z.infer<typeof createItemSchema>;
