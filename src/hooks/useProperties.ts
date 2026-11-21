import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/lib/api';
import type { Property } from '@/types/property';

interface ApiResponse<T> {
  success?: boolean;
  data: T;
  count?: number;
  message?: string;
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<Property[]> | Property[]>('/api/properties');
      if (Array.isArray(response)) {
        setProperties(response);
      } else if (response && Array.isArray(response.data)) {
        setProperties(response.data);
      } else {
        setProperties([]);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching real estate properties.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
  };
}
