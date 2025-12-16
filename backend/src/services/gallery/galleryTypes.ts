/**
 * @summary
 * Type definitions for Gallery entity.
 *
 * @module services/gallery/galleryTypes
 */

import {
  GalleryDisplayMode,
  ImageResolution,
  ImageCategory,
  ZoomLevel,
  RotationDirection,
  ConnectionSpeed,
} from '@/constants';

/**
 * @interface GalleryEntity
 * @description Represents a gallery entity
 */
export interface GalleryEntity {
  id: string;
  productId: string;
  mainImageUrl: string;
  totalImages: number;
  currentImageIndex: number;
  currentVariationId: string | null;
  displayMode: GalleryDisplayMode;
}

/**
 * @interface GalleryImageEntity
 * @description Represents a gallery image entity
 */
export interface GalleryImageEntity {
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
 * @interface ProductVariationEntity
 * @description Represents a product variation entity
 */
export interface ProductVariationEntity {
  id: string;
  productId: string;
  variationName: string;
  variationType: 'cor' | 'acabamento' | 'material' | 'textura';
  colorCode: string | null;
  isDefault: boolean;
}

/**
 * @interface GalleryGetRequest
 * @description Request parameters for getting gallery
 */
export interface GalleryGetRequest {
  productId: string;
  variationId?: string;
}

/**
 * @interface GalleryGetResponse
 * @description Response structure for gallery retrieval
 */
export interface GalleryGetResponse {
  gallery: GalleryEntity;
  images: GalleryImageEntity[];
  variations: ProductVariationEntity[];
}

/**
 * @interface GalleryImageCreateRequest
 * @description Request payload for creating gallery image
 */
export interface GalleryImageCreateRequest {
  galleryId: string;
  thumbnailUrl: string;
  fullSizeUrl: string;
  displayOrder: number;
  imageCategory: ImageCategory;
  captionText?: string | null;
  detailedDescription?: string | null;
  resolutionUrls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
}

/**
 * @interface GalleryImageUpdateRequest
 * @description Request payload for updating gallery image
 */
export interface GalleryImageUpdateRequest {
  displayOrder?: number;
  imageCategory?: ImageCategory;
  captionText?: string | null;
  detailedDescription?: string | null;
  showCaption?: boolean;
}

/**
 * @interface ProductVariationCreateRequest
 * @description Request payload for creating product variation
 */
export interface ProductVariationCreateRequest {
  productId: string;
  variationName: string;
  variationType: 'cor' | 'acabamento' | 'material' | 'textura';
  colorCode?: string | null;
  isDefault?: boolean;
}
