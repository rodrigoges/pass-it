import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

const API_BASE = 'http://localhost:8080/passit';

export const ProfilePage: React.FC = () => {
  const { user, token } = useAuthStore();
  let userId = user?.id;
  if (!userId && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.userId;
    } catch (err) {
      
    }
  }

  const isUserReady = !!userId && !!token;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isUserReady) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { getUserById } = await import('../auth/getUserById');
        const userData = await getUserById(userId);
        setForm(userData);
        setLoading(false);
      } catch (err) {
        console.error('[ProfilePage] Erro ao carregar dados do perfil:', err);
        setError('Erro ao carregar dados do perfil');
        setLoading(false);
      }
    };
    fetchUser();
  }, [isUserReady, userId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      setForm((prev: any) => ({
        ...prev,
        address: {
          ...prev.address,
          [name.replace('address.', '')]: value,
        },
      }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updateData = { ...form, id: form.id || user?.id || userId };
      await fetch(`${API_BASE}/users/${updateData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      setSaving(false);
    } catch {
      setError('Erro ao salvar dados');
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!userId) return <p className="text-center">Nenhum usuário logado.</p>;
  if (!form) return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      <p className="text-center">Carregando dados do perfil...</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CPF</label>
          <input name="nationalIdentifier" value={form.nationalIdentifier} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Usuário</label>
          <input name="userType" value={form.userType} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
          <input name="address.street" value={form.address?.street || ''} onChange={handleChange} placeholder="Rua" className="w-full border rounded px-3 py-2 mb-2" />
          <input name="address.city" value={form.address?.city || ''} onChange={handleChange} placeholder="Cidade" className="w-full border rounded px-3 py-2 mb-2" />
          <input name="address.state" value={form.address?.state || ''} onChange={handleChange} placeholder="Estado" className="w-full border rounded px-3 py-2 mb-2" />
          <input name="address.zipCode" value={form.address?.zipCode || ''} onChange={handleChange} placeholder="CEP" className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;
