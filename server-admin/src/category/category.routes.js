import { Router } from "express";
import { 
    createCategoryRecord,
    getCategorys, 
    deleteCategory, 
    restoreCategory 
} from "./category.controller.js";
import { validateCreateCategory } from '../../middleware/category-validator.js'; 

const router = Router();

router.get('/', getCategorys);
router.post(
    '/',
    validateCreateCategory,
    createCategoryRecord
);  
router.patch('/delete/:id', deleteCategory);
router.patch('/restore/:id', restoreCategory);

export default router;