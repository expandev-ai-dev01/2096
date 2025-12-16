import { cn } from '@/core/lib/utils';
import type { ImageThumbnailsProps } from './types';

function ImageThumbnails({
  images,
  activeIndex,
  onThumbnailClick,
  className,
}: ImageThumbnailsProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2', className)}>
      {images.map((image, index) => (
        <button
          key={image.id}
          onClick={() => onThumbnailClick(index)}
          className={cn(
            'hover:border-primary relative aspect-square h-20 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200',
            activeIndex === index ? 'border-primary ring-primary/20 ring-2' : 'border-transparent'
          )}
          aria-label={`Ver imagem ${index + 1}`}
        >
          <img
            src={image.thumbnailUrl}
            alt={image.captionText || `Miniatura ${index + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {activeIndex === index && (
            <div className="bg-primary/10 absolute inset-0 backdrop-blur-[1px]" />
          )}
        </button>
      ))}
    </div>
  );
}

export { ImageThumbnails };
