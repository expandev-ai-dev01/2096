import type { GalleryImage, ProductVariation } from '../../types/models';

export interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  variations: ProductVariation[];
  initialImageIndex: number;
  currentVariationId: string | null;
  onVariationChange: (variationId: string) => void;
  productId: string;
}
