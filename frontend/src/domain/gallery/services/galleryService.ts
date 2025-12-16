import { authenticatedClient } from '@/core/lib/api';
import type { Gallery, GalleryImage, ProductVariation } from '../types/models';

/**
 * @service GalleryService
 * @domain gallery
 * @type REST
 */
export const galleryService = {
  /**
   * Get gallery data with images and variations
   */
  async get(
    productId: string,
    variationId?: string
  ): Promise<{
    gallery: Gallery;
    images: GalleryImage[];
    variations: ProductVariation[];
  }> {
    const { data } = await authenticatedClient.get<{
      success: boolean;
      data: {
        gallery: Gallery;
        images: GalleryImage[];
        variations: ProductVariation[];
      };
    }>('/gallery', {
      params: { productId, variationId },
    });
    return data.data;
  },
};
