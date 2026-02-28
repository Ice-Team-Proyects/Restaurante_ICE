import Order from './order.model.js';

export const createOrderRecord = async ({ orderData }) => {
    const data = { ...orderData };

    // Si no viene el totalAmount, lo calculamos sumando (precio * cantidad) de cada item
    if (!data.totalAmount && data.items && data.items.length > 0) {
        data.totalAmount = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    }

    const order = new Order(data);
    await order.save();
    return order;
};

export const fetchOrders = async ({
    page = 1,
    limit = 10,
    isActive = true,
    status // Agregamos status por si quieres filtrar solo los PENDING
}) => {
    const filter = { isActive };
    if (status) filter.status = status;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const orders = await Order.find(filter)
        .limit(limitNumber * 1)
        .skip((pageNumber - 1) * limitNumber)
        .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    return {
        orders,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalRecords: total,
            limit: limitNumber,
        },
    };
};
// Actualizar un pedido (UPDATE)
export const updateOrderRecord = async (id, updateData) => {
    // Buscamos y actualizamos. { new: true } devuelve el objeto ya cambiado.
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { 
        new: true, 
        runValidators: true 
    });
    return updatedOrder;
};

// Eliminar un pedido (SOFT DELETE)
export const deleteOrderRecord = async (id) => {
    // En lugar de borrar, cambiamos isActive a false
    const deletedOrder = await Order.findByIdAndUpdate(
        id, 
        { isActive: false }, 
        { new: true }
    );
    return deletedOrder;
};