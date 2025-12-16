/**
 * @summary
 * In-memory store instance for Product entity.
 * Provides singleton pattern for data storage without database.
 *
 * @module instances/product/productStore
 */

import { PRODUCT_DEFAULTS, PRODUCT_LIMITS } from '@/constants/product';
import { ProductAvailabilityStatus } from '@/constants';

/**
 * Product record structure
 */
export interface ProductRecord {
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
 * In-memory store for Product records
 */
class ProductStore {
  private records: Map<string, ProductRecord> = new Map();

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Get next available ID
   */
  getNextId(): string {
    return this.generateUUID();
  }

  /**
   * Get all active records
   */
  getAll(): ProductRecord[] {
    return Array.from(this.records.values()).filter((record) => record.active);
  }

  /**
   * Get record by ID
   */
  getById(id: string): ProductRecord | undefined {
    const record = this.records.get(id);
    return record && record.active ? record : undefined;
  }

  /**
   * Get record by code
   */
  getByCode(code: string): ProductRecord | undefined {
    return Array.from(this.records.values()).find(
      (record) => record.code === code && record.active
    );
  }

  /**
   * Add new record
   */
  add(record: ProductRecord): ProductRecord {
    if (this.records.size >= PRODUCT_DEFAULTS.MAX_PRODUCTS) {
      throw new Error('Maximum products limit reached');
    }
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Update existing record
   */
  update(id: string, data: Partial<ProductRecord>): ProductRecord | undefined {
    const existing = this.records.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...data };
    this.records.set(id, updated);
    return updated;
  }

  /**
   * Delete record by ID (soft delete)
   */
  delete(id: string): boolean {
    const existing = this.records.get(id);
    if (!existing) {
      return false;
    }
    existing.active = false;
    this.records.set(id, existing);
    return true;
  }

  /**
   * Check if record exists
   */
  exists(id: string): boolean {
    const record = this.records.get(id);
    return record !== undefined && record.active;
  }

  /**
   * Check if code exists
   */
  codeExists(code: string, excludeId?: string): boolean {
    return Array.from(this.records.values()).some(
      (record) => record.code === code && record.active && record.id !== excludeId
    );
  }

  /**
   * Get total count of active records
   */
  count(): number {
    return Array.from(this.records.values()).filter((record) => record.active).length;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.records.clear();
  }

  /**
   * Calculate if product is new (created within last 30 days)
   */
  isProductNew(createdDate: string): boolean {
    const created = new Date(createdDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= PRODUCT_LIMITS.NEW_PRODUCT_DAYS;
  }

  /**
   * Calculate popularity score
   */
  calculatePopularityScore(
    viewCount: number,
    clickCount: number,
    interactionCount: number
  ): number {
    return (
      viewCount * PRODUCT_LIMITS.VIEW_WEIGHT +
      clickCount * PRODUCT_LIMITS.CLICK_WEIGHT +
      interactionCount * PRODUCT_LIMITS.INTERACTION_WEIGHT
    );
  }

  /**
   * Update popularity scores for all products
   */
  updatePopularityScores(): void {
    const now = new Date().toISOString();
    this.records.forEach((record) => {
      if (record.active) {
        record.popularityScore = this.calculatePopularityScore(
          record.viewCount,
          record.clickCount,
          record.interactionCount
        );
        record.lastPopularityUpdate = now;
      }
    });
  }
}

/**
 * Singleton instance of ProductStore
 */
export const productStore = new ProductStore();
