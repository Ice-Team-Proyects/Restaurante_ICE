import { useEffect } from 'react';
import ReservationList from '../components/ReservationList';
import ReservationModal from '../components/ReservationModal';
import { useReservationStore } from '../store/reservationStore';
 
const ReservationsPage = () => {
  const { fetchReservations, setIsModalOpen } = useReservationStore();
 
  useEffect(() => {
    fetchReservations();
  }, []);
 
  return (
    <div className="animate-fadeIn relative">
      <div className="flex justify-between items-center mb-8">
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
 
      <ReservationList />
      <ReservationModal />
    </div>
  );
};
 
export default ReservationsPage;