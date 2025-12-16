/**
 * @summary
 * Default values and constants for Product entity.
 * Provides centralized configuration for product creation, validation limits,
 * and status definitions.
 *
 * @module constants/product/productDefaults
 */

/**
 * @interface ProductDefaultsType
 * @description Default configuration values applied when creating new Product entities.
 *
 * @property {boolean} ACTIVE - Default active status for new products (true)
 * @property {string} AVAILABILITY_STATUS - Default availability status ('available')
 * @property {boolean} IS_FEATURED - Default featured status (false)
 * @property {boolean} IS_PROMOTIONAL - Default promotional status (false)
 * @property {number} POPULARITY_SCORE - Default popularity score (0)
 * @property {number} MAX_PRODUCTS - Maximum allowed products in memory (10000)
 */
export const PRODUCT_DEFAULTS = {
  /** Default active status for new products */
  ACTIVE: true,
  /** Default availability status */
  AVAILABILITY_STATUS: 'available' as const,
  /** Default featured status */
  IS_FEATURED: false,
  /** Default promotional status */
  IS_PROMOTIONAL: false,
  /** Default popularity score */
  POPULARITY_SCORE: 0,
  /** Maximum allowed products in memory */
  MAX_PRODUCTS: 10000,
} as const;

/** Type representing the PRODUCT_DEFAULTS constant */
export type ProductDefaultsType = typeof PRODUCT_DEFAULTS;

/**
 * @interface ProductAvailabilityStatusType
 * @description Available status values for Product entities.
 *
 * @property {string} AVAILABLE - Product is available ('available')
 * @property {string} ON_REQUEST - Product available on request ('on_request')
 * @property {string} OUT_OF_STOCK - Product out of stock ('out_of_stock')
 */
export const PRODUCT_AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  ON_REQUEST: 'on_request',
  OUT_OF_STOCK: 'out_of_stock',
} as const;

/** Type representing the PRODUCT_AVAILABILITY_STATUS constant */
export type ProductAvailabilityStatusType = typeof PRODUCT_AVAILABILITY_STATUS;

/** Union type of all valid availability status values */
export type ProductAvailabilityStatus =
  (typeof PRODUCT_AVAILABILITY_STATUS)[keyof typeof PRODUCT_AVAILABILITY_STATUS];

/**
 * @interface ProductLimitsType
 * @description Validation constraints for Product entity fields.
 *
 * @property {number} NAME_MIN_LENGTH - Minimum characters for name field (1)
 * @property {number} NAME_MAX_LENGTH - Maximum characters for name field (100)
 * @property {number} CODE_LENGTH - Exact length for product code (7)
 * @property {number} PRICE_MIN - Minimum price value (0)
 * @property {number} ITEMS_PER_PAGE_DEFAULT - Default items per page (24)
 * @property {number} ITEMS_PER_PAGE_OPTIONS - Available items per page options
 * @property {number} BATCH_SIZE - Batch size for infinite scroll (24)
 * @property {number} NEW_PRODUCT_DAYS - Days to consider product as new (30)
 * @property {number} VIEW_WEIGHT - Weight for view count in popularity (1)
 * @property {number} CLICK_WEIGHT - Weight for click count in popularity (3)
 * @property {number} INTERACTION_WEIGHT - Weight for interaction count in popularity (2)
 */
export const PRODUCT_LIMITS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  CODE_LENGTH: 7,
  PRICE_MIN: 0,
  ITEMS_PER_PAGE_DEFAULT: 24,
  ITEMS_PER_PAGE_OPTIONS: [12, 24, 48],
  BATCH_SIZE: 24,
  NEW_PRODUCT_DAYS: 30,
  VIEW_WEIGHT: 1,
  CLICK_WEIGHT: 3,
  INTERACTION_WEIGHT: 2,
} as const;

/** Type representing the PRODUCT_LIMITS constant */
export type ProductLimitsType = typeof PRODUCT_LIMITS;

/**
 * @interface ProductSortCriteriaType
 * @description Available sort criteria for products.
 */
export const PRODUCT_SORT_CRITERIA = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  DATE_NEWEST: 'date_newest',
  DATE_OLDEST: 'date_oldest',
  POPULARITY: 'popularity',
} as const;

/** Type representing the PRODUCT_SORT_CRITERIA constant */
export type ProductSortCriteriaType = typeof PRODUCT_SORT_CRITERIA;

/** Union type of all valid sort criteria values */
export type ProductSortCriteria =
  (typeof PRODUCT_SORT_CRITERIA)[keyof typeof PRODUCT_SORT_CRITERIA];

/**
 * @interface ProductLayoutType
 * @description Available layout types for product display.
 */
export const PRODUCT_LAYOUT = {
  GRID: 'grid',
  LIST: 'list',
} as const;

/** Type representing the PRODUCT_LAYOUT constant */
export type ProductLayoutType = typeof PRODUCT_LAYOUT;

/** Union type of all valid layout values */
export type ProductLayout = (typeof PRODUCT_LAYOUT)[keyof typeof PRODUCT_LAYOUT];

/**
 * @interface ProductNavigationModeType
 * @description Available navigation modes for product catalog.
 */
export const PRODUCT_NAVIGATION_MODE = {
  PAGINATION: 'pagination',
  INFINITE_SCROLL: 'infinite_scroll',
} as const;

/** Type representing the PRODUCT_NAVIGATION_MODE constant */
export type ProductNavigationModeType = typeof PRODUCT_NAVIGATION_MODE;

/** Union type of all valid navigation mode values */
export type ProductNavigationMode =
  (typeof PRODUCT_NAVIGATION_MODE)[keyof typeof PRODUCT_NAVIGATION_MODE];
