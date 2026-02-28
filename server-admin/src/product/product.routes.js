import { Router } from "express";
import {
    createProductRecord,
    getProducts,
    deleteProduct,
    restoreProduct
} from "./product.controller.js";
import { validateCreateProduct } from '../../middleware/product-validator.js'; 
import { uploadMenuImage } from "../../middleware/file-uploader.js"; 
import { cleanupUploadedFileOnFinish } from '../../middlewares/delete-file-on-error.js'

const router = Router();

router.get('/', getProducts);
router.post(
    '/',
    uploadMenuImage.single('image'),
    cleanupUploadedFileOnFinish,
    validateCreateProduct,
    createProductRecord
);
router.patch('/delete/:id', deleteProduct);
router.patch('/restore/:id', restoreProduct);

export default router;