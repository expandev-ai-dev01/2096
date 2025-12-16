import { useState, useEffect } from 'react';
import { cn } from '@/core/lib/utils';
import { ImageThumbnails } from '../ImageThumbnails';
import { ZoomControls } from '../ZoomControls';
import { VariationSelector } from '../VariationSelector';
import { useImageZoom } from '../../hooks/useImageZoom';
import type { ImageGalleryProps } from './types';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/core/components/button';

function ImageGallery({
  images,
  variations,
  currentImageIndex,
  currentVariationId,
  onImageChange,
  onVariationChange,
  onImageClick,
  className,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(currentImageIndex);
  const {
    zoomState,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomPosition,
    toggleZoom,
    canZoomIn,
    canZoomOut,
  } = useImageZoom();

  useEffect(() => {
    setActiveIndex(currentImageIndex);
  }, [currentImageIndex]);

  const currentImage = images[activeIndex];

  const handlePrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    setActiveIndex(newIndex);
    onImageChange(newIndex);
    resetZoom();
  };

  const handleNext = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIndex);
    onImageChange(newIndex);
    resetZoom();
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    onImageChange(index);
    resetZoom();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomState.isActive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setZoomPosition(x, y);
  };

  const getResolutionUrl = () => {
    if (!currentImage) return '';
    if (zoomState.level === 1.0) return currentImage.resolutionUrls.medium;
    if (zoomState.level === 2.0) return currentImage.resolutionUrls.large;
    return currentImage.resolutionUrls.original;
  };

  if (!currentImage) return null;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {variations.length > 0 && (
        <VariationSelector
          variations={variations}
          currentVariationId={currentVariationId}
          onVariationChange={onVariationChange}
        />
      )}

      <div className="bg-muted relative aspect-square overflow-hidden rounded-lg border">
        <div
          className="relative h-full w-full cursor-pointer"
          onMouseMove={handleMouseMove}
          onClick={onImageClick}
          onDoubleClick={toggleZoom}
        >
          <img
            src={getResolutionUrl()}
            alt={currentImage.captionText || `Imagem ${activeIndex + 1}`}
            className="h-full w-full object-contain transition-transform duration-300"
            style={{
              transform: `scale(${zoomState.level})`,
              transformOrigin: `${zoomState.positionX * 100}% ${zoomState.positionY * 100}%`,
            }}
            loading="eager"
          />
        </div>

        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={onImageClick}
            className="shadow-lg"
            aria-label="Visualizar em tela cheia"
          >
            <Maximize2 />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="secondary"
            size="icon"
            onClick={handlePrevious}
            className="shadow-lg"
            aria-label="Imagem anterior"
          >
            <ChevronLeft />
          </Button>

          <div className="bg-background/80 rounded-md px-3 py-1 text-sm font-medium shadow-lg backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>

          <Button
            variant="secondary"
            size="icon"
            onClick={handleNext}
            className="shadow-lg"
            aria-label="Próxima imagem"
          >
            <ChevronRight />
          </Button>
        </div>

        <ZoomControls
          zoomLevel={zoomState.level}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetZoom}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
          className="absolute left-4 top-4"
        />
      </div>

      {currentImage.showCaption && currentImage.captionText && (
        <div className="text-muted-foreground bg-muted rounded-md p-3 text-sm">
          {currentImage.captionText}
        </div>
      )}

      <ImageThumbnails
        images={images}
        activeIndex={activeIndex}
        onThumbnailClick={handleThumbnailClick}
      />
    </div>
  );
}

export { ImageGallery };
