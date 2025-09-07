
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useItems } from '../items/useItems';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  
  // Example data fetching - replace with real requisition/user counts later
  const { data: itemsData, isLoading: isLoadingItems } = useItems({ 
    limit: 5, 
    offset: 0, 
    sort: 'TITLE', 
    order: 'ASC' 
  });

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-lg text-gray-600">Bem-vindo(a) de volta, {user.name}!</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Example Stats Cards */}
        <Card className="p-5">
            <h3 className="text-base font-medium text-gray-500">Itens Doados</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">12</p>
        </Card>
        <Card className="p-5">
            <h3 className="text-base font-medium text-gray-500">Solicitações Abertas</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">3</p>
        </Card>
        <Card className="p-5">
            <h3 className="text-base font-medium text-gray-500">Itens Recebidos</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">7</p>
        </Card>
         <Card className="p-5">
            <h3 className="text-base font-medium text-gray-500">Sua Reputação</h3>
            <p className="mt-1 text-3xl font-semibold text-green-600">Excelente</p>
        </Card>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800">Últimos Itens Cadastrados</h2>
        <Card className="mt-4">
          {isLoadingItems ? <Spinner /> : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {itemsData?.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

    </div>
  );
};

export default DashboardPage;
