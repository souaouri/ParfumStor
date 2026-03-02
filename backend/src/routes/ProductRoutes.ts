import express from 'express';
import { addProduct, getProducts, getProduct, removeProduct, modifyProduct } from '../controllers/productControllers';
import { upload } from '../middleware/upload';

const router = express.Router();

// POST /api/products - Add a new product (with image upload)
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), addProduct);

// GET /api/products - Get all products
router.get('/', getProducts);

// GET /api/products/:id - Get a single product by ID
router.get('/:id', getProduct);

// PUT /api/products/:id - Update a product by ID (with optional image upload)
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), modifyProduct);

// DELETE /api/products/:id - Delete a product by ID
router.delete('/:id', removeProduct);

export default router;