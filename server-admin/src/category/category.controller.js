import { 
    createCategoryRecord as createCategoryService, 
    fetchCategorys, 
    deleteCategory as deleteCategoryService, 
    restoreCategory as restoreCategoryService 
} from './category.service.js';

export const createCategoryRecord = async (req, res) => {
    try {

        const category = await createCategoryService({
            categoryData: req.body
        });
        
        res.status(201).json({
            success: true,
            message: 'Categoria Creada Exitosamente',
            data: category
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
        const { page = 1, limit = 10, isActive } = req.query;
        
        const active = isActive !== 'false'; 
        
        const { category, pagination } = await fetchCategorys({ 
            page, 
            limit, 
            isActive: active 
        });

        res.status(200).json({
            success: true,
            message: 'Categorias Listadas Exitosamente',
            data: category,
            pagination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al Listar las Categorias',
            error: err.message
        });
    }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // LLAMAMOS AL SERVICIO, no al modelo Category que no existe aquí
    const category = await deleteCategoryService(id);

    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ success: true, message: 'Categoría eliminada', data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const restoreCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // LLAMAMOS AL SERVICIO
    const category = await restoreCategoryService(id);

    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ success: true, message: 'Categoría restaurada', data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};