import {Client} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        password: process.env.DB_PASSWORD,
        port: 5432,
    });

    await client.connect();
    await client.query('CREATE DATABASE parfumstore');
    await client.end();

    console.log("Database created!");
}

createDatabase().catch(err => console.error('Error creating database', err));