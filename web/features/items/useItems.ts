
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { Item, PaginatedResponse } from '../../api/types';
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
  console.log('🔍 Buscando itens com parâmetros:', params);
  
  // Debug: verificar se há token
  const { token } = useAuthStore.getState();
  console.log('🔑 Token disponível:', token ? 'Sim' : 'Não');
  
  try {
    // Tentar primeiro com cliente autenticado, depois sem autenticação
    let response;
    try {
      response = await apiClient.get<any>('/items', { params });
    } catch (authError) {
      console.log('🔒 Falha com autenticação, tentando sem token...');
      // Se falhar com autenticação, tentar sem token
      response = await axios.get('http://localhost:8080/passit/items', { params });
    }
    
    const { data } = response;
    console.log('📦 Resposta da API:', data);
    
    // A API retorna um array simples, não um objeto com items
    const items = Array.isArray(data) ? data : (data.items || []);
    const totalNumberOfRecords = data.totalNumberOfRecords || items.length;
    
    const mappedData = {
      items: items,
      totalNumberOfRecords: totalNumberOfRecords,
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
  const query = useQuery({
    queryKey: ['items', params],
    queryFn: () => getItems(params),
  });
  
  console.log('🔍 useItems - Estado da query:', {
    isLoading: query.isLoading,
    isError: query.isError,
    data: query.data,
    error: query.error
  });
  
  return query;
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
