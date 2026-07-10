import Swal from 'sweetalert2';
import { Trash2, Users, Clock, LayoutGrid, Store } from 'lucide-react';
import { useReservationStore } from '../store/reservationStore';

const ReservationList = () => {
  const { reservations, deleteReservation } = useReservationStore();

  if (!reservations || reservations.length === 0)
    return <div className="bg-white rounded-2xl p-10 text-center text-gray-400">No hay reservaciones registradas.</div>;

  const handleDelete = (id, name) => {
    Swal.fire({
      title: '¿Estás seguro?', text: `Estás a punto de desactivar la reservación de ${name}`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#EF4444', cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReservation(id);
        Swal.fire({ title: 'Eliminada', text: 'La reservación ha sido desactivada.', icon: 'success', confirmButtonColor: '#F97316' });
      }
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('es-GT', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {reservations.map((r) => (
        <div key={r._id} className="bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#fff0e9' }}>
            <h3 className="text-base font-semibold text-gray-800">{r.name_customer}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              r.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {r.isActive ? 'Activa' : 'Inactiva'}
            </span>
          </div>

          {/* Detalles */}
          <div className="p-5 space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2"><Users size={14} className="text-main-orange shrink-0" />{r.number_people} personas</p>
            <p className="flex items-center gap-2"><Clock size={14} className="text-main-orange shrink-0" />{formatDate(r.time_reservation)}</p>
            <p className="flex items-center gap-2"><LayoutGrid size={14} className="text-main-orange shrink-0" />{r.table?.number ? `Mesa ${r.table.number}` : r.table || '—'}</p>
            <p className="flex items-center gap-2"><Store size={14} className="text-main-orange shrink-0" />{r.restaurant?.name || '—'}</p>
          </div>

          {/* Acciones */}
          <div className="px-5 pb-4 flex justify-end border-t border-gray-100 pt-3">
            <button
              onClick={() => handleDelete(r._id, r.name_customer)}
              className="p-2 rounded-xl bg-bg-light text-gray-500 hover:text-red-500 transition"
              aria-label="Eliminar reservación"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;
