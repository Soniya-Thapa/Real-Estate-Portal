import React, { useEffect, useState } from 'react';
import type { Property } from '../types';
import { propertyApi } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { Alert } from '../components/Alert';
import { Loader2, Search } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyApi.getAll();
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Update favourite locally — no refetch, no scroll jump
  const handleFavouriteChange = (propertyId: string, isFavourite: boolean) => {
    setProperties(prev =>
      prev.map(p => p.id === propertyId ? { ...p, is_favourite: isFavourite } : p)
    );
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Properties</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or location..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onFavouriteChange={(isFavourite) => handleFavouriteChange(property.id, isFavourite)}
            />
          ))}
        </div>
      )}
    </div>
  );
};