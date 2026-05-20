import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import type { Request, Response } from 'express';
import pool from './database/db';
import productRoutes from './routes/ProductRoutes';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from public/uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});