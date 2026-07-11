import { createTableRecord, fetchTables, fetchTableById, updateTableRecord, softDeleteTable, restoreTable } from './table.service.js';

export const createTable = async (req, res) => {
    try {
        const table = await createTableRecord({
            tableData: req.body,
            file: req.file
        });
        
        res.status(201).json({
            success: true,
            message: 'Mesa creada exitosamente',
            data: table
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la mesa',
            error: err.message
        });
    }
};

export const getTables = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive, restaurant } = req.query;
        // if user wants all mesas, omit isActive or pass 'all'
        const { tables, pagination } = await fetchTables({ page, limit, isActive, restaurant });

        res.status(200).json({
            success: true,
            message: 'Mesas listados exitosamente',
            data: tables,
            pagination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al listar las mesas registrados',
            error: err.message
        });
    }
};

export const getTableById = async (req, res) => {
    try {
        const table = await fetchTableById({ id: req.params.id });
        res.status(200).json({
            success: true,
            message: 'Mesa obtenida exitosamente',
            data: table
        });
    } catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Error al buscar la mesa',
        });
    }
};

export const updateTable = async (req, res) => {
    try {
        const table = await updateTableRecord({
            id: req.params.id,
            updateData: req.body
        });
        res.status(200).json({
            success: true,
            message: 'Mesa actualizada correctamente',
            data: table
        });
    } catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Error al actualizar la mesa'
        });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const table = await softDeleteTable({ id: req.params.id });
        res.status(200).json({
            success: true,
            message: 'Mesa eliminada (soft) correctamente',
            data: table
        });
    } catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Error al eliminar la mesa'
        });
    }
};

export const restoreDeletedTable = async (req, res) => {
    try {
        const table = await restoreTable({ id: req.params.id });
        res.status(200).json({
            success: true,
            message: 'Mesa restaurada correctamente',
            data: table
        });
    } catch (err) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Error al restaurar la mesa'
        });
    }
};