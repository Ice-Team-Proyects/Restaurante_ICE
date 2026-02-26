import { Router } from "express";
import { createCategoryRecord } from "./category.controller.js";
import { validateCreateCategory } from '../../middleware/category-validator.js'; 

const router = Router();

router.get('/', getproductss);

router.post(
    '/',
    validateCreateCategory,
    createCategoryRecord
);

export default router;