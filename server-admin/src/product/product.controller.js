import { createProductRecord as createProductService, fetchProducts, deleteProduct as deleteProductService, restoreProduct as restoreProductService } from './product.service.js';

export const createProductRecord = async (req, res) => {
    try {
        const menu = await createProductService({
            restaurantData: req.body,
            file: req.file
        });
        
        res.status(201).json({
            success: true,
            message: 'Platillo Creado Exitosamente',
            data: menu
        });
    } catch (err) {
        res.status(500).json({  
            success: false,
            message: 'Error al Crear el Platillo',
            error: err.message
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;
        
        const { products, pagination } = await fetchProducts({ page, limit, isActive });

        res.status(200).json({
            success: true,
            message: 'Platillo Listados Exitosamente',
            data: products,
            pagination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Listar los Platillo Registrados',
            error: err.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await deleteProductService(id);

        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        res.json({ success: true, message: 'Producto eliminado', data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al eliminar el producto', error: err.message });
    }
};

export const restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await restoreProductService(id);

        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        res.json({ success: true, message: 'Producto restaurado', data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al restaurar el producto', error: err.message });
    }
};