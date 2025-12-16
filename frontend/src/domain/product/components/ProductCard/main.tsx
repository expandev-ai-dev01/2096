import { Badge } from '@/core/components/badge';
import { Card, CardContent } from '@/core/components/card';
import { cn } from '@/core/lib/utils';
import type { ProductCardProps } from './types';
import { parseISO } from 'date-fns';

function ProductCard({ product, onInteraction, className }: ProductCardProps) {
  const isNew = () => {
    const createdDate = parseISO(product.createdDate);
    const daysSinceCreation = Math.floor(
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceCreation <= 30;
  };

  const handleClick = () => {
    if (onInteraction) {
      onInteraction(product.id, 'click');
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Consulte';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg',
        product.isFeatured && 'ring-primary/20 ring-2',
        className
      )}
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.mainImageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          {product.isFeatured && (
            <Badge variant="default" className="shadow-md">
              Destaque
            </Badge>
          )}
          {isNew() && (
            <Badge variant="secondary" className="shadow-md">
              Novidade
            </Badge>
          )}
          {product.isPromotional && (
            <Badge variant="destructive" className="shadow-md">
              Promoção
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight">{product.name}</h3>
          <p className="text-muted-foreground text-sm">Cód: {product.code}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product.isPromotional && product.promotionalPrice ? (
              <>
                <p className="text-muted-foreground text-sm line-through">
                  {formatPrice(product.price)}
                </p>
                <p className="text-primary text-lg font-bold">
                  {formatPrice(product.promotionalPrice)}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold">{formatPrice(product.price)}</p>
            )}
          </div>

          <Badge
            variant={product.availabilityStatus === 'available' ? 'default' : 'outline'}
            className="shrink-0"
          >
            {product.availabilityStatus === 'available' && 'Disponível'}
            {product.availabilityStatus === 'on_request' && 'Sob Consulta'}
            {product.availabilityStatus === 'out_of_stock' && 'Indisponível'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export { ProductCard };
