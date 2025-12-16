import { cn } from '@/core/lib/utils';
import { Button } from '@/core/components/button';
import type { VariationSelectorProps } from './types';

function VariationSelector({
  variations,
  currentVariationId,
  onVariationChange,
  className,
}: VariationSelectorProps) {
  if (variations.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-medium">Variações:</span>
      <div className="flex flex-wrap gap-2">
        {variations.map((variation) => (
          <Button
            key={variation.id}
            variant={currentVariationId === variation.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onVariationChange(variation.id)}
            className="gap-2"
          >
            {variation.colorCode && (
              <div
                className="size-4 rounded-full border"
                style={{ backgroundColor: variation.colorCode }}
                aria-hidden="true"
              />
            )}
            {variation.variationName}
          </Button>
        ))}
      </div>
    </div>
  );
}

export { VariationSelector };
