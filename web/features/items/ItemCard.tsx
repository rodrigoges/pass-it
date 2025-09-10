
import React from 'react';
import { Link } from 'react-router-dom';
import { Item, ItemCategory, ItemStatus } from '../../api/types';
import { Card } from '../../components/ui/Card';
import { formatDate } from '../../lib/utils';

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
  
  const defaultImageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMjAwTDE1MCAxNTBMMjAwIDE4MEwyNTAgMTMwTDMwMCAyMDBIMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
  const imageUrl = item.imageUrl && !imageError ? item.imageUrl : defaultImageUrl;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Card className="flex flex-col h-full group transition-shadow duration-300 hover:shadow-xl">
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
    </Card>
  );
};
