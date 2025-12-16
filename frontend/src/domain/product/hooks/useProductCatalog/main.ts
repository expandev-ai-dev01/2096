import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import type { CatalogFilters } from '../../types/models';

export interface UseProductCatalogOptions {
  filters?: CatalogFilters;
  enabled?: boolean;
}

export const useProductCatalog = (options: UseProductCatalogOptions = {}) => {
  const { filters, enabled = true } = options;

  const queryKey = ['products', 'catalog', filters];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => productService.catalog(filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    catalog: data,
    products: data?.products ?? [],
    totalCount: data?.totalProductsCount ?? 0,
    pagination: data?.pagination,
    infiniteScroll: data?.infiniteScroll,
    isLoading,
    error,
    refetch,
  };
};
