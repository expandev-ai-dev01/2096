/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as productController from '@/api/internal/product/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Product routes - /api/internal/product
 */
router.get('/product', productController.catalogHandler);
router.post('/product', productController.createHandler);
router.get('/product/:id', productController.getHandler);
router.put('/product/:id', productController.updateHandler);
router.delete('/product/:id', productController.deleteHandler);
router.post('/product/interaction', productController.interactionHandler);

export default router;
