import { useEffect } from 'react';
import RestaurantList from '../components/RestaurantList';
import RestaurantModal from '../components/RestaurantModal'; 
import { useRestaurantStore } from '../store/restaurantStore';

/* ─── STATS ROW ─── */
const StatsRow = ({ restaurants }) => {
  const total = restaurants.length;
  const activos = restaurants.filter((r) => r.isActive !== false).length;
  const inactivos = restaurants.filter((r) => r.isActive === false).length;

  const stats = [
    {
      label: 'Total Restaurantes',
      value: total,
      color: '#ea580c',
      bg: '#fff',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: 'Activos',
      value: activos,
      color: '#15803d',
      bg: '#fff',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: 'Inactivos',
      value: inactivos,
      color: '#b91c1c',
      bg: '#fff',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2.2"/>
          <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div
      className="mb-6"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl"
          style={{
            background: s.bg,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ flexShrink: 0 }}>{s.icon}</div>
          <div>
            <div style={{ color: s.color, fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: s.color, fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const RestaurantsPage = () => {
  const { fetchRestaurants, setIsModalOpen, restaurants } = useRestaurantStore();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="animate-fadeIn relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Restaurantes</h2>
          <p className="text-gray-500">Administra las sedes y ubicaciones de Restaurante ICE</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-main-orange text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
        >
          + Nuevo Restaurante
        </button>
      </div>

      <StatsRow restaurants={Array.isArray(restaurants) ? restaurants : []} />

      <RestaurantList />
      
      <RestaurantModal />
    </div>
  );
};

export default RestaurantsPage;
