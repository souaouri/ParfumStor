// models/product.ts
import pool from "../database/db";

export interface Product {
  id?: number;
  name: string;
  category: string; // New: 'original' or 'copy'
  sex: string; // New: 'men', 'women', or 'unisex'
  description?: string;
  full_bottle_price: number; // Changed from 'price'
  price_5ml: number; // New
  price_10ml: number; // New
  image?: string;
  image2?: string;
  stock?: number;
  status?: string;
}

export async function createProduct(product: Product): Promise<Product> {
  try {
    const result = await pool.query(
      `INSERT INTO products (
                name, 
                category, 
                sex, 
                description, 
                full_bottle_price, 
                price_5ml, 
                price_10ml, 
                image, 
                image2, 
                stock, 
                status
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`,
      [
        product.name,
        product.category,
        product.sex,
        product.description,
        product.full_bottle_price,
        product.price_5ml || 0,
        product.price_10ml || 0,
        product.image,
        product.image2,
        product.stock || 0,
        product.status || "available",
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC",
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id],
    );
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function updateProduct(
  id: number,
  product: Product,
): Promise<Product | null> {
  try {
    const result = await pool.query(
      `UPDATE products 
             SET 
                name = $1, 
                category = $2, 
                sex = $3, 
                description = $4, 
                full_bottle_price = $5, 
                price_5ml = $6, 
                price_10ml = $7, 
                image = $8, 
                image2 = $9, 
                stock = $10, 
                status = $11 
             WHERE id = $12 
             RETURNING *`,
      [
        product.name,
        product.category,
        product.sex,
        product.description,
        product.full_bottle_price,
        product.price_5ml || 0,
        product.price_10ml || 0,
        product.image,
        product.image2,
        product.stock || 0,
        product.status || "available",
        id,
      ],
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}
