import pool from '../database/db';

export interface Product {
    id?: number;
    name: string;
    price: number;
    description?: string;
    image?: string;
    stock?: number;
    status?: string;
}

export async function createProduct(product: Product): Promise<Product> {
    try {
        const result = await pool.query(
            `INSERT INTO products (name, price, description, image, stock, status) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [product.name, product.price, product.description, product.image, product.stock || 0, product.status || 'available']
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export async function getAllProducts(): Promise<Product[]> {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function getProductById(id: number): Promise<Product | null> {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

export async function deleteProduct(id: number): Promise<boolean> {
    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export async function updateProduct(id: number, product: Product): Promise<Product | null> {
    try {
        const result = await pool.query(
            `UPDATE products 
             SET name = $1, price = $2, description = $3, image = $4, stock = $5, status = $6 
             WHERE id = $7 
             RETURNING *`,
            [product.name, product.price, product.description, product.image, product.stock || 0, product.status || 'available', id]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}