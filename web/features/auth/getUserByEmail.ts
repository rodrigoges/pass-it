import apiClient from '../../api/client';
import { User } from '../../api/types';

export const getUserByEmail = async (email: string): Promise<User> => {
  const { data } = await apiClient.get<User>(`/users/email/${email}`);
  return data;
};
