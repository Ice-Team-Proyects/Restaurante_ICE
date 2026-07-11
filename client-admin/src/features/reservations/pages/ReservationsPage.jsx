import { useEffect } from 'react';
import { CalendarCheck, Plus, Clock, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import ReservationList from '../components/ReservationList';
import ReservationModal from '../components/ReservationModal';
import { useReservationStore } from '../store/reservationStore';
import AdminPageHeader from '../../../shared/components/ui/AdminPageHeader';

/* ─── STATS ROW ─── */
const StatsRow = ({ reservations }) => {
  const total     = reservations.length;
  const activas   = reservations.filter((r) => r.isActive !== false).length;
  const inactivas = reservations.filter((r) => r.isActive === false).length;
  const hoy       = reservations.filter((r) => {
    if (!r.time_reservation) return false;
    const d   = new Date(r.time_reservation);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }).length;

  const stats = [
    { label: 'Total',     value: total,     icon: Calendar,      color: '#ff5722' },
    { label: 'Activas',   value: activas,   icon: CheckCircle2,  color: '#22c55e' },
    { label: 'Inactivas', value: inactivas, icon: XCircle,       color: '#ef4444' },
    { label: 'Hoy',       value: hoy,       icon: Clock,         color: '#3b82f6' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-2xl font-semibold mt-1" style={{ color }}>{value}</p>
          </div>
          <Icon size={24} style={{ color }} strokeWidth={1.75} />
        </div>
      ))}
    </div>
  );
};

/* ─── PAGE ─── */
const ReservationsPage = () => {
  const { fetchReservations, setIsModalOpen, reservations } = useReservationStore();

  useEffect(() => { fetchReservations(); }, []);

  return (
    <div className="animate-fadeIn">
      <AdminPageHeader
        icon={CalendarCheck}
        title="Gestión de Reservaciones"
        subtitle="Administra las reservaciones de Restaurante ICE"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-main-orange text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} /> Nueva Reservación
          </button>
        }
      />
      <StatsRow reservations={Array.isArray(reservations) ? reservations : []} />
      <ReservationList />
      <ReservationModal />
    </div>
  );
};

export default ReservationsPage;
