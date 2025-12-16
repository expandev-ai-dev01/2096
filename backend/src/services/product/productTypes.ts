/**
 * @summary
 * Type definitions for Product entity.
 *
 * @module services/product/productTypes
 */

import {
  ProductAvailabilityStatus,
  ProductSortCriteria,
  ProductLayout,
  ProductNavigationMode,
} from '@/constants';

/**
 * @interface ProductEntity
 * @description Represents a product entity in the catalog
 */
export interface ProductEntity {
  id: string;
  name: string;
  code: string;
  mainImageUrl: string;
  price: number | null;
  availabilityStatus: ProductAvailabilityStatus;
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

/**
 * @interface ProductListResponse
 * @description Response structure for listing products
 */
export interface ProductListResponse {
  id: string;
  name: string;
  code: string;
  mainImageUrl: string;
  price: number | null;
  availabilityStatus: ProductAvailabilityStatus;
  isFeatured: boolean;
  isNew: boolean;
  isPromotional: boolean;
  promotionalPrice: number | null;
}

/**
 * @interface ProductCatalogRequest
 * @description Request parameters for catalog listing
 */
export interface ProductCatalogRequest {
  layoutType?: ProductLayout;
  sortCriteria?: ProductSortCriteria;
  navigationMode?: ProductNavigationMode;
  currentPage?: number;
  itemsPerPage?: number;
  loadedItemsCount?: number;
}

/**
 * @interface ProductCatalogResponse
 * @description Response structure for catalog listing
 */
export interface ProductCatalogResponse {
  catalogTitle: string;
  totalProductsCount: number;
  products: ProductListResponse[];
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

/**
 * @interface ProductCreateRequest
 * @description Request payload for creating a product
 */
export interface ProductCreateRequest {
  name: string;
  code: string;
  mainImageUrl: string;
  price: number | null;
  availabilityStatus?: ProductAvailabilityStatus;
  isFeatured?: boolean;
  isPromotional?: boolean;
  promotionalPrice?: number | null;
}

/**
 * @interface ProductUpdateRequest
 * @description Request payload for updating a product
 */
export interface ProductUpdateRequest {
  name: string;
  code: string;
  mainImageUrl: string;
  price: number | null;
  availabilityStatus: ProductAvailabilityStatus;
  isFeatured: boolean;
  active: boolean;
  isPromotional: boolean;
  promotionalPrice: number | null;
}

/**
 * @interface ProductInteractionRequest
 * @description Request payload for recording product interactions
 */
export interface ProductInteractionRequest {
  productId: string;
  interactionType: 'view' | 'click' | 'interaction';
}
