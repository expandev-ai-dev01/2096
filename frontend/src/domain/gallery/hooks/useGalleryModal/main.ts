import { useState, useCallback } from 'react';

export const useGalleryModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerSource, setTriggerSource] = useState<
    'thumbnail_click' | 'main_image_click' | 'button_click'
  >('main_image_click');

  const openModal = useCallback(
    (source: 'thumbnail_click' | 'main_image_click' | 'button_click' = 'main_image_click') => {
      setTriggerSource(source);
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    triggerSource,
    openModal,
    closeModal,
  };
};
