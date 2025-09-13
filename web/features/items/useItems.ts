const updateItem = async (itemId: string, itemData: { title: string; description: string; category: string; imageUrl?: string; status: ItemStatus }): Promise<Item> => {
  if (!itemId) throw new Error('Item ID é obrigatório para atualização');
  const payload = {
    title: itemData.title,
    description: itemData.description,
    category: itemData.category,
    imageUrl: itemData.imageUrl ?? null,
    status: itemData.status ?? ItemStatus.AVAILABLE,
  };
  try {
  const response = await apiClient.put<Item>(`/items/${itemId}`, payload);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar item:', error);
    throw error;
  }
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, itemData }: { itemId: string; itemData: { title: string; description: string; category: string; imageUrl?: string; status: ItemStatus } }) => updateItem(itemId, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

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
    let response;
    try {
      response = await apiClient.get<any>('/items', { params });
    } catch (authError) {
      response = await axios.get('http://localhost:8080/passit/items', { params });
    }
    
    const { data } = response;

    const items = (data.items || []).map((item: any) => ({
        ...item,
        id: item.itemId
    }));
    const totalNumberOfRecords = data.totalNumberOfRecords || items.length;
    
    const mappedData: PaginatedResponse<Item> = {
      data: items,
      total: totalNumberOfRecords,
      offset: params.offset || 0,
      limit: params.limit || 12
    };
    
    return mappedData;
  } catch (error) {
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
  return { ...data, id: (data as any).itemId };
};

export const useItem = (itemId: string) => {
    return useQuery({
        queryKey: ['item', itemId],
        queryFn: () => getItem(itemId),
        enabled: !!itemId,
    });
};

const createItem = async (itemData: { title: string; description: string; category: string; imageUrl?: string }): Promise<Item> => {
    const payload = {
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        status: ItemStatus.AVAILABLE,
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
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });
};
