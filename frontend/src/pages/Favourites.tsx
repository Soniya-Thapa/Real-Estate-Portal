import React, { useEffect, useState } from 'react';
import type { Property } from '../types';
import { favouriteApi } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { Alert } from '../components/Alert';
import { Loader2, Heart } from 'lucide-react';

export const Favourites: React.FC = () => {
  const [favourites, setFavourites] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavourites = async () => {
    try {
      setIsLoading(true);
      const data = await favouriteApi.getMyFavourites();
      setFavourites(data);
    } catch (err) {
      setError('Failed to load favourites');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleFavouriteChange = (propertyId: string, isFavourite: boolean) => {
    if (!isFavourite) {
      setFavourites(prev => prev.filter(p => p.id !== propertyId));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favourites</h1>
        <p className="text-gray-600">
          You have {favourites.length} saved {favourites.length === 1 ? 'property' : 'properties'}
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {favourites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favourites yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Start browsing properties and click the heart icon to save your favourites here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((property) => (
            <PropertyCard
              key={property.id}
              property={{ ...property, is_favourite: true }}
              onFavouriteChange={(isFavourite) => handleFavouriteChange(property.id, isFavourite)}
            />
          ))}
        </div>
      )}
    </div>
  );
};