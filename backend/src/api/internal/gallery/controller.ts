/**
 * @summary
 * API controller for Gallery entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/gallery/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  galleryGet,
  galleryImageCreate,
  galleryImageUpdate,
  galleryImageDelete,
  productVariationCreate,
} from '@/services/gallery';

/**
 * @api {get} /api/internal/gallery Get Gallery
 * @apiName GetGallery
 * @apiGroup Gallery
 *
 * @apiQuery {String} productId Product ID (UUID)
 * @apiQuery {String} [variationId] Variation ID (UUID)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object} data.gallery Gallery data
 * @apiSuccess {String} data.gallery.id Gallery ID
 * @apiSuccess {String} data.gallery.productId Product ID
 * @apiSuccess {String} data.gallery.mainImageUrl Main image URL
 * @apiSuccess {Number} data.gallery.totalImages Total images count
 * @apiSuccess {Number} data.gallery.currentImageIndex Current image index
 * @apiSuccess {String|null} data.gallery.currentVariationId Current variation ID
 * @apiSuccess {String} data.gallery.displayMode Display mode (page | modal)
 * @apiSuccess {Object[]} data.images List of images
 * @apiSuccess {String} data.images.id Image ID
 * @apiSuccess {String} data.images.thumbnailUrl Thumbnail URL
 * @apiSuccess {String} data.images.fullSizeUrl Full size URL
 * @apiSuccess {Number} data.images.displayOrder Display order
 * @apiSuccess {String} data.images.imageCategory Image category
 * @apiSuccess {Number} data.images.lazyLoadPriority Lazy load priority
 * @apiSuccess {String|null} data.images.captionText Caption text
 * @apiSuccess {Object} data.images.resolutionUrls Resolution URLs
 * @apiSuccess {Object[]} data.variations List of variations
 * @apiSuccess {String} data.variations.id Variation ID
 * @apiSuccess {String} data.variations.variationName Variation name
 * @apiSuccess {String} data.variations.variationType Variation type
 * @apiSuccess {String|null} data.variations.colorCode Color code
 * @apiSuccess {Boolean} data.variations.isDefault Is default variation
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await galleryGet(req.query);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/gallery/image Create Gallery Image
 * @apiName CreateGalleryImage
 * @apiGroup Gallery
 *
 * @apiBody {String} galleryId Gallery ID (UUID)
 * @apiBody {String} thumbnailUrl Thumbnail URL
 * @apiBody {String} fullSizeUrl Full size URL
 * @apiBody {Number} displayOrder Display order
 * @apiBody {String} imageCategory Image category (frontal | lateral | detalhes | ambiente | perspectiva)
 * @apiBody {String} [captionText] Caption text (max 200 chars)
 * @apiBody {String} [detailedDescription] Detailed description (max 1000 chars)
 * @apiBody {Object} resolutionUrls Resolution URLs
 * @apiBody {String} resolutionUrls.thumbnail Thumbnail URL
 * @apiBody {String} resolutionUrls.medium Medium URL
 * @apiBody {String} resolutionUrls.large Large URL
 * @apiBody {String} resolutionUrls.original Original URL
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Image ID
 * @apiSuccess {String} data.galleryId Gallery ID
 * @apiSuccess {String} data.thumbnailUrl Thumbnail URL
 * @apiSuccess {String} data.fullSizeUrl Full size URL
 * @apiSuccess {Number} data.displayOrder Display order
 * @apiSuccess {Boolean} data.isActive Is active
 * @apiSuccess {String} data.imageCategory Image category
 * @apiSuccess {Number} data.lazyLoadPriority Lazy load priority
 * @apiSuccess {String|null} data.captionText Caption text
 * @apiSuccess {String|null} data.detailedDescription Detailed description
 * @apiSuccess {Boolean} data.showCaption Show caption flag
 * @apiSuccess {Object} data.resolutionUrls Resolution URLs
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND | MAX_IMAGES_REACHED)
 * @apiError {String} error.message Error message
 */
export async function createImageHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await galleryImageCreate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/gallery/image/:id Update Gallery Image
 * @apiName UpdateGalleryImage
 * @apiGroup Gallery
 *
 * @apiParam {String} id Image ID (UUID)
 *
 * @apiBody {Number} [displayOrder] Display order
 * @apiBody {String} [imageCategory] Image category
 * @apiBody {String} [captionText] Caption text
 * @apiBody {String} [detailedDescription] Detailed description
 * @apiBody {Boolean} [showCaption] Show caption flag
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Image ID
 * @apiSuccess {String} data.galleryId Gallery ID
 * @apiSuccess {String} data.thumbnailUrl Thumbnail URL
 * @apiSuccess {String} data.fullSizeUrl Full size URL
 * @apiSuccess {Number} data.displayOrder Display order
 * @apiSuccess {Boolean} data.isActive Is active
 * @apiSuccess {String} data.imageCategory Image category
 * @apiSuccess {Number} data.lazyLoadPriority Lazy load priority
 * @apiSuccess {String|null} data.captionText Caption text
 * @apiSuccess {String|null} data.detailedDescription Detailed description
 * @apiSuccess {Boolean} data.showCaption Show caption flag
 * @apiSuccess {Object} data.resolutionUrls Resolution URLs
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND)
 * @apiError {String} error.message Error message
 */
export async function updateImageHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await galleryImageUpdate(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {delete} /api/internal/gallery/image/:id Delete Gallery Image
 * @apiName DeleteGalleryImage
 * @apiGroup Gallery
 *
 * @apiParam {String} id Image ID (UUID)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND)
 * @apiError {String} error.message Error message
 */
export async function deleteImageHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await galleryImageDelete(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/gallery/variation Create Product Variation
 * @apiName CreateProductVariation
 * @apiGroup Gallery
 *
 * @apiBody {String} productId Product ID (UUID)
 * @apiBody {String} variationName Variation name (1-100 chars)
 * @apiBody {String} variationType Variation type (cor | acabamento | material | textura)
 * @apiBody {String} [colorCode] Color code (hex format #RRGGBB)
 * @apiBody {Boolean} [isDefault] Is default variation
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Variation ID
 * @apiSuccess {String} data.productId Product ID
 * @apiSuccess {String} data.variationName Variation name
 * @apiSuccess {String} data.variationType Variation type
 * @apiSuccess {String|null} data.colorCode Color code
 * @apiSuccess {Boolean} data.isDefault Is default variation
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function createVariationHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productVariationCreate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
