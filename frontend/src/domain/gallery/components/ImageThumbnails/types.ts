import type { GalleryImage } from '../../types/models';

export interface ImageThumbnailsProps {
  images: GalleryImage[];
  activeIndex: number;
  onThumbnailClick: (index: number) => void;
  className?: string;
}
