
import React from 'react';
import { useParams } from 'react-router-dom';
import { useItem } from './useItems';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/utils';
import { ItemCategory, ItemStatus } from '../../api/types';
import { useAuthStore } from '../../store/authStore';

const ItemDetailPage: React.FC = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const { data: item, isLoading, isError } = useItem(itemId!);
    const { user } = useAuthStore();

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

    const imageUrl = item.imageUrl || `https://picsum.photos/seed/${item.id}/800/600`;

    const canRequest = user && (user.userType === 'REQUESTER' || user.userType === 'INSTITUTION') && item.status === 'AVAILABLE';

    const handleRequest = () => {
      // POST /requisitions would be called here via a mutation
      alert(`Solicitação para "${item.title}" enviada!`);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                    <img src={imageUrl} alt={item.title} className="w-full h-full object-cover"/>
                </div>
                <div className="p-8 flex flex-col">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                            {categoryTranslations[item.category] || item.category}
                        </span>
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}>
                            {statusTranslations[item.status] || item.status}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">{item.title}</h1>
                    <div className="mt-4 text-sm text-gray-500">
                        <p>Doador: <span className="font-medium text-gray-700">{item.donor.name}</span></p>
                        <p>Publicado em: <span className="font-medium text-gray-700">{formatDate(item.createdAt)}</span></p>
                    </div>
                    <p className="mt-6 text-gray-700 leading-relaxed flex-grow">{item.description}</p>
                    
                    {canRequest && (
                        <div className="mt-8">
                            <Button onClick={handleRequest} className="w-full" size="lg">
                                Solicitar Item
                            </Button>
                        </div>
                    )}
                     {!user && (
                        <div className="mt-8 text-center bg-gray-100 p-4 rounded-md">
                           <p className="text-gray-700">Faça login como Solicitante ou Instituição para requisitar este item.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemDetailPage;
