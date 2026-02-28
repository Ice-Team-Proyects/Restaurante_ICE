import { createCategoryRecord as createCategoryService, fetchCategorys } from './category.service.js';
import { Category } from './category.model.js'

export const createCategoryRecord = async (req, res) => {
    try {
        const category = await createCategoryService({
            categoryDataData: req.body,
            file: req.file
        });
        
        res.status(201).json({
            success: true,
            message: 'Categoria Creado Exitosamente',
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
        const { page = 1, limit = 10, isActive = true } = req.query;
        const active = isActive === 'true';
        
        const { category, pagination } = await fetchCategorys({ page, limit, isActive:active});

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

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });

    res.json({ message: 'Categoría eliminada', category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const restoreCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });

    res.json({ message: 'Categoría restaurada', category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};