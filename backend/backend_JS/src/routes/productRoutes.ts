import express from 'express';
import ProductController from '../controllers/ProductController';
import { validateProductData } from '../middleware/validationMiddleware';

const router = express.Router();

// GET /product/all - Get all products
router.get('/all', ProductController.getAllProducts);

// GET /product/{productId} - Get product by ID
router.get('/:productId', ProductController.getProductById);

// POST /product - Create a new product
router.post('/', validateProductData, ProductController.createProduct);

// PUT /product/{productId} - Update an existing product
router.put('/:productId', validateProductData, ProductController.updateProduct);

// DELETE /product/{productId} - Delete a product
router.delete('/:productId', ProductController.deleteProduct);

export default router; 