import { Request, Response } from 'express';
import { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct, Product } from '../models/product';
import fs from 'fs';
import path from 'path';

export const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, description, stock, status } = req.body;
        
        // Get image paths from uploaded files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const image = files?.image?.[0] ? `/uploads/${files.image[0].filename}` : undefined;
        const image2 = files?.image2?.[0] ? `/uploads/${files.image2[0].filename}` : undefined;

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const product = await createProduct({ 
            name, 
            price: parseFloat(price), 
            description, 
            image,
            image2, 
            stock: stock ? parseInt(stock) : 0, 
            status: status || 'available' 
        });
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

        // Get the product first to retrieve image paths
        const product = await getProductById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete image files if they exist
        if (product.image) {
            const imagePath = path.join(__dirname, '../../public', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        if (product.image2) {
            const image2Path = path.join(__dirname, '../../public', product.image2);
            if (fs.existsSync(image2Path)) {
                fs.unlinkSync(image2Path);
            }
        }

        // Delete product from database
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

        const { name, price, description, stock, status } = req.body;
        
        // Get the existing product to check for old images
        const existingProduct = await getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Get image paths from uploaded files, or keep existing if not uploaded
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        let image = req.body.image; // Existing image path from form
        let image2 = req.body.image2; // Existing image2 path from form
        
        // If new image uploaded, delete old one
        if (files?.image?.[0]) {
            if (existingProduct.image) {
                const oldImagePath = path.join(__dirname, '../../public', existingProduct.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            image = `/uploads/${files.image[0].filename}`;
        }
        
        // If new hover image uploaded, delete old one
        if (files?.image2?.[0]) {
            if (existingProduct.image2) {
                const oldImage2Path = path.join(__dirname, '../../public', existingProduct.image2);
                if (fs.existsSync(oldImage2Path)) {
                    fs.unlinkSync(oldImage2Path);
                }
            }
            image2 = `/uploads/${files.image2[0].filename}`;
        }

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const product = await updateProduct(id, { 
            name, 
            price: parseFloat(price), 
            description, 
            image,
            image2, 
            stock: stock ? parseInt(stock) : 0, 
            status: status || 'available' 
        });
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};