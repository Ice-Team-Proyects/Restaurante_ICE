import { 
    createOrderRecord, 
    fetchOrders, 
    updateOrderRecord, 
    deleteOrderRecord 
} from './order.service.js';

// 1. Crear pedido (POST)
export const createOrder = async (req, res) => {
    try {
        const order = await createOrderRecord({
            orderData: req.body
        });
        
        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data: order
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el pedido',
            error: err.message
        });
    }
};

// 2. Obtener pedidos (GET)
export const getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true, status } = req.query;
        const { orders, pagination } = await fetchOrders({ page, limit, isActive, status });

        res.status(200).json({
            success: true,
            message: 'Pedidos listados exitosamente',
            data: orders,
            pagination
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al listar los pedidos registrados',
            error: err.message
        });
    }
};

// 3. Actualizar pedido (PUT)
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await updateOrderRecord(id, req.body);

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pedido actualizado exitosamente',
            data: updatedOrder
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el pedido',
            error: err.message
        });
    }
};

// 4. Eliminar pedido con Soft Delete (DELETE)
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await deleteOrderRecord(id);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pedido desactivado exitosamente (Soft Delete)',
            data: deletedOrder
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el pedido',
            error: err.message
        });
    }
};