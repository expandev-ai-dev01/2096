/**
 * @summary
 * Centralized exports for Product service.
 *
 * @module services/product
 */

export * from './productTypes';
export * from './productService';
export {
  createSchema,
  updateSchema,
  paramsSchema as productParamsSchema,
  catalogRequestSchema,
  interactionSchema,
  type CreateInput,
  type UpdateInput,
  type ParamsInput as ProductParamsInput,
  type CatalogRequestInput,
  type InteractionInput,
} from './productValidation';
