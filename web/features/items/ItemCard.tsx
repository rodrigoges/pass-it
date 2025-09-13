
import React from 'react';
import { Link } from 'react-router-dom';
import { Item, ItemCategory, ItemStatus } from '../../api/types';
import { Card } from '../../components/ui/Card';
import { formatDate } from '../../lib/utils';
import { TrashIcon } from '../../components/ui/TrashIcon';
import { Modal } from '../../components/ui/Modal';
import { useAuthStore } from '../../store/authStore';

interface ItemCardProps {
  item: Item;
  index?: number;
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

export const ItemCard: React.FC<ItemCardProps> = ({ item, index = 0 }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const defaultImageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMjAwTDE1MCAxNTBMMjAwIDE4MEwyNTAgMTMwTDMwMCAyMDBIMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
  const imageUrl = item.imageUrl && !imageError ? item.imageUrl : defaultImageUrl;
  const { token } = useAuthStore();

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`http://localhost:8080/passit/items/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      window.location.reload(); // ou atualizar lista via callback
    } catch (e) {
      // erro ao deletar
    }
    setDeleting(false);
    setModalOpen(false);
  };

  return (
    <Card className="flex flex-col h-full group transition-shadow duration-300 hover:shadow-xl relative">
      <Link to={`/items/${item.id}`} className="block">
        <div className="aspect-w-16 aspect-h-9 relative">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Carregando...</div>
            </div>
          )}
          <img 
            className="object-cover w-full h-48" 
            src={imageUrl} 
            alt={item.title}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
          {token && (
            <button
              type="button"
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-red-100"
              onClick={e => { e.preventDefault(); setModalOpen(true); }}
              title="Excluir item"
            >
              <TrashIcon className="w-5 h-5 text-red-600" />
            </button>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                {categoryTranslations[item.category] || item.category}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
              {statusTranslations[item.status] || item.status}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-primary-700">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-grow">
            {item.description}
          </p>
        </div>
      </Link>
      <Modal isOpen={modalOpen} title="Confirmar exclusão" onClose={() => setModalOpen(false)}>
        <div className="mb-4">Deseja realmente excluir este item?</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={() => setModalOpen(false)}
            disabled={deleting}
          >Não</button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={deleting}
          >{deleting ? 'Excluindo...' : 'Sim'}</button>
        </div>
      </Modal>
    </Card>
  );
};
