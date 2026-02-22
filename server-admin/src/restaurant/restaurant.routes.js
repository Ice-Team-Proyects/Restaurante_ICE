import { Router } from "express";
import { createRestaurant, getRestaurants } from "./restaurant.controller.js";
import { validateCreateRestaurant } from '../../middleware/restaurant-validator.js';
import { uploadRestaurantImage } from "../../middleware/file-uploader.js";
import { cleanupUploadedFileOnFinish } from '../../middleware/delete-file-on-error.js';

const router = Router();

router.get('/', getRestaurants);

router.post(
    '/',
    uploadRestaurantImage.single('image'),
    cleanupUploadedFileOnFinish,
    validateCreateRestaurant,
    createRestaurant
);

export default router;