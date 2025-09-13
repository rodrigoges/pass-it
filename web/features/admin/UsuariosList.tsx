import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { User } from '../../api/types';
import { Spinner } from '../../components/ui/Spinner';
import { TrashIcon } from '../../components/ui/TrashIcon';
import { useAuthStore } from '../../store/authStore';

const UsuariosList: React.FC = () => {
  const { user: loggedUser, token } = useAuthStore();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        console.log('[UsuariosList] Fazendo chamada para /users');
        const { data } = await apiClient.get<{ users: User[]; totalNumberOfRecords: number }>(
          '/users?limit=25&offset=0&sort=NAME&order=DESC'
        );
        console.log('[UsuariosList] Dados recebidos:', data);
        setUsuarios(data.users);
      } catch (err) {
        console.error('[UsuariosList] Erro ao carregar usuários:', err);
        setError('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const handleRemove = async (id: string) => {
    if (!token) return;
    setRemovingId(id);
    try {
      await apiClient.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert('Erro ao remover usuário');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuários</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosList;
