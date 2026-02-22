import { createRestaurantRecord, fetchRestaurants } from './restaurant.service.js';

export const createRestaurant = async (req, res) => {
    try {
        const restaurant = await createRestaurantRecord({
            restaurantData: req.body,
            file: req.file
        });
        
        res.status(201).json({
            success: true,
            message: 'Restaurante creado exitosamente',
            data: restaurant
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el restaurante',
            error: err.message
        });
    }
};

export const getRestaurants = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        const { restaurants, pagination } = await fetchRestaurants({ page, limit, isActive });

        res.status(200).json({
            success: true,
            message: 'Restaurantes listados exitosamente',
            data: restaurants,
            pagination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al listar los restaurantes registrados',
            error: err.message
        });
    }
};