import { createCategoryRecord, fetchCategorys } from './category.service.js';

export const createCategoryRecord = async (req, res) => {
    try {
        const category = await createCategoryRecord({
            restaurantData: req.body,
            file: req.file
        });
        
        res.status(201).json({
            success: true,
            message: 'Categoria Creado Exitosamente',
            data: menu
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Crear la Categoria',
            error: err.message
        });
    }
};

export const getCategorys = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        
        const { category, pagination } = await fetchCategorys({ page, limit, isActive });

        res.status(200).json({
            success: true,
            message: 'Categorias Listados Exitosamente',
            data: category,
            pagination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Listar las Categorias Registrados',
            error: err.message
        });
    }
};