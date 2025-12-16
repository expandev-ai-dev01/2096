import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { ZoomIn, ZoomOut, Minimize2 } from 'lucide-react';
import type { ZoomControlsProps } from './types';

function ZoomControls({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn,
  canZoomOut,
  className,
}: ZoomControlsProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        variant="secondary"
        size="icon-sm"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="shadow-lg"
        aria-label="Aumentar zoom"
      >
        <ZoomIn />
      </Button>

      <div className="bg-background/80 flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium shadow-lg backdrop-blur-sm">
        {zoomLevel}x
      </div>

      <Button
        variant="secondary"
        size="icon-sm"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="shadow-lg"
        aria-label="Diminuir zoom"
      >
        <ZoomOut />
      </Button>

      {zoomLevel > 1.0 && (
        <Button
          variant="secondary"
          size="icon-sm"
          onClick={onReset}
          className="shadow-lg"
          aria-label="Resetar zoom"
        >
          <Minimize2 />
        </Button>
      )}
    </div>
  );
}

export { ZoomControls };
