import { 
    createAnalyticsRecord, 
    fetchAnalytics, 
    updateAnalyticsRecord, 
    deleteAnalyticsRecord, 
    restoreAnalyticsRecord 
} from './analytics.service.js';

export const createAnalytics = async (req, res) => {
    try {
        const analytics = await createAnalyticsRecord({
            analyticsData: req.body
        });
        
        res.status(201).json({
            success: true,
            message: 'Registro analítico creado exitosamente',
            data: analytics
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el registro analítico',
            error: err.message
        });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true, type } = req.query;
        // Permite filtrar desde la URL (ej. ?type=DASHBOARD)
        const active = isActive === 'true' || isActive === true;

        const { analyticsRecords, pagination } = await fetchAnalytics({ page, limit, isActive: active, type });

        res.status(200).json({
            success: true,
            message: 'Registros analíticos listados exitosamente',
            data: analyticsRecords,
            pagination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al listar los registros analíticos',
            error: err.message
        });
    }
};

export const updateAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAnalytics = await updateAnalyticsRecord(id, req.body);

        if (!updatedAnalytics) {
            return res.status(404).json({ success: false, message: 'Registro no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Registro analítico actualizado exitosamente',
            data: updatedAnalytics
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al actualizar el registro', error: err.message });
    }
};

export const deleteAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnalytics = await deleteAnalyticsRecord(id);

        if (!deletedAnalytics) {
            return res.status(404).json({ success: false, message: 'Registro no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Registro desactivado exitosamente (Soft Delete)',
            data: deletedAnalytics
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al eliminar el registro', error: err.message });
    }
};

export const restoreAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const restoredAnalytics = await restoreAnalyticsRecord(id);

        if (!restoredAnalytics) {
            return res.status(404).json({ success: false, message: 'Registro no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Registro analítico restaurado exitosamente',
            data: restoredAnalytics
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al restaurar el registro', error: err.message });
    }
};