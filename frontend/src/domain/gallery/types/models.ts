export interface Gallery {
  id: string;
  productId: string;
  mainImageUrl: string;
  totalImages: number;
  currentImageIndex: number;
  currentVariationId: string | null;
  displayMode: 'page' | 'modal';
}

export interface GalleryImage {
  id: string;
  galleryId: string;
  thumbnailUrl: string;
  fullSizeUrl: string;
  displayOrder: number;
  isActive: boolean;
  imageCategory: 'frontal' | 'lateral' | 'detalhes' | 'ambiente' | 'perspectiva';
  lazyLoadPriority: number;
  captionText: string | null;
  detailedDescription: string | null;
  showCaption: boolean;
  resolutionUrls: ResolutionUrls;
}

export interface ResolutionUrls {
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}

export interface ProductVariation {
  id: string;
  productId: string;
  variationName: string;
  variationType: 'cor' | 'acabamento' | 'material' | 'textura';
  colorCode: string | null;
  isDefault: boolean;
}

export interface GalleryFilters {
  productId: string;
  variationId?: string;
}

export type ZoomLevel = 1.0 | 2.0 | 4.0 | 8.0;

export interface ZoomState {
  level: ZoomLevel;
  positionX: number;
  positionY: number;
  isActive: boolean;
}
