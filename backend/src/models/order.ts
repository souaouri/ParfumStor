import pool from '../database/db';

export interface Order {
    id?: number;
    customerName: string;
    phone: string;
    location: string;
    productName: string;
    size: string;
    quantity: number;
    totalPrice: number;
    status?: 'pending' | 'done';
    createdAt?: string;
}

export async function createOrder(order: Order): Promise<Order> {
    try {
        const result = await pool.query(
            `INSERT INTO orders (
                customer_name,
                phone,
                location,
                product_name,
                size,
                quantity,
                total_price,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                order.customerName,
                order.phone,
                order.location,
                order.productName,
                order.size,
                order.quantity,
                order.totalPrice,
                order.status || 'pending',
            ]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function getAllOrders(): Promise<Order[]> {
    try {
        const result = await pool.query(
            `SELECT 
                id,
                customer_name AS "customerName",
                phone,
                location,
                product_name AS "productName",
                size,
                quantity,
                total_price AS "totalPrice",
                status,
                created_at AS "createdAt"
             FROM orders
             ORDER BY created_at DESC`
        );

        return result.rows;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}

export async function updateOrderStatus(id: number, status: 'pending' | 'done'): Promise<Order | null> {
    try {
        const result = await pool.query(
            `UPDATE orders
             SET status = $1
             WHERE id = $2
             RETURNING 
                id,
                customer_name AS "customerName",
                phone,
                location,
                product_name AS "productName",
                size,
                quantity,
                total_price AS "totalPrice",
                status,
                created_at AS "createdAt"`,
            [status, id]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

export async function deleteOrder(id: number): Promise<boolean> {
    try {
        const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
}
