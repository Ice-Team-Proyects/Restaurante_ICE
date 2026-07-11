import {
    fetchMenus,
    createMenu  as createMenuService,
    updateMenu  as updateMenuService,
    deleteMenu  as deleteMenuService,
    restoreMenu as restoreMenuService,
} from './menu.service.js';

export const getMenus = async (req, res) => {
    try {
        const { page = 1, limit = 100, isActive = 'true' } = req.query;
        const result = await fetchMenus({ page, limit, isActive: isActive !== 'false' });
        res.status(200).json({ success: true, data: result.menus, pagination: result.pagination });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener los menús', error: error.message });
    }
};

export const createMenu = async (req, res) => {
    try {
        const { name, description, products } = req.body;
        const menu = await createMenuService({ name, description, products });
        res.status(201).json({ success: true, message: 'Menú creado correctamente', data: menu });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear el menú', error: error.message });
    }
};

export const updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await updateMenuService(id, req.body);
        if (!menu) return res.status(404).json({ success: false, message: 'Menú no encontrado' });
        res.status(200).json({ success: true, message: 'Menú actualizado correctamente', data: menu });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el menú', error: error.message });
    }
};

export const deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await deleteMenuService(id);
        if (!menu) return res.status(404).json({ success: false, message: 'Menú no encontrado' });
        res.status(200).json({ success: true, message: 'Menú eliminado correctamente', data: menu });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el menú', error: error.message });
    }
};

export const restoreMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await restoreMenuService(id);
        if (!menu) return res.status(404).json({ success: false, message: 'Menú no encontrado' });
        res.status(200).json({ success: true, message: 'Menú restaurado correctamente', data: menu });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al restaurar el menú', error: error.message });
    }
};