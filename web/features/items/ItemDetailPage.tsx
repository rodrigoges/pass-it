
import React from 'react';
import { useParams } from 'react-router-dom';
import { useItem } from './useItems';
import { Spinner } from '../../components/ui/Spinner';
import { CreateItemForm } from './CreateItemForm';
import { formatDate } from '../../lib/utils';
import { ItemCategory, ItemStatus } from '../../api/types';
import { useAuthStore } from '../../store/authStore';

const ItemDetailPage: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const { data: item, isLoading, isError } = useItem(itemId || '');
    const { user } = useAuthStore();

    // Verificar se o itemId é válido
    if (!itemId || itemId === 'undefined') {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-gray-700">ID do item inválido</h2>
                <p className="text-gray-500 mt-2">O item solicitado não foi encontrado.</p>
            </div>
        );
    }

    const categoryTranslations: Record<ItemCategory, string> = {
        [ItemCategory.CLOTHES]: 'Roupas',
        [ItemCategory.FOOD]: 'Alimentos',
        [ItemCategory.FURNITURE]: 'Móveis',
        [ItemCategory.TOYS]: 'Brinquedos',
        [ItemCategory.OTHER]: 'Outros',
    };

    const statusColors: Record<ItemStatus, string> = {
        [ItemStatus.AVAILABLE]: 'bg-green-100 text-green-800',
        [ItemStatus.RESERVED]: 'bg-yellow-100 text-yellow-800',
        [ItemStatus.DONATED]: 'bg-gray-100 text-gray-800',
    };

    const statusTranslations: Record<ItemStatus, string> = {
        [ItemStatus.AVAILABLE]: 'Disponível',
        [ItemStatus.RESERVED]: 'Reservado',
        [ItemStatus.DONATED]: 'Doado',
    }
    
    if (isLoading) return <Spinner />;
    if (isError || !item) return <p className="text-center text-red-500">Item não encontrado.</p>;

    // Preparar dados iniciais para o formulário
    const initialData = {
        title: item.title,
        description: item.description,
        category: item.category,
        imageUrl: item.imageUrl || '',
        status: item.status,
    };

    return (
        <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                    Detalhes do Item
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Visualize as informações do item selecionado.
                </p>
            </div>

            <CreateItemForm 
                initialData={initialData}
                id={item.id}
                title="Editar Item"
            />
        </div>
    );
};

export default ItemDetailPage;
