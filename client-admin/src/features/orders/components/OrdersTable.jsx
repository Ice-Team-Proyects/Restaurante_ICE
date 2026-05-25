import { useEffect, useState } from 'react';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../../product/store/productStore';
import { useUIStore } from '../../auth/store/uiStore';
import { OrderForm } from './OrderForm';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  READY: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  PREPARING: 'Preparando',
  READY: 'Listo',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

export const OrdersTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const orders = useOrderStore((s) => s.orders);
  const loading = useOrderStore((s) => s.loading);
  const pagination = useOrderStore((s) => s.pagination);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const deleteOrder = useOrderStore((s) => s.deleteOrder);
  
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchOrders(1, 10, statusFilter);
  }, [statusFilter, fetchOrders]);

  const { openConfirm } = useUIStore();

  const getProductName = (productId) => {
    const product = products.find((p) => p._id === productId);
    return product?.saucer || 'Producto desconocido';
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    openConfirm({
      title: 'Eliminar Orden',
      message: '¿Estás seguro de que deseas eliminar esta orden?',
      onConfirm: async () => {
        try {
          await deleteOrder(id);
          toast.success('Orden eliminada correctamente');
        } catch (err) {
          toast.error(err.message || 'Error al eliminar la orden');
        }
      },
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedOrder(null);
    fetchOrders(pagination.currentPage, pagination.limit, statusFilter);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main-orange"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Filtros */}
        <div className="p-6 border-b border-slate-200 flex gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Filtrar por Estado
            </label>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-main-orange focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="PREPARING">Preparando</option>
              <option value="READY">Listo</option>
              <option value="DELIVERED">Entregado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Mesa</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Productos</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No hay órdenes registradas
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm text-slate-900">
                      Mesa {order.tableId?.number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="font-semibold">{getProductName(item.productId)}</span>
                            <span className="text-slate-500">x{item.quantity}</span>
                          </div>
                        )) || 'Sin productos'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-main-orange">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Página {pagination.currentPage} de {pagination.totalPages} ({pagination.totalRecords} órdenes)
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <OrderForm order={selectedOrder} onClose={handleCloseForm} />
      )}
    </>
  );
};
