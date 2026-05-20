import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: 'soulaymanouaourikt',
    host: 'localhost',
    database: 'parfumstore',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

async function initializeDatabase() {
    try{
        const connect = await pool.query('SELECT NOW()');
        console.log('Database connected:', connect.rows[0]);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                photoprofile VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                image VARCHAR(255),
                image2 VARCHAR(255),
                stock INTEGER DEFAULT 0,
                status VARCHAR(50) DEFAULT 'available',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                product_id INTEGER REFERENCES products(id),
                customer_name VARCHAR(255),
                phone VARCHAR(50),
                location TEXT,
                product_name VARCHAR(255),
                size VARCHAR(50),
                quantity INTEGER NOT NULL DEFAULT 1,
                total_price DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

        await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)`);
        await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`);
        await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS location TEXT`);
        await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_name VARCHAR(255)`);
        await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS size VARCHAR(50)`);
        await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'`);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
        

        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

initializeDatabase();

export default pool;