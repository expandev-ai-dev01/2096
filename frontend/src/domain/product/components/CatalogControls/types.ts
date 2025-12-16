export interface CatalogControlsProps {
  layoutType: 'grid' | 'list';
  sortCriteria: string;
  itemsPerPage: number;
  onLayoutChange: (layout: 'grid' | 'list') => void;
  onSortChange: (sort: string) => void;
  onItemsPerPageChange: (items: number) => void;
  className?: string;
}
