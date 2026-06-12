import Swal from 'sweetalert2';
import { useReservationStore } from '../store/reservationStore';

const ReservationList = () => {
  const { reservations, deleteReservation } = useReservationStore();

  if (!reservations || reservations.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No hay reservaciones registradas.
      </div>
    );
  }

  const handleDelete = (id, name) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de desactivar la reservación de ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReservation(id);
        Swal.fire({
          title: 'Eliminada',
          text: 'La reservación ha sido desactivada.',
          icon: 'success',
          confirmButtonColor: '#F97316',
        });
      }
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('es-GT', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reservations.map((reservation) => (
        <div
          key={reservation._id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="bg-main-orange/10 px-5 py-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">
              {reservation.name_customer}
            </h3>
            <span
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                reservation.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {reservation.isActive ? 'Activa' : 'Inactiva'}
            </span>
          </div>

          <div className="p-5">
            <div className="space-y-1 mb-5">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Personas:</span>{' '}
                {reservation.number_people}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Fecha y hora:</span>{' '}
                {formatDate(reservation.time_reservation)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Mesa:</span>{' '}
                {reservation.table?.number
                  ? `Mesa ${reservation.table.number}`
                  : reservation.table || '—'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Sucursal:</span>{' '}
                {reservation.restaurant?.name || '—'}
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleDelete(reservation._id, reservation.name_customer)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;