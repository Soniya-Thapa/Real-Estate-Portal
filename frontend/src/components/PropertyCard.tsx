import React, { useState } from 'react';
import type { Property } from '../types';
import { favouriteApi } from '../services/api';

interface PropertyCardProps {
  property: Property;
  onFavouriteChange?: (isFavourite: boolean) => void; 
  showFavouriteButton?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavouriteChange,
  showFavouriteButton = true,
}) => {
  const [isFavourite, setIsFavourite] = useState(property.is_favourite);
  const [isLoading, setIsLoading] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);

  const handleFavouriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFavourite) {
        await favouriteApi.removeFavourite(property.id);
        setIsFavourite(false);
        onFavouriteChange?.(false); // pass false
      } else {
        await favouriteApi.addFavourite(property.id);
        setIsFavourite(true);
        setAnimateHeart(true);
        setTimeout(() => setAnimateHeart(false), 500);
        onFavouriteChange?.(true); // pass true
      }
    } catch (error) {
      console.error('Failed to update favourite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden group">

      <div className="relative">
        <img
          src={property.image_url}
          alt={property.title}
          className="h-52 w-full object-cover group-hover:scale-110 transition"
        />

        {showFavouriteButton && (
          <button
            onClick={handleFavouriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
              animateHeart ? 'scale-125' : 'scale-100'
            } ${isFavourite ? 'bg-red-500 text-white' : 'bg-white/70'}`}
          >
            ❤️
          </button>
        )}
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold">{property.title}</h3>

        <p className="text-gray-500 text-sm line-clamp-2">
          {property.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-primary-600 font-bold text-lg">
            ${property.price}
          </span>
          <span className="text-xs text-gray-400">
            {property.location}
          </span>
        </div>
      </div>

    </div>
  );
};