import type { ZoomLevel } from '../../types/models';

export interface ZoomControlsProps {
  zoomLevel: ZoomLevel;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  className?: string;
}
