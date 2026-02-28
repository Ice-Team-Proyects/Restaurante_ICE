import { Router } from "express";
import { 
    createOrder, 
    getOrders, 
    updateOrder, 
    deleteOrder 
} from "./order.controller.js";
import { validateCreateOrder } from '../../middleware/order-validator.js';

const router = Router();

router.get('/', getOrders);

router.post('/', validateCreateOrder, createOrder);

// Nuevas rutas
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;