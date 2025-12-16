import { useMutation } from '@tanstack/react-query';
import { productService } from '../../services/productService';

export const useProductInteraction = () => {
  const { mutateAsync: recordInteraction } = useMutation({
    mutationFn: ({
      productId,
      interactionType,
    }: {
      productId: string;
      interactionType: 'view' | 'click' | 'interaction';
    }) => productService.recordInteraction(productId, interactionType),
  });

  return {
    recordInteraction,
  };
};
