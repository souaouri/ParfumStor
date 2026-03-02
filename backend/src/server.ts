import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import type { Request, Response } from 'express';
import pool from './database/db';
import productRoutes from './routes/ProductRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from public/uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});