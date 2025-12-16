import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../../services/galleryService';
import type { GalleryFilters } from '../../types/models';

export interface UseGalleryOptions {
  filters: GalleryFilters;
  enabled?: boolean;
}

export const useGallery = (options: UseGalleryOptions) => {
  const { filters, enabled = true } = options;

  const queryKey = ['gallery', filters.productId, filters.variationId];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => galleryService.get(filters.productId, filters.variationId),
    enabled,
    staleTime: 1000 * 60 * 5,
  });

  return {
    gallery: data?.gallery,
    images: data?.images ?? [],
    variations: data?.variations ?? [],
    isLoading,
    error,
    refetch,
  };
};
