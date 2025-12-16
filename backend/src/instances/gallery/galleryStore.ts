/**
 * @summary
 * In-memory store instance for Gallery entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/gallery/galleryStore
 */

import { GALLERY_DEFAULTS, GALLERY_LIMITS } from '@/constants/gallery';
import {
  GalleryDisplayMode,
  ImageResolution,
  ImageCategory,
  ZoomLevel,
  RotationDirection,
  ConnectionSpeed,
} from '@/constants';

/**
 * Gallery record structure
 */
export interface GalleryRecord {
  id: string;
  productId: string;
  mainImageUrl: string;
  totalImages: number;
  currentImageIndex: number;
  currentVariationId: string | null;
  displayMode: GalleryDisplayMode;
}

/**
 * Gallery image record structure
 */
export interface GalleryImageRecord {
  id: string;
  galleryId: string;
  thumbnailUrl: string;
  fullSizeUrl: string;
  displayOrder: number;
  isActive: boolean;
  imageCategory: ImageCategory;
  lazyLoadPriority: number;
  captionText: string | null;
  detailedDescription: string | null;
  showCaption: boolean;
  resolutionUrls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
}

/**
 * Product variation record structure
 */
export interface ProductVariationRecord {
  id: string;
  productId: string;
  variationName: string;
  variationType: 'cor' | 'acabamento' | 'material' | 'textura';
  colorCode: string | null;
  isDefault: boolean;
}

/**
 * In-memory store for Gallery records
 */
class GalleryStore {
  private galleries: Map<string, GalleryRecord> = new Map();
  private images: Map<string, GalleryImageRecord> = new Map();
  private variations: Map<string, ProductVariationRecord> = new Map();

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Get next available ID
   */
  getNextId(): string {
    return this.generateUUID();
  }

  /**
   * Get gallery by product ID
   */
  getByProductId(productId: string): GalleryRecord | undefined {
    return Array.from(this.galleries.values()).find((g) => g.productId === productId);
  }

  /**
   * Get gallery by ID
   */
  getById(id: string): GalleryRecord | undefined {
    return this.galleries.get(id);
  }

  /**
   * Add new gallery
   */
  addGallery(gallery: GalleryRecord): GalleryRecord {
    this.galleries.set(gallery.id, gallery);
    return gallery;
  }

  /**
   * Update gallery
   */
  updateGallery(id: string, data: Partial<GalleryRecord>): GalleryRecord | undefined {
    const existing = this.galleries.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.galleries.set(id, updated);
    return updated;
  }

  /**
   * Get images by gallery ID
   */
  getImagesByGalleryId(galleryId: string, variationId?: string): GalleryImageRecord[] {
    const allImages = Array.from(this.images.values()).filter((img) => img.galleryId === galleryId);

    // If variation is specified, filter images (in real implementation, would check image-variation relationship)
    // For now, return all images sorted by display order and lazy load priority
    return allImages.sort((a, b) => {
      if (a.lazyLoadPriority !== b.lazyLoadPriority) {
        return a.lazyLoadPriority - b.lazyLoadPriority;
      }
      return a.displayOrder - b.displayOrder;
    });
  }

  /**
   * Get image by ID
   */
  getImageById(id: string): GalleryImageRecord | undefined {
    return this.images.get(id);
  }

  /**
   * Add new image
   */
  addImage(image: GalleryImageRecord): GalleryImageRecord {
    const gallery = this.galleries.get(image.galleryId);
    if (!gallery) {
      throw new Error('Gallery not found');
    }

    const currentImages = this.getImagesByGalleryId(image.galleryId);
    if (currentImages.length >= GALLERY_DEFAULTS.MAX_IMAGES) {
      throw new Error('Maximum images limit reached for this gallery');
    }

    this.images.set(image.id, image);

    // Update gallery total images
    gallery.totalImages = currentImages.length + 1;
    this.galleries.set(gallery.id, gallery);

    return image;
  }

  /**
   * Update image
   */
  updateImage(id: string, data: Partial<GalleryImageRecord>): GalleryImageRecord | undefined {
    const existing = this.images.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.images.set(id, updated);
    return updated;
  }

  /**
   * Delete image
   */
  deleteImage(id: string): boolean {
    const image = this.images.get(id);
    if (!image) {
      return false;
    }

    this.images.delete(id);

    // Update gallery total images
    const gallery = this.galleries.get(image.galleryId);
    if (gallery) {
      const currentImages = this.getImagesByGalleryId(image.galleryId);
      gallery.totalImages = currentImages.length;
      this.galleries.set(gallery.id, gallery);
    }

    return true;
  }

  /**
   * Get variations by product ID
   */
  getVariationsByProductId(productId: string): ProductVariationRecord[] {
    return Array.from(this.variations.values()).filter((v) => v.productId === productId);
  }

  /**
   * Get variation by ID
   */
  getVariationById(id: string): ProductVariationRecord | undefined {
    return this.variations.get(id);
  }

  /**
   * Add new variation
   */
  addVariation(variation: ProductVariationRecord): ProductVariationRecord {
    this.variations.set(variation.id, variation);
    return variation;
  }

  /**
   * Calculate lazy load priority based on category
   */
  calculateLazyLoadPriority(category: ImageCategory): number {
    const priorityMap: Record<ImageCategory, number> = {
      frontal: 1,
      lateral: 2,
      detalhes: 3,
      ambiente: 4,
      perspectiva: 5,
    };
    return priorityMap[category] || 5;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.galleries.clear();
    this.images.clear();
    this.variations.clear();
  }
}

/**
 * Singleton instance of GalleryStore
 */
export const galleryStore = new GalleryStore();
