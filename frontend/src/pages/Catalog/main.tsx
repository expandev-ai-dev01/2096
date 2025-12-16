import { useState, useEffect } from 'react';
import { useProductCatalog } from '@/domain/product/hooks/useProductCatalog';
import { useProductInteraction } from '@/domain/product/hooks/useProductInteraction';
import { ProductCard } from '@/domain/product/components/ProductCard';
import { CatalogControls } from '@/domain/product/components/CatalogControls';
import { CatalogPagination } from '@/domain/product/components/CatalogPagination';
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
import { cn } from '@/core/lib/utils';
import { Package } from 'lucide-react';
import type { CatalogFilters } from '@/domain/product/types/models';

function CatalogPage() {
  const [filters, setFilters] = useState<CatalogFilters>({
    layoutType: 'grid',
    sortCriteria: 'name_asc',
    navigationMode: 'pagination',
    currentPage: 1,
    itemsPerPage: 24,
  });

  const { products, totalCount, pagination, isLoading } = useProductCatalog({ filters });
  const { recordInteraction } = useProductInteraction();

  const handleLayoutChange = (layout: 'grid' | 'list') => {
    setFilters((prev) => ({ ...prev, layoutType: layout }));
  };

  const handleSortChange = (sort: string) => {
    setFilters((prev) => ({ ...prev, sortCriteria: sort as CatalogFilters['sortCriteria'] }));
  };

  const handleItemsPerPageChange = (items: number) => {
    setFilters((prev) => ({ ...prev, itemsPerPage: items, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductInteraction = async (
    productId: string,
    type: 'view' | 'click' | 'interaction'
  ) => {
    try {
      await recordInteraction({ productId, interactionType: type });
    } catch (error) {
      console.error('Failed to record interaction:', error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="space-y-6 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Catálogo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Catálogo Lozorio Móveis</h1>
            <p className="text-muted-foreground mt-1">
              {totalCount} {totalCount === 1 ? 'produto disponível' : 'produtos disponíveis'}
            </p>
          </div>
        </div>

        <CatalogControls
          layoutType={filters.layoutType ?? 'grid'}
          sortCriteria={filters.sortCriteria ?? 'name_asc'}
          itemsPerPage={filters.itemsPerPage ?? 24}
          onLayoutChange={handleLayoutChange}
          onSortChange={handleSortChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner className="size-8" />
        </div>
      ) : products.length === 0 ? (
        <Empty className="min-h-[400px]">
          <EmptyHeader>
            <Package className="text-muted-foreground size-12" />
            <EmptyTitle>Nenhum produto encontrado</EmptyTitle>
            <EmptyDescription>
              Não há produtos disponíveis no momento. Volte mais tarde para conferir novidades.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div
            className={cn(
              'gap-6',
              filters.layoutType === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'flex flex-col'
            )}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInteraction={handleProductInteraction}
              />
            ))}
          </div>

          {pagination && (
            <CatalogPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasPrevious={pagination.hasPrevious}
              hasNext={pagination.hasNext}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
}

export { CatalogPage };
