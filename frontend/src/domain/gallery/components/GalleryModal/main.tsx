import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/core/components/dialog';
import { ImageGallery } from '../ImageGallery';
import type { GalleryModalProps } from './types';

function GalleryModal({
  isOpen,
  onClose,
  images,
  variations,
  initialImageIndex,
  currentVariationId,
  onVariationChange,
  productId,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  useEffect(() => {
    setCurrentIndex(initialImageIndex);
  }, [initialImageIndex]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] p-6 sm:max-w-4xl">
        <ImageGallery
          productId={productId}
          images={images}
          variations={variations}
          currentImageIndex={currentIndex}
          currentVariationId={currentVariationId}
          onImageChange={setCurrentIndex}
          onVariationChange={onVariationChange}
        />
      </DialogContent>
    </Dialog>
  );
}

export { GalleryModal };
