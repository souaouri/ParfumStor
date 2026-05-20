import express from 'express';
import { addOrder, changeOrderStatus, getOrders, removeOrder } from '../controllers/orderControllers';

const router = express.Router();

router.post('/', addOrder);
router.get('/', getOrders);
router.patch('/:id/status', changeOrderStatus);
router.delete('/:id', removeOrder);

export default router;
