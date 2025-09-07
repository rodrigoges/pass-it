
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useItems } from './useItems';
import { ItemCard } from './ItemCard';
import { Spinner } from '../../components/ui/Spinner';
import { ItemCategory, ItemStatus } from '../../api/types';
import { Button } from '../../components/ui/Button';

const ItemsCatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 12;
  const offset = (page - 1) * limit;

  const filters = {
    limit,
    offset,
    sort: searchParams.get('sort') || 'TITLE',
    order: (searchParams.get('order') as 'ASC' | 'DESC') || 'DESC',
    title: searchParams.get('title') || undefined,
    category: searchParams.get('category') || undefined,
    status: searchParams.get('status') || undefined,
  };

  const { data, isLoading, isError } = useItems(filters);

  // Debug logs
  console.log('🎯 ItemsCatalogPage - Estado:', { data, isLoading, isError });
  console.log('🎯 ItemsCatalogPage - Filtros:', filters);

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams(prev => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      prev.set('page', '1');
      return prev;
    });
  };
  
  const totalPages = data ? Math.ceil(data.totalNumberOfRecords / limit) : 0;

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Catálogo de Doações</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">Encontre itens doados pela comunidade e faça a sua parte.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-wrap gap-4 items-center">
        <input
            type="text"
            placeholder="Buscar por título..."
            defaultValue={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        <select onChange={(e) => handleFilterChange('category', e.target.value)} defaultValue={filters.category} className="border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <option value="">Todas as Categorias</option>
            {Object.values(ItemCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
         <select onChange={(e) => handleFilterChange('status', e.target.value)} defaultValue={filters.status} className="border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <option value="">Todos os Status</option>
            <option key={ItemStatus.AVAILABLE} value={ItemStatus.AVAILABLE}>Disponível</option>
            <option key={ItemStatus.RESERVED} value={ItemStatus.RESERVED}>Reservado</option>
        </select>
      </div>

      {isLoading && <Spinner />}
      
      {isError && <p className="text-center text-red-500">Falha ao carregar os itens.</p>}
      
      {!isLoading && !isError && data?.items && data.items.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">Nenhum item encontrado</h3>
          <p className="text-gray-500 mt-2">Tente ajustar os filtros ou volte mais tarde.</p>
        </div>
      )}

      {!isLoading && !isError && data?.items && data.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data.items.map((item, index) => <ItemCard key={index} item={item} index={index} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 space-x-2">
           <Button onClick={() => handleFilterChange('page', String(page - 1))} disabled={page <= 1}>
              Anterior
           </Button>
           <span className="text-gray-700">Página {page} de {totalPages}</span>
            <Button onClick={() => handleFilterChange('page', String(page + 1))} disabled={page >= totalPages}>
              Próxima
           </Button>
        </div>
      )}
    </div>
  );
};

export default ItemsCatalogPage;
