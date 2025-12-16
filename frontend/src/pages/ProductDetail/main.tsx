import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGallery } from '@/domain/gallery/hooks/useGallery';
import { useGalleryModal } from '@/domain/gallery/hooks/useGalleryModal';
import { ImageGallery } from '@/domain/gallery/components/ImageGallery';
import { GalleryModal } from '@/domain/gallery/components/GalleryModal';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/core/components/empty';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/core/components/breadcrumb';
import { AlertCircle } from 'lucide-react';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVariationId, setCurrentVariationId] = useState<string | null>(null);

  const { gallery, images, variations, isLoading, error } = useGallery({
    filters: {
      productId: id ?? '',
      variationId: currentVariationId ?? undefined,
    },
    enabled: !!id,
  });

  const { isOpen, openModal, closeModal } = useGalleryModal();

  const handleVariationChange = (variationId: string) => {
    setCurrentVariationId(variationId);
    setCurrentImageIndex(0);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner className="size-8" />
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <AlertCircle className="text-destructive size-12" />
          <EmptyTitle>Erro ao carregar galeria</EmptyTitle>
          <EmptyDescription>
            Não foi possível carregar as imagens do produto. Tente novamente mais tarde.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/catalogo">Catálogo</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detalhes do Produto</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ImageGallery
            productId={gallery.productId}
            images={images}
            variations={variations}
            currentImageIndex={currentImageIndex}
            currentVariationId={currentVariationId}
            onImageChange={setCurrentImageIndex}
            onVariationChange={handleVariationChange}
            onImageClick={() => openModal('main_image_click')}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalhes do Produto</h1>
            <p className="text-muted-foreground mt-2">
              Visualize as imagens em alta qualidade e explore diferentes variações.
            </p>
          </div>
        </div>
      </div>

      <GalleryModal
        isOpen={isOpen}
        onClose={closeModal}
        images={images}
        variations={variations}
        initialImageIndex={currentImageIndex}
        currentVariationId={currentVariationId}
        onVariationChange={handleVariationChange}
        productId={gallery.productId}
      />
    </div>
  );
}

export { ProductDetailPage };
