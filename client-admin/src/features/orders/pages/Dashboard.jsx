import { useState, useEffect } from 'react';
import { OrdersTable } from '../components/OrdersTable';
import { OrderForm } from '../components/OrderForm';
import { useOrderStore } from '../store/orderStore';

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Órdenes Activas</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-gradient-to-r from-main-orange to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
        >
          + Nueva Orden
        </button>
      </div>

      {/* Tabla de órdenes */}
      <OrdersTable />

      {/* Modal de crear orden */}
      {showForm && <OrderForm onClose={() => setShowForm(false)} />}
    </div>
  );
}