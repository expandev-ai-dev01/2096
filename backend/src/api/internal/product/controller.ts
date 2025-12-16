/**
 * @summary
 * API controller for Product entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/product/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  productCatalog,
  productCreate,
  productGet,
  productUpdate,
  productDelete,
  productInteraction,
} from '@/services/product';

/**
 * @api {get} /api/internal/product Catalog Products
 * @apiName CatalogProducts
 * @apiGroup Product
 *
 * @apiQuery {String} [layoutType=grid] Layout type (grid | list)
 * @apiQuery {String} [sortCriteria=name_asc] Sort criteria (name_asc | name_desc | price_asc | price_desc | date_newest | date_oldest | popularity)
 * @apiQuery {String} [navigationMode=pagination] Navigation mode (pagination | infinite_scroll)
 * @apiQuery {Number} [currentPage=1] Current page number (pagination mode)
 * @apiQuery {Number} [itemsPerPage=24] Items per page (12 | 24 | 48)
 * @apiQuery {Number} [loadedItemsCount=0] Loaded items count (infinite scroll mode)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.catalogTitle Catalog title
 * @apiSuccess {Number} data.totalProductsCount Total products count
 * @apiSuccess {Object[]} data.products List of products
 * @apiSuccess {String} data.products.id Product ID
 * @apiSuccess {String} data.products.name Product name
 * @apiSuccess {String} data.products.code Product code
 * @apiSuccess {String} data.products.mainImageUrl Main image URL
 * @apiSuccess {Number|null} data.products.price Product price
 * @apiSuccess {String} data.products.availabilityStatus Availability status (available | on_request | out_of_stock)
 * @apiSuccess {Boolean} data.products.isFeatured Featured flag
 * @apiSuccess {Boolean} data.products.isNew New product flag
 * @apiSuccess {Boolean} data.products.isPromotional Promotional flag
 * @apiSuccess {Number|null} data.products.promotionalPrice Promotional price
 * @apiSuccess {Object} [data.pagination] Pagination metadata (pagination mode)
 * @apiSuccess {Number} data.pagination.currentPage Current page
 * @apiSuccess {Number} data.pagination.itemsPerPage Items per page
 * @apiSuccess {Number} data.pagination.totalPages Total pages
 * @apiSuccess {Boolean} data.pagination.hasPrevious Has previous page
 * @apiSuccess {Boolean} data.pagination.hasNext Has next page
 * @apiSuccess {Object} [data.infiniteScroll] Infinite scroll metadata (infinite scroll mode)
 * @apiSuccess {Number} data.infiniteScroll.loadedItemsCount Loaded items count
 * @apiSuccess {Number} data.infiniteScroll.batchSize Batch size
 * @apiSuccess {Boolean} data.infiniteScroll.hasMoreItems Has more items
 * @apiSuccess {Boolean} data.infiniteScroll.isLoading Loading flag
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function catalogHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productCatalog(req.query);
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
 * @api {post} /api/internal/product Create Product
 * @apiName CreateProduct
 * @apiGroup Product
 *
 * @apiBody {String} name Product name (1-100 chars)
 * @apiBody {String} code Product code (format: LZ-XXXX)
 * @apiBody {String} mainImageUrl Main image URL
 * @apiBody {Number|null} price Product price
 * @apiBody {String} [availabilityStatus=available] Availability status (available | on_request | out_of_stock)
 * @apiBody {Boolean} [isFeatured=false] Featured flag
 * @apiBody {Boolean} [isPromotional=false] Promotional flag
 * @apiBody {Number|null} [promotionalPrice] Promotional price (required if isPromotional=true)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Product ID
 * @apiSuccess {String} data.name Product name
 * @apiSuccess {String} data.code Product code
 * @apiSuccess {String} data.mainImageUrl Main image URL
 * @apiSuccess {Number|null} data.price Product price
 * @apiSuccess {String} data.availabilityStatus Availability status
 * @apiSuccess {Boolean} data.isFeatured Featured flag
 * @apiSuccess {Boolean} data.isNew New product flag
 * @apiSuccess {String} data.createdDate Creation date (ISO 8601)
 * @apiSuccess {Boolean} data.isPromotional Promotional flag
 * @apiSuccess {Number|null} data.promotionalPrice Promotional price
 * @apiSuccess {Number} data.popularityScore Popularity score
 * @apiSuccess {Number} data.viewCount View count
 * @apiSuccess {Number} data.clickCount Click count
 * @apiSuccess {Number} data.interactionCount Interaction count
 * @apiSuccess {String} data.lastPopularityUpdate Last popularity update (ISO 8601)
 * @apiSuccess {Boolean} data.active Active flag
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | DUPLICATE_CODE)
 * @apiError {String} error.message Error message
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productCreate(req.body);
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
 * @api {get} /api/internal/product/:id Get Product
 * @apiName GetProduct
 * @apiGroup Product
 *
 * @apiParam {String} id Product ID (UUID)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Product ID
 * @apiSuccess {String} data.name Product name
 * @apiSuccess {String} data.code Product code
 * @apiSuccess {String} data.mainImageUrl Main image URL
 * @apiSuccess {Number|null} data.price Product price
 * @apiSuccess {String} data.availabilityStatus Availability status
 * @apiSuccess {Boolean} data.isFeatured Featured flag
 * @apiSuccess {Boolean} data.isNew New product flag
 * @apiSuccess {String} data.createdDate Creation date (ISO 8601)
 * @apiSuccess {Boolean} data.isPromotional Promotional flag
 * @apiSuccess {Number|null} data.promotionalPrice Promotional price
 * @apiSuccess {Number} data.popularityScore Popularity score
 * @apiSuccess {Number} data.viewCount View count
 * @apiSuccess {Number} data.clickCount Click count
 * @apiSuccess {Number} data.interactionCount Interaction count
 * @apiSuccess {String} data.lastPopularityUpdate Last popularity update (ISO 8601)
 * @apiSuccess {Boolean} data.active Active flag
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await productGet(req.params);
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
 * @api {put} /api/internal/product/:id Update Product
 * @apiName UpdateProduct
 * @apiGroup Product
 *
 * @apiParam {String} id Product ID (UUID)
 *
 * @apiBody {String} name Product name (1-100 chars)
 * @apiBody {String} code Product code (format: LZ-XXXX)
 * @apiBody {String} mainImageUrl Main image URL
 * @apiBody {Number|null} price Product price
 * @apiBody {String} availabilityStatus Availability status (available | on_request | out_of_stock)
 * @apiBody {Boolean} isFeatured Featured flag
 * @apiBody {Boolean} active Active flag
 * @apiBody {Boolean} isPromotional Promotional flag
 * @apiBody {Number|null} promotionalPrice Promotional price (required if isPromotional=true)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Product ID
 * @apiSuccess {String} data.name Product name
 * @apiSuccess {String} data.code Product code
 * @apiSuccess {String} data.mainImageUrl Main image URL
 * @apiSuccess {Number|null} data.price Product price
 * @apiSuccess {String} data.availabilityStatus Availability status
 * @apiSuccess {Boolean} data.isFeatured Featured flag
 * @apiSuccess {Boolean} data.isNew New product flag
 * @apiSuccess {String} data.createdDate Creation date (ISO 8601)
 * @apiSuccess {Boolean} data.isPromotional Promotional flag
 * @apiSuccess {Number|null} data.promotionalPrice Promotional price
 * @apiSuccess {Number} data.popularityScore Popularity score
 * @apiSuccess {Number} data.viewCount View count
 * @apiSuccess {Number} data.clickCount Click count
 * @apiSuccess {Number} data.interactionCount Interaction count
 * @apiSuccess {String} data.lastPopularityUpdate Last popularity update (ISO 8601)
 * @apiSuccess {Boolean} data.active Active flag
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | DUPLICATE_CODE)
 * @apiError {String} error.message Error message
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productUpdate(req.params, req.body);
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
 * @api {delete} /api/internal/product/:id Delete Product
 * @apiName DeleteProduct
 * @apiGroup Product
 *
 * @apiParam {String} id Product ID (UUID)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productDelete(req.params);
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
 * @api {post} /api/internal/product/interaction Record Product Interaction
 * @apiName RecordProductInteraction
 * @apiGroup Product
 *
 * @apiBody {String} productId Product ID (UUID)
 * @apiBody {String} interactionType Interaction type (view | click | interaction)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function interactionHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productInteraction(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
