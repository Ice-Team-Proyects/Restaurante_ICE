import { createRestaurantRecord, fetchRestaurants, updateRestaurantRecord, deleteRestaurantRecord, restoreRestaurantRecord } from './restaurant.service.js';

export const createRestaurant = async (req, res) => {
    try {
        const restaurant = await createRestaurantRecord({
            restaurantData: req.body,
            file: req.file
        });
        res.status(201).json({ success: true, message: 'Restaurante creado exitosamente', data: restaurant });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al crear el restaurante', error: err.message });
    }
};

export const getRestaurants = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        const { restaurants, pagination } = await fetchRestaurants({ page, limit, isActive });
        res.status(200).json({ success: true, message: 'Restaurantes listados exitosamente', data: restaurants, pagination });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al listar los restaurantes registrados', error: err.message });
    }
};

// NUEVO: Actualizar restaurante
export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRestaurant = await updateRestaurantRecord(id, {
            restaurantData: req.body,
            file: req.file
        });
        
        if (!updatedRestaurant) return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        res.status(200).json({ success: true, message: 'Restaurante actualizado exitosamente', data: updatedRestaurant });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al actualizar el restaurante', error: err.message });
    }
};

// NUEVO: Eliminar restaurante (Soft Delete)
export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRestaurant = await deleteRestaurantRecord(id);
        
        if (!deletedRestaurant) return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        res.status(200).json({ success: true, message: 'Restaurante desactivado exitosamente (Soft Delete)', data: deletedRestaurant });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al eliminar el restaurante', error: err.message });
    }
};

// NUEVO: Restaurar restaurante
export const restoreRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const restoredRestaurant = await restoreRestaurantRecord(id);
        
        if (!restoredRestaurant) return res.status(404).json({ success: false, message: 'Restaurante no encontrado' });
        res.status(200).json({ success: true, message: 'Restaurante restaurado exitosamente', data: restoredRestaurant });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al restaurar el restaurante', error: err.message });
    }
};