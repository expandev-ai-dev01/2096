import { Button } from '@/core/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { Grid3x3, List, SortAsc } from 'lucide-react';
import { cn } from '@/core/lib/utils';
import type { CatalogControlsProps } from './types';

function CatalogControls({
  layoutType,
  sortCriteria,
  itemsPerPage,
  onLayoutChange,
  onSortChange,
  onItemsPerPageChange,
  className,
}: CatalogControlsProps) {
  return (
    <div
      className={cn(
        'bg-card flex flex-col gap-4 rounded-lg border p-4 shadow-sm md:flex-row md:items-center md:justify-between',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">Layout:</span>
        <div className="flex gap-1">
          <Button
            variant={layoutType === 'grid' ? 'default' : 'outline'}
            size="icon-sm"
            onClick={() => onLayoutChange('grid')}
            aria-label="Visualização em grade"
          >
            <Grid3x3 />
          </Button>
          <Button
            variant={layoutType === 'list' ? 'default' : 'outline'}
            size="icon-sm"
            onClick={() => onLayoutChange('list')}
            aria-label="Visualização em lista"
          >
            <List />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <SortAsc className="text-muted-foreground size-4" />
          <Select value={sortCriteria} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Nome A-Z</SelectItem>
              <SelectItem value="name_desc">Nome Z-A</SelectItem>
              <SelectItem value="price_asc">Menor Preço</SelectItem>
              <SelectItem value="price_desc">Maior Preço</SelectItem>
              <SelectItem value="date_newest">Mais Novos</SelectItem>
              <SelectItem value="date_oldest">Mais Antigos</SelectItem>
              <SelectItem value="popularity">Popularidade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Exibir:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export { CatalogControls };
