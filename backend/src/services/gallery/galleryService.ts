/**
 * @summary
 * Business logic for Gallery entity.
 * Handles gallery operations using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/gallery/galleryService
 */

import { GALLERY_DEFAULTS, IMAGE_CATEGORY } from '@/constants';
import { galleryStore } from '@/instances';
import { ServiceError } from '@/utils';
import { GalleryGetResponse, GalleryImageEntity, ProductVariationEntity } from './galleryTypes';
import {
  galleryGetSchema,
  galleryImageCreateSchema,
  galleryImageUpdateSchema,
  productVariationCreateSchema,
  paramsSchema,
} from './galleryValidation';

/**
 * @summary
 * Retrieves gallery with images and variations for a product.
 *
 * @function galleryGet
 * @module services/gallery
 *
 * @param {unknown} query - Raw query parameters to validate
 * @returns {Promise<GalleryGetResponse>} Gallery with images and variations
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When query fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When gallery not found
 *
 * @example
 * const gallery = await galleryGet({ productId: 'uuid' });
 */
export async function galleryGet(query: unknown): Promise<GalleryGetResponse> {
  const validation = galleryGetSchema.safeParse(query);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { productId, variationId } = validation.data;

  // Get or create gallery for product
  let gallery = galleryStore.getByProductId(productId);

  if (!gallery) {
    // Create default gallery for product
    const galleryId = galleryStore.getNextId();
    gallery = {
      id: galleryId,
      productId,
      mainImageUrl: '',
      totalImages: 0,
      currentImageIndex: GALLERY_DEFAULTS.INITIAL_IMAGE_INDEX,
      currentVariationId: variationId || null,
      displayMode: GALLERY_DEFAULTS.DISPLAY_MODE,
    };
    galleryStore.addGallery(gallery);
  }

  // Get images for gallery
  const images = galleryStore.getImagesByGalleryId(gallery.id, variationId);

  // Get variations for product
  const variations = galleryStore.getVariationsByProductId(productId);

  return {
    gallery,
    images,
    variations,
  };
}

/**
 * @summary
 * Creates a new gallery image.
 *
 * @function galleryImageCreate
 * @module services/gallery
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<GalleryImageEntity>} The newly created image
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When gallery not found
 * @throws {ServiceError} MAX_IMAGES_REACHED (400) - When max images limit reached
 *
 * @example
 * const image = await galleryImageCreate({ galleryId: 'uuid', ... });
 */
export async function galleryImageCreate(body: unknown): Promise<GalleryImageEntity> {
  const validation = galleryImageCreateSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  // Check if gallery exists
  const gallery = galleryStore.getById(params.galleryId);
  if (!gallery) {
    throw new ServiceError('NOT_FOUND', 'Gallery not found', 404);
  }

  const id = galleryStore.getNextId();
  const lazyLoadPriority = galleryStore.calculateLazyLoadPriority(params.imageCategory);

  const newImage: GalleryImageEntity = {
    id,
    galleryId: params.galleryId,
    thumbnailUrl: params.thumbnailUrl,
    fullSizeUrl: params.fullSizeUrl,
    displayOrder: params.displayOrder,
    isActive: false,
    imageCategory: params.imageCategory,
    lazyLoadPriority,
    captionText: params.captionText ?? null,
    detailedDescription: params.detailedDescription ?? null,
    showCaption: GALLERY_DEFAULTS.SHOW_CAPTION,
    resolutionUrls: params.resolutionUrls,
  };

  try {
    galleryStore.addImage(newImage);

    // Update gallery main image if this is the first image
    if (gallery.totalImages === 0) {
      galleryStore.updateGallery(gallery.id, {
        mainImageUrl: params.fullSizeUrl,
      });
    }

    return newImage;
  } catch (error: any) {
    if (error.message.includes('Maximum images limit')) {
      throw new ServiceError('MAX_IMAGES_REACHED', error.message, 400);
    }
    throw error;
  }
}

/**
 * @summary
 * Updates an existing gallery image.
 *
 * @function galleryImageUpdate
 * @module services/gallery
 *
 * @param {unknown} params - Raw request params containing the ID
 * @param {unknown} body - Raw request body with update data
 * @returns {Promise<GalleryImageEntity>} The updated image
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When image does not exist
 *
 * @example
 * const updated = await galleryImageUpdate({ id: 'uuid' }, { showCaption: false });
 */
export async function galleryImageUpdate(
  params: unknown,
  body: unknown
): Promise<GalleryImageEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = galleryImageUpdateSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = galleryStore.getImageById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Image not found', 404);
  }

  const updateData = bodyValidation.data;

  // Recalculate lazy load priority if category changed
  const updates: Partial<GalleryImageEntity> = { ...updateData };
  if (updateData.imageCategory) {
    updates.lazyLoadPriority = galleryStore.calculateLazyLoadPriority(updateData.imageCategory);
  }

  const updated = galleryStore.updateImage(id, updates);

  return updated!;
}

/**
 * @summary
 * Deletes a gallery image by its ID.
 *
 * @function galleryImageDelete
 * @module services/gallery
 *
 * @param {unknown} params - Raw request params containing the ID
 * @returns {Promise<{ message: string }>} Success confirmation
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When image does not exist
 *
 * @example
 * const result = await galleryImageDelete({ id: 'uuid' });
 */
export async function galleryImageDelete(params: unknown): Promise<{ message: string }> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const image = galleryStore.getImageById(id);

  if (!image) {
    throw new ServiceError('NOT_FOUND', 'Image not found', 404);
  }

  galleryStore.deleteImage(id);
  return { message: 'Image deleted successfully' };
}

/**
 * @summary
 * Creates a new product variation.
 *
 * @function productVariationCreate
 * @module services/gallery
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<ProductVariationEntity>} The newly created variation
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails validation
 *
 * @example
 * const variation = await productVariationCreate({ productId: 'uuid', ... });
 */
export async function productVariationCreate(body: unknown): Promise<ProductVariationEntity> {
  const validation = productVariationCreateSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  const id = galleryStore.getNextId();

  const newVariation: ProductVariationEntity = {
    id,
    productId: params.productId,
    variationName: params.variationName,
    variationType: params.variationType,
    colorCode: params.colorCode ?? null,
    isDefault: params.isDefault ?? false,
  };

  galleryStore.addVariation(newVariation);
  return newVariation;
}
