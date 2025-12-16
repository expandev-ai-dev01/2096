/**
 * @summary
 * Business logic for Product entity.
 * Handles CRUD operations and catalog management using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/product/productService
 */

import {
  PRODUCT_DEFAULTS,
  PRODUCT_LIMITS,
  PRODUCT_SORT_CRITERIA,
  PRODUCT_NAVIGATION_MODE,
} from '@/constants';
import { productStore } from '@/instances';
import { ServiceError } from '@/utils';
import {
  ProductEntity,
  ProductListResponse,
  ProductCatalogResponse,
  ProductCatalogRequest,
} from './productTypes';
import {
  createSchema,
  updateSchema,
  paramsSchema,
  catalogRequestSchema,
  interactionSchema,
} from './productValidation';

/**
 * @summary
 * Retrieves catalog with products based on filters and pagination/infinite scroll.
 *
 * @function productCatalog
 * @module services/product
 *
 * @param {unknown} query - Raw query parameters to validate
 * @returns {Promise<ProductCatalogResponse>} Catalog with products and metadata
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When query fails validation
 *
 * @example
 * const catalog = await productCatalog({ sortCriteria: 'price_asc', currentPage: 1 });
 */
export async function productCatalog(query: unknown): Promise<ProductCatalogResponse> {
  const validation = catalogRequestSchema.safeParse(query);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;
  let allProducts = productStore.getAll();

  // Update isNew status for all products
  allProducts = allProducts.map((product) => ({
    ...product,
    isNew: productStore.isProductNew(product.createdDate),
  }));

  // Apply sorting
  allProducts = sortProducts(allProducts, params.sortCriteria!);

  const totalCount = allProducts.length;

  // Prepare response based on navigation mode
  const response: ProductCatalogResponse = {
    catalogTitle: 'Catálogo Lozorio Móveis',
    totalProductsCount: totalCount,
    products: [],
  };

  if (params.navigationMode === PRODUCT_NAVIGATION_MODE.PAGINATION) {
    // Pagination mode
    const totalPages = Math.ceil(totalCount / params.itemsPerPage!);
    const currentPage = Math.min(params.currentPage!, totalPages || 1);
    const startIndex = (currentPage - 1) * params.itemsPerPage!;
    const endIndex = startIndex + params.itemsPerPage!;

    response.products = allProducts.slice(startIndex, endIndex).map(mapToListResponse);
    response.pagination = {
      currentPage,
      itemsPerPage: params.itemsPerPage!,
      totalPages: totalPages || 1,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages,
    };
  } else {
    // Infinite scroll mode
    const startIndex = params.loadedItemsCount!;
    const endIndex = startIndex + PRODUCT_LIMITS.BATCH_SIZE;

    response.products = allProducts.slice(startIndex, endIndex).map(mapToListResponse);
    response.infiniteScroll = {
      loadedItemsCount: Math.min(endIndex, totalCount),
      batchSize: PRODUCT_LIMITS.BATCH_SIZE,
      hasMoreItems: endIndex < totalCount,
      isLoading: false,
    };
  }

  return response;
}

/**
 * @summary
 * Creates a new product with validated data.
 *
 * @function productCreate
 * @module services/product
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<ProductEntity>} The newly created product
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails validation
 * @throws {ServiceError} DUPLICATE_CODE (409) - When product code already exists
 *
 * @example
 * const newProduct = await productCreate({ name: 'Sofá', code: 'LZ-0001', ... });
 */
export async function productCreate(body: unknown): Promise<ProductEntity> {
  const validation = createSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  // Check for duplicate code
  if (productStore.codeExists(params.code)) {
    throw new ServiceError('DUPLICATE_CODE', 'Product code already exists', 409);
  }

  const now = new Date().toISOString();
  const id = productStore.getNextId();

  const newProduct: ProductEntity = {
    id,
    name: params.name,
    code: params.code,
    mainImageUrl: params.mainImageUrl,
    price: params.price,
    availabilityStatus: params.availabilityStatus ?? PRODUCT_DEFAULTS.AVAILABILITY_STATUS,
    isFeatured: params.isFeatured ?? PRODUCT_DEFAULTS.IS_FEATURED,
    isNew: true,
    createdDate: now,
    isPromotional: params.isPromotional ?? PRODUCT_DEFAULTS.IS_PROMOTIONAL,
    promotionalPrice: params.promotionalPrice ?? null,
    popularityScore: PRODUCT_DEFAULTS.POPULARITY_SCORE,
    viewCount: 0,
    clickCount: 0,
    interactionCount: 0,
    lastPopularityUpdate: now,
    active: PRODUCT_DEFAULTS.ACTIVE,
  };

  productStore.add(newProduct);
  return newProduct;
}

/**
 * @summary
 * Retrieves a specific product by its unique identifier.
 *
 * @function productGet
 * @module services/product
 *
 * @param {unknown} params - Raw request params containing the ID
 * @returns {Promise<ProductEntity>} The found product
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When product does not exist
 *
 * @example
 * const product = await productGet({ id: 'uuid-here' });
 */
