import apiClient from '../../api/client';
import { User } from '../../api/types';

export const getUserById = async (id: string): Promise<User> => {
  const { data } = await apiClient.get<User>(`/users/${id}`);
  return data;
};
