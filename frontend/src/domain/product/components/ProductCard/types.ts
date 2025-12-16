import type { Product } from '../../types/models';

export interface ProductCardProps {
  product: Product;
  onInteraction?: (productId: string, type: 'view' | 'click' | 'interaction') => void;
  className?: string;
}
