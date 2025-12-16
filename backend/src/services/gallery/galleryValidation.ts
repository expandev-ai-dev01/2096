/**
 * @summary
 * Validation schemas for Gallery entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/gallery/galleryValidation
 */

import { z } from 'zod';
import {
  GALLERY_LIMITS,
  GALLERY_DISPLAY_MODE,
  IMAGE_CATEGORY,
  IMAGE_RESOLUTION,
} from '@/constants';

/**
 * Schema for gallery get request validation
 */
export const galleryGetSchema = z.object({
  productId: z.string().uuid(),
  variationId: z.string().uuid().optional(),
});

/**
 * Schema for resolution URLs validation
 */
export const resolutionUrlsSchema = z.object({
  thumbnail: z.string().url(),
  medium: z.string().url(),
  large: z.string().url(),
  original: z.string().url(),
});

/**
 * Schema for gallery image create request validation
 */
export const galleryImageCreateSchema = z.object({
  galleryId: z.string().uuid(),
  thumbnailUrl: z.string().url(),
  fullSizeUrl: z.string().url(),
  displayOrder: z.number().int().positive(),
  imageCategory: z.enum([
    IMAGE_CATEGORY.FRONTAL,
    IMAGE_CATEGORY.LATERAL,
    IMAGE_CATEGORY.DETALHES,
    IMAGE_CATEGORY.AMBIENTE,
    IMAGE_CATEGORY.PERSPECTIVA,
  ]),
  captionText: z.string().max(GALLERY_LIMITS.CAPTION_MAX_LENGTH).nullable().optional(),
  detailedDescription: z.string().max(GALLERY_LIMITS.DESCRIPTION_MAX_LENGTH).nullable().optional(),
  resolutionUrls: resolutionUrlsSchema,
});

/**
 * Schema for gallery image update request validation
 */
export const galleryImageUpdateSchema = z.object({
  displayOrder: z.number().int().positive().optional(),
  imageCategory: z
    .enum([
      IMAGE_CATEGORY.FRONTAL,
      IMAGE_CATEGORY.LATERAL,
      IMAGE_CATEGORY.DETALHES,
      IMAGE_CATEGORY.AMBIENTE,
      IMAGE_CATEGORY.PERSPECTIVA,
    ])
    .optional(),
  captionText: z.string().max(GALLERY_LIMITS.CAPTION_MAX_LENGTH).nullable().optional(),
  detailedDescription: z.string().max(GALLERY_LIMITS.DESCRIPTION_MAX_LENGTH).nullable().optional(),
  showCaption: z.boolean().optional(),
});

/**
 * Schema for product variation create request validation
 */
export const productVariationCreateSchema = z.object({
  productId: z.string().uuid(),
  variationName: z.string().min(1).max(100),
  variationType: z.enum(['cor', 'acabamento', 'material', 'textura']),
  colorCode: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .nullable()
    .optional(),
  isDefault: z.boolean().optional(),
});

/**
 * Schema for ID parameter validation
 */
export const paramsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Inferred types from schemas
 */
export type GalleryGetInput = z.infer<typeof galleryGetSchema>;
export type GalleryImageCreateInput = z.infer<typeof galleryImageCreateSchema>;
export type GalleryImageUpdateInput = z.infer<typeof galleryImageUpdateSchema>;
export type ProductVariationCreateInput = z.infer<typeof productVariationCreateSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
