export interface Product {
  id: string;
  name: string;
  code: string;
  mainImageUrl: string;
  price: number | null;
  availabilityStatus: 'available' | 'on_request' | 'out_of_stock';
  isFeatured: boolean;
  isNew: boolean;
  createdDate: string;
  isPromotional: boolean;
  promotionalPrice: number | null;
  popularityScore: number;
  viewCount: number;
  clickCount: number;
  interactionCount: number;
  lastPopularityUpdate: string;
  active: boolean;
}

export interface CatalogFilters {
  layoutType?: 'grid' | 'list';
  sortCriteria?:
    | 'name_asc'
    | 'name_desc'
    | 'price_asc'
    | 'price_desc'
    | 'date_newest'
    | 'date_oldest'
    | 'popularity';
  navigationMode?: 'pagination' | 'infinite_scroll';
  currentPage?: number;
  itemsPerPage?: number;
  loadedItemsCount?: number;
}

export interface CatalogResponse {
  catalogTitle: string;
  totalProductsCount: number;
  products: Product[];
  pagination?: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
  infiniteScroll?: {
    loadedItemsCount: number;
    batchSize: number;
    hasMoreItems: boolean;
    isLoading: boolean;
  };
}
