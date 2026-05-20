import { Request, Response } from 'express';
import { createOrder, deleteOrder, getAllOrders, updateOrderStatus } from '../models/order';

export const addOrder = async (req: Request, res: Response) => {
    try {
        const {
            customerName,
            phone,
            location,
            productName,
            size,
            quantity,
            totalPrice,
        } = req.body;

        if (!customerName || !phone || !location || !productName || !size || !quantity || !totalPrice) {
            return res.status(400).json({ message: 'All order fields are required' });
        }

        const order = await createOrder({
            customerName,
            phone,
            location,
            productName,
            size,
            quantity: parseInt(quantity, 10),
            totalPrice: parseFloat(totalPrice),
            status: 'pending',
        });

        return res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getOrders = async (_req: Request, res: Response) => {
    try {
        const orders = await getAllOrders();
        return res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const changeOrderStatus = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        if (status !== 'pending' && status !== 'done') {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await updateOrderStatus(id, status);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeOrder = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        const deleted = await deleteOrder(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
