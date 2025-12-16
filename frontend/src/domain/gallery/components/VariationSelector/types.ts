import type { ProductVariation } from '../../types/models';

export interface VariationSelectorProps {
  variations: ProductVariation[];
  currentVariationId: string | null;
  onVariationChange: (variationId: string) => void;
  className?: string;
}
