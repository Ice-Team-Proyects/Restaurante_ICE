import { Router } from "express";
import { 
    createAnalytics, 
    getAnalytics, 
    updateAnalytics, 
    deleteAnalytics, 
    restoreAnalytics 
} from "./analytics.controller.js";
import { validateCreateAnalytics } from '../../middleware/analytics-validator.js';

const router = Router();

router.get('/', getAnalytics);

router.post(
    '/',
    validateCreateAnalytics,
    createAnalytics
);

router.put('/:id', updateAnalytics);
router.patch('/delete/:id', deleteAnalytics);  
router.patch('/restore/:id', restoreAnalytics); 

export default router;