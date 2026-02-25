import { Request, Response } from 'express';
import { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct, Product } from '../models/product';

export const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, description, image, stock, status } = req.body as Product;

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const product = await createProduct({ name, price, description, image, stock, status });
        return res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await getAllProducts();
        return res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const idParam = req.params.id;
        const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await getProductById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeProduct = async (req: Request, res: Response) => {
    try {
        const idParam = req.params.id;
        const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const deleted = await deleteProduct(id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const modifyProduct = async (req: Request, res: Response) => {
    try {
        const idParam = req.params.id;
        const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const { name, price, description, image, stock, status } = req.body as Product;

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const product = await updateProduct(id, { name, price, description, image, stock, status });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};