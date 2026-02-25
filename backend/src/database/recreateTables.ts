import pool from './db';

async function recreateTables() {
    try {
        // Drop existing tables and sequences
        await pool.query('DROP TABLE IF EXISTS cart CASCADE');
        await pool.query('DROP TABLE IF EXISTS orders CASCADE');
        await pool.query('DROP TABLE IF EXISTS products CASCADE');
        await pool.query('DROP SEQUENCE IF EXISTS products_id_seq CASCADE');
        console.log('Old tables dropped');

        // Recreate products table with correct schema
        await pool.query(`
            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                stock INTEGER DEFAULT 0,
                status VARCHAR(50) DEFAULT 'available',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Products table created successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

recreateTables();
