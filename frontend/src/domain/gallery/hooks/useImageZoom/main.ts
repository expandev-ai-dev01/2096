import { useState, useCallback } from 'react';
import type { ZoomLevel, ZoomState } from '../../types/models';

const ZOOM_LEVELS: ZoomLevel[] = [1.0, 2.0, 4.0, 8.0];

export const useImageZoom = () => {
  const [zoomState, setZoomState] = useState<ZoomState>({
    level: 1.0,
    positionX: 0.5,
    positionY: 0.5,
    isActive: false,
  });

  const zoomIn = useCallback(() => {
    setZoomState((prev) => {
      const currentIndex = ZOOM_LEVELS.indexOf(prev.level);
      if (currentIndex < ZOOM_LEVELS.length - 1) {
        const newLevel = ZOOM_LEVELS[currentIndex + 1];
        return {
          ...prev,
          level: newLevel,
          isActive: newLevel > 1.0,
        };
      }
      return prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoomState((prev) => {
      const currentIndex = ZOOM_LEVELS.indexOf(prev.level);
      if (currentIndex > 0) {
        const newLevel = ZOOM_LEVELS[currentIndex - 1];
        return {
          ...prev,
          level: newLevel,
          isActive: newLevel > 1.0,
        };
      }
      return prev;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoomState({
      level: 1.0,
      positionX: 0.5,
      positionY: 0.5,
      isActive: false,
    });
  }, []);

  const setZoomPosition = useCallback((x: number, y: number) => {
    setZoomState((prev) => ({
      ...prev,
      positionX: Math.max(0, Math.min(1, x)),
      positionY: Math.max(0, Math.min(1, y)),
    }));
  }, []);

  const toggleZoom = useCallback(() => {
    setZoomState((prev) => {
      if (prev.level === 1.0) {
        return {
          ...prev,
          level: 2.0,
          isActive: true,
        };
      }
      return {
        level: 1.0,
        positionX: 0.5,
        positionY: 0.5,
        isActive: false,
      };
    });
  }, []);

  return {
    zoomState,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomPosition,
    toggleZoom,
    canZoomIn: zoomState.level < ZOOM_LEVELS[ZOOM_LEVELS.length - 1],
    canZoomOut: zoomState.level > ZOOM_LEVELS[0],
  };
};
