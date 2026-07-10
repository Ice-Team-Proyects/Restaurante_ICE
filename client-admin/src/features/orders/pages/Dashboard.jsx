import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  ChefHat,
  CheckCircle2,
} from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../../product/store/productStore';

const STATUS_COLORS = {
  PENDING: 'text-status-pending',
  PREPARING: 'text-status-prep',
  READY: 'text-status-ready',
  DELIVERED: 'text-purple-600',
  CANCELLED: 'text-red-600',
};

const STATUS_LABELS = {
  PENDING: 'Pendiente',
  PREPARING: 'Preparando',
  READY: 'Listo',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const isToday = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const StatCard = ({ label, value, icon: Icon, accentClass }) => (
  <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${accentClass}`}>{value}</p>
    </div>
    <Icon className={accentClass} size={28} strokeWidth={1.75} />
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const orders = useOrderStore((s) => s.orders);
  const loading = useOrderStore((s) => s.loading);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchOrders(1, 100);
    fetchProducts();
  }, [fetchOrders, fetchProducts]);

  const stats = useMemo(() => {
    const todayOrders = orders.filter((o) => isToday(o.createdAt));
    const countByStatus = (status) => orders.filter((o) => o.status === status).length;

    return {
      todayCount: todayOrders.length,
      pending: countByStatus('PENDING'),
      preparing: countByStatus('PREPARING'),
      ready: countByStatus('READY'),
    };
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const getProductName = (productId) => {
    const product = products.find((p) => p._id === productId);
    return product?.saucer || 'Producto';
  };

  return (
    <div className="animate-fadeIn space-y-4">
      <h2 className="text-2xl font-bold text-gray-700">Órdenes activas</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Pedidos hoy"
          value={stats.todayCount}
          icon={ClipboardList}
          accentClass="text-main-orange"
        />
        <StatCard
          label="Pendientes"
          value={stats.pending}
          icon={Clock}
          accentClass="text-status-pending"
        />
        <StatCard
          label="Preparando"
          value={stats.preparing}
          icon={ChefHat}
          accentClass="text-status-prep"
        />
        <StatCard
          label="Listos"
          value={stats.ready}
          icon={CheckCircle2}
          accentClass="text-status-ready"
        />
      </div>

      <div className="bg-white rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Últimas órdenes</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-main-orange hover:underline"
          >
            Ver todas
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main-orange"></div>
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No hay órdenes registradas</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <span className="font-medium text-gray-700">
                    Mesa {order.tableId?.number || 'N/A'}
                  </span>
                  <span className="text-gray-400">
                    {' · '}
                    {order.items?.map((item) => getProductName(item.productId)).join(', ') || 'Sin productos'}
                  </span>
                </div>
                <span className={`font-semibold ${STATUS_COLORS[order.status] || 'text-gray-500'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
