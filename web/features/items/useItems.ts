
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { Item, PaginatedResponse } from '../../api/types';

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
  console.log('🔍 Buscando itens com parâmetros:', params);
  
  try {
    const { data } = await apiClient.get<any>('/items', { params });
    console.log('📦 Resposta da API:', data);
    
    // Retornar a estrutura da API diretamente
    const mappedData = {
      items: data.items || [],
      totalNumberOfRecords: data.totalNumberOfRecords || 0,
      offset: params.offset || 0,
      limit: params.limit || 12
    };
    
    console.log('🔄 Dados mapeados:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('❌ Erro ao buscar itens:', error);
    throw error;
  }
};

export const useItems = (params: GetItemsParams) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => getItems(params),
  });
};

const getItem = async (itemId: string): Promise<Item> => {
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
