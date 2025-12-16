/**
 * @summary
 * Validation schemas for Product entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/product/productValidation
 */

import { z } from 'zod';
import {
  PRODUCT_LIMITS,
  PRODUCT_AVAILABILITY_STATUS,
  PRODUCT_SORT_CRITERIA,
  PRODUCT_LAYOUT,
  PRODUCT_NAVIGATION_MODE,
} from '@/constants';

/**
 * Schema for product code validation (LZ-XXXX format)
 */
export const productCodeSchema = z
  .string()
  .length(PRODUCT_LIMITS.CODE_LENGTH)
  .regex(/^LZ-\d{4}$/, 'Product code must be in format LZ-XXXX');

/**
 * Schema for product price validation
 */
export const priceSchema = z.number().min(PRODUCT_LIMITS.PRICE_MIN).nullable();

/**
 * Schema for promotional price validation
 */
export const promotionalPriceSchema = z.number().min(PRODUCT_LIMITS.PRICE_MIN).nullable();

/**
 * Schema for create request validation
 */
export const createSchema = z
  .object({
    name: z.string().min(PRODUCT_LIMITS.NAME_MIN_LENGTH).max(PRODUCT_LIMITS.NAME_MAX_LENGTH),
    code: productCodeSchema,
    mainImageUrl: z.string().url(),
    price: priceSchema,
    availabilityStatus: z
      .enum([
        PRODUCT_AVAILABILITY_STATUS.AVAILABLE,
        PRODUCT_AVAILABILITY_STATUS.ON_REQUEST,
        PRODUCT_AVAILABILITY_STATUS.OUT_OF_STOCK,
      ])
      .optional(),
    isFeatured: z.boolean().optional(),
    isPromotional: z.boolean().optional(),
    promotionalPrice: promotionalPriceSchema.optional(),
  })
  .refine(
    (data) => {
      if (
        data.isPromotional &&
        data.promotionalPrice !== null &&
        data.promotionalPrice !== undefined &&
        data.price !== null
      ) {
        return data.promotionalPrice < data.price;
      }
      return true;
    },
    {
      message: 'Promotional price must be less than regular price',
      path: ['promotionalPrice'],
    }
  )
  .refine(
    (data) => {
      if (data.isPromotional) {
        return data.promotionalPrice !== null && data.promotionalPrice !== undefined;
      }
      return true;
    },
    {
      message: 'Promotional price is required when product is promotional',
      path: ['promotionalPrice'],
    }
  );

/**
 * Schema for update request validation
 */
export const updateSchema = z
  .object({
    name: z.string().min(PRODUCT_LIMITS.NAME_MIN_LENGTH).max(PRODUCT_LIMITS.NAME_MAX_LENGTH),
    code: productCodeSchema,
    mainImageUrl: z.string().url(),
    price: priceSchema,
    availabilityStatus: z.enum([
      PRODUCT_AVAILABILITY_STATUS.AVAILABLE,
      PRODUCT_AVAILABILITY_STATUS.ON_REQUEST,
      PRODUCT_AVAILABILITY_STATUS.OUT_OF_STOCK,
    ]),
    isFeatured: z.boolean(),
    active: z.boolean(),
    isPromotional: z.boolean(),
    promotionalPrice: promotionalPriceSchema,
  })
  .refine(
    (data) => {
      if (data.isPromotional && data.promotionalPrice !== null && data.price !== null) {
        return data.promotionalPrice < data.price;
      }
      return true;
    },
    {
      message: 'Promotional price must be less than regular price',
      path: ['promotionalPrice'],
    }
  )
  .refine(
    (data) => {
      if (data.isPromotional) {
        return data.promotionalPrice !== null;
      }
      return true;
    },
    {
      message: 'Promotional price is required when product is promotional',
      path: ['promotionalPrice'],
    }
  );

/**
 * Schema for ID parameter validation
 */
export const paramsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Schema for catalog request validation
 */
export const catalogRequestSchema = z.object({
  layoutType: z
    .enum([PRODUCT_LAYOUT.GRID, PRODUCT_LAYOUT.LIST])
    .optional()
    .default(PRODUCT_LAYOUT.GRID),
  sortCriteria: z
    .enum([
      PRODUCT_SORT_CRITERIA.NAME_ASC,
      PRODUCT_SORT_CRITERIA.NAME_DESC,
      PRODUCT_SORT_CRITERIA.PRICE_ASC,
      PRODUCT_SORT_CRITERIA.PRICE_DESC,
      PRODUCT_SORT_CRITERIA.DATE_NEWEST,
      PRODUCT_SORT_CRITERIA.DATE_OLDEST,
      PRODUCT_SORT_CRITERIA.POPULARITY,
    ])
    .optional()
    .default(PRODUCT_SORT_CRITERIA.NAME_ASC),
  navigationMode: z
    .enum([PRODUCT_NAVIGATION_MODE.PAGINATION, PRODUCT_NAVIGATION_MODE.INFINITE_SCROLL])
    .optional()
    .default(PRODUCT_NAVIGATION_MODE.PAGINATION),
  currentPage: z.coerce.number().int().positive().optional().default(1),
  itemsPerPage: z.coerce
    .number()
    .int()
    .refine((val) => (PRODUCT_LIMITS.ITEMS_PER_PAGE_OPTIONS as readonly number[]).includes(val), {
      message: `Items per page must be one of: ${PRODUCT_LIMITS.ITEMS_PER_PAGE_OPTIONS.join(', ')}`,
    })
    .optional()
    .default(PRODUCT_LIMITS.ITEMS_PER_PAGE_DEFAULT),
  loadedItemsCount: z.coerce.number().int().min(0).optional().default(0),
});

/**
 * Schema for interaction request validation
 */
export const interactionSchema = z.object({
  productId: z.string().uuid(),
  interactionType: z.enum(['view', 'click', 'interaction']),
});

/**
 * Inferred types from schemas
 */
export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
export type CatalogRequestInput = z.infer<typeof catalogRequestSchema>;
export type InteractionInput = z.infer<typeof interactionSchema>;
