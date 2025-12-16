import { authenticatedClient } from '@/core/lib/api';
import type { CatalogFilters, CatalogResponse, Product } from '../types/models';

/**
 * @service ProductService
 * @domain product
 * @type REST
 */
export const productService = {
  /**
   * Fetch catalog with filters
   */
  async catalog(filters?: CatalogFilters): Promise<CatalogResponse> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: CatalogResponse }>(
      '/product',
      { params: filters }
    );
    return data.data;
  },

  /**
   * Record product interaction
   */
  async recordInteraction(
    productId: string,
    interactionType: 'view' | 'click' | 'interaction'
  ): Promise<void> {
    await authenticatedClient.post('/product/interaction', {
      productId,
      interactionType,
    });
  },

  /**
   * Get single product by ID
   */
  async getById(id: string): Promise<Product> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: Product }>(
      `/product/${id}`
    );
    return data.data;
  },
};
