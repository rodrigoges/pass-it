
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { Item, PaginatedResponse, ItemStatus } from '../../api/types';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

interface GetItemsParams {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  title?: string;
  category?: string;
  status?: string;
}

const getItems = async (params: GetItemsParams): Promise<PaginatedResponse<Item>> => {
  try {
    // Tentar primeiro com cliente autenticado, depois sem autenticação
    let response;
    try {
      response = await apiClient.get<any>('/items', { params });
    } catch (authError) {
      // Se falhar com autenticação, tentar sem token
      response = await axios.get('http://localhost:8080/passit/items', { params });
    }
    
    const { data } = response;
    
    // Debug: verificar estrutura dos dados
    console.log('🔍 Dados recebidos da API:', data);
    console.log('🔍 Primeiro item:', data?.items?.[0]);
    console.log('🔍 ID do primeiro item:', data?.items?.[0]?.id);
    
    // A API retorna um objeto com items e totalNumberOfRecords
    const items = data.items || [];
    const totalNumberOfRecords = data.totalNumberOfRecords || items.length;
    
    const mappedData = {
      items: items,
      totalNumberOfRecords: totalNumberOfRecords,
      offset: params.offset || 0,
      limit: params.limit || 12
    };
    
    return mappedData;
  } catch (error) {
    console.error('❌ Erro ao buscar itens:', error);
    throw error;
  }
};

export const useItems = (params: GetItemsParams) => {
  const query = useQuery({
    queryKey: ['items', params],
    queryFn: () => getItems(params),
  });
  
  return query;
};

const getItem = async (itemId: string): Promise<Item> => {
    if (!itemId || itemId === 'undefined') {
        throw new Error('Item ID é obrigatório');
    }
    const { data } = await apiClient.get<Item>(`/items/${itemId}`);
    return data;
};

export const useItem = (itemId: string) => {
    return useQuery({
        queryKey: ['item', itemId],
        queryFn: () => getItem(itemId),
        enabled: !!itemId,
    });
};

const createItem = async (itemData: { title: string; description: string; category: string; imageUrl?: string }): Promise<Item> => {
    // Preparar dados para envio
    const payload = {
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        status: ItemStatus.AVAILABLE, // Adicionar status AVAILABLE por padrão
        ...(itemData.imageUrl && { imageUrl: itemData.imageUrl })
    };
    
    try {
        const response = await apiClient.post<Item>('/items', payload);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao criar item:', error);
        throw error;
    }
};

export const useCreateItem = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createItem,
        onSuccess: () => {
            // Invalidar a query de itens para atualizar a lista
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};
