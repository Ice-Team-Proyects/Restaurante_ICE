import { useEffect } from 'react';
import ReservationList from '../components/ReservationList';
import ReservationModal from '../components/ReservationModal';
import { useReservationStore } from '../store/reservationStore';

/* ─── STATS ROW ─── */
const StatsRow = ({ reservations }) => {
  const total = reservations.length;
  const activas = reservations.filter((r) => r.isActive !== false).length;
  const inactivas = reservations.filter((r) => r.isActive === false).length;
  const hoy = reservations.filter((r) => {
    if (!r.time_reservation) return false;
    const d = new Date(r.time_reservation);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }).length;

  const stats = [
    {
      label: 'Total Reservaciones',
      value: total,
      color: '#ea580c',
      bg: '#fff7ed',
      border: '#fdba74',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#ea580c" strokeWidth="2.2"/>
          <path d="M16 2v4M8 2v4M3 10h18" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: 'Activas',
      value: activas,
      color: '#15803d',
      bg: '#dcfce7',
      border: '#86efac',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: 'Inactivas',
      value: inactivas,
      color: '#b91c1c',
      bg: '#fee2e2',
      border: '#fca5a5',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2.2"/>
          <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: 'Hoy',
      value: hoy,
      color: '#1d4ed8',
      bg: '#dbeafe',
      border: '#93c5fd',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2.2"/>
          <path d="M12 7v5l3 3" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round"/>
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
          className="rounded-2xl transition hover:scale-[1.02]"
          style={{
            background: s.bg,
            border: `1.5px solid ${s.border}`,
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

const ReservationsPage = () => {
  const { fetchReservations, setIsModalOpen, reservations } = useReservationStore();
 
  useEffect(() => {
    fetchReservations();
  }, []);
 
  return (
    <div className="animate-fadeIn relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Reservaciones</h2>
          <p className="text-gray-500">Administra las reservaciones de Restaurante ICE</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-main-orange text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-orange-600 transition-colors"
        >
          + Nueva Reservación
        </button>
      </div>

      <StatsRow reservations={Array.isArray(reservations) ? reservations : []} />
 
      <ReservationList />
      <ReservationModal />
    </div>
  );
};
 
export default ReservationsPage;
