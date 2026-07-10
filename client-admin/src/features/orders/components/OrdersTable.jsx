import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
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
      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Filtros */}
        <div className="p-5 border-b border-gray-100 flex gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Filtrar por estado
            </label>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="px-4 py-2 bg-bg-light border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-main-orange focus:border-transparent"
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
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Mesa</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Productos</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Fecha</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-400">
                    No hay órdenes registradas
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-bg-light/60 transition">
                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">
                      Mesa {order.tableId?.number || 'N/A'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <span className="font-medium">{getProductName(item.productId)}</span>
                            <span className="text-gray-400">x{item.quantity}</span>
                          </div>
                        )) || 'Sin productos'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-main-orange">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="p-2 rounded-full bg-bg-light text-gray-500 hover:text-main-orange transition"
                          aria-label="Editar orden"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-2 rounded-full bg-bg-light text-gray-500 hover:text-red-500 transition"
                          aria-label="Eliminar orden"
                        >
                          <Trash2 size={15} />
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
          <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-500">
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