export async function productGet(params: unknown): Promise<ProductEntity> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const record = productStore.getById(id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Product not found', 404);
  }

  return {
    ...record,
    isNew: productStore.isProductNew(record.createdDate),
  };
}

/**
 * @summary
 * Updates an existing product with new data.
 *
 * @function productUpdate
 * @module services/product
 *
 * @param {unknown} params - Raw request params containing the ID
 * @param {unknown} body - Raw request body with update data
 * @returns {Promise<ProductEntity>} The updated product
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When product does not exist
 * @throws {ServiceError} DUPLICATE_CODE (409) - When code already exists for another product
 *
 * @example
 * const updated = await productUpdate({ id: 'uuid' }, { name: 'Updated Name', ... });
 */
export async function productUpdate(params: unknown, body: unknown): Promise<ProductEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = updateSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = productStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Product not found', 404);
  }

  const updateData = bodyValidation.data;

  // Check for duplicate code
  if (updateData.code !== existing.code && productStore.codeExists(updateData.code, id)) {
    throw new ServiceError('DUPLICATE_CODE', 'Product code already exists', 409);
  }

  const updated = productStore.update(id, {
    name: updateData.name,
    code: updateData.code,
    mainImageUrl: updateData.mainImageUrl,
    price: updateData.price,
    availabilityStatus: updateData.availabilityStatus,
    isFeatured: updateData.isFeatured,
    active: updateData.active,
    isPromotional: updateData.isPromotional,
    promotionalPrice: updateData.promotionalPrice,
  });

  return {
    ...updated!,
    isNew: productStore.isProductNew(updated!.createdDate),
  };
}

/**
 * @summary
 * Permanently deletes a product by its ID (soft delete).
 *
 * @function productDelete
 * @module services/product
 *
 * @param {unknown} params - Raw request params containing the ID
 * @returns {Promise<{ message: string }>} Success confirmation
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When product does not exist
 *
 * @example
 * const result = await productDelete({ id: 'uuid' });
 */
export async function productDelete(params: unknown): Promise<{ message: string }> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;

  if (!productStore.exists(id)) {
    throw new ServiceError('NOT_FOUND', 'Product not found', 404);
  }

  productStore.delete(id);
  return { message: 'Product deleted successfully' };
}

/**
 * @summary
 * Records product interaction (view, click, or interaction).
 *
 * @function productInteraction
 * @module services/product
 *
 * @param {unknown} body - Raw request body with interaction data
 * @returns {Promise<{ message: string }>} Success confirmation
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When product does not exist
 *
 * @example
 * await productInteraction({ productId: 'uuid', interactionType: 'click' });
 */
export async function productInteraction(body: unknown): Promise<{ message: string }> {
  const validation = interactionSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { productId, interactionType } = validation.data;
  const product = productStore.getById(productId);

  if (!product) {
    throw new ServiceError('NOT_FOUND', 'Product not found', 404);
  }

  // Update interaction counts
  const updates: Partial<ProductEntity> = {};

  if (interactionType === 'view') {
    updates.viewCount = product.viewCount + 1;
  } else if (interactionType === 'click') {
    updates.clickCount = product.clickCount + 1;
  } else if (interactionType === 'interaction') {
    updates.interactionCount = product.interactionCount + 1;
  }

  // Recalculate popularity score
  updates.popularityScore = productStore.calculatePopularityScore(
    updates.viewCount ?? product.viewCount,
    updates.clickCount ?? product.clickCount,
    updates.interactionCount ?? product.interactionCount
  );

  productStore.update(productId, updates);

  return { message: 'Interaction recorded successfully' };
}

/**
 * Helper function to sort products
 */
function sortProducts(products: ProductEntity[], sortCriteria: string): ProductEntity[] {
  const sorted = [...products];

  switch (sortCriteria) {
    case PRODUCT_SORT_CRITERIA.NAME_ASC:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case PRODUCT_SORT_CRITERIA.NAME_DESC:
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case PRODUCT_SORT_CRITERIA.PRICE_ASC:
      return sorted.sort((a, b) => {
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return a.price - b.price;
      });

    case PRODUCT_SORT_CRITERIA.PRICE_DESC:
      return sorted.sort((a, b) => {
        if (a.price === null) return 1;
        if (b.price === null) return -1;
        return b.price - a.price;
      });

    case PRODUCT_SORT_CRITERIA.DATE_NEWEST:
      return sorted.sort(
        (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );

    case PRODUCT_SORT_CRITERIA.DATE_OLDEST:
      return sorted.sort(
        (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );

    case PRODUCT_SORT_CRITERIA.POPULARITY:
      return sorted.sort((a, b) => b.popularityScore - a.popularityScore);

    default:
      return sorted;
  }
}

/**
 * Helper function to map ProductEntity to ProductListResponse
 */
function mapToListResponse(product: ProductEntity): ProductListResponse {
  return {
    id: product.id,
    name: product.name,
    code: product.code,
    mainImageUrl: product.mainImageUrl,
    price: product.price,
    availabilityStatus: product.availabilityStatus,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isPromotional: product.isPromotional,
    promotionalPrice: product.promotionalPrice,
  };
}
