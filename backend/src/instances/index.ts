/**
 * @summary
 * Centralized service instances exports.
 * Provides single import point for all service configurations and instances.
 *
 * @module instances
 */

/**
 * Product instances
 */
export { productStore, type ProductRecord } from './product';

/**
 * Gallery instances
 */
export {
  galleryStore,
  type GalleryRecord,
  type GalleryImageRecord,
  type ProductVariationRecord,
} from './gallery';
