import express from 'express';
import { addProduct, getProducts, getProduct, removeProduct, modifyProduct } from '../controllers/productControllers';

const router = express.Router();

// POST /api/products - Add a new product
router.post('/', addProduct);

// GET /api/products - Get all products
router.get('/', getProducts);

// GET /api/products/:id - Get a single product by ID
router.get('/:id', getProduct);

// PUT /api/products/:id - Update a product by ID
router.put('/:id', modifyProduct);

// DELETE /api/products/:id - Delete a product by ID
router.delete('/:id', removeProduct);

export default router;