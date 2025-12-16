import type { GalleryImage, ProductVariation } from '../../types/models';

export interface ImageGalleryProps {
  productId: string;
  images: GalleryImage[];
  variations: ProductVariation[];
  currentImageIndex: number;
  currentVariationId: string | null;
  onImageChange: (index: number) => void;
  onVariationChange: (variationId: string) => void;
  onImageClick?: () => void;
  className?: string;
}
