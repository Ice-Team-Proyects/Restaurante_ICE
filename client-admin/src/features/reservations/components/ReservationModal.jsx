import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useReservationStore } from '../store/reservationStore';
import { useTablesStore } from '../../tables/store/tablesStore';
import { useRestaurantStore } from '../../restaurants/store/restaurantStore';

const ReservationModal = () => {
  const { isModalOpen, setIsModalOpen, createReservation, selectedReservation, setSelectedReservation } =
    useReservationStore();
  const { tables, fetchTables } = useTablesStore();
  const { restaurants, fetchRestaurants } = useRestaurantStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRestaurantId = watch('restaurant');

  useEffect(() => {
    if (isModalOpen) {
      fetchRestaurants();
    }
  }, [isModalOpen, fetchRestaurants]);

  useEffect(() => {
    if (isModalOpen && selectedRestaurantId) {
      fetchTables({ restaurant: selectedRestaurantId });
    }
  }, [isModalOpen, selectedRestaurantId, fetchTables]);

  useEffect(() => {
    if (!selectedReservation) {
      reset();
    }
  }, [selectedReservation, reset]);

  if (!isModalOpen) return null;

  const onSubmit = async (data) => {
    const payload = {
      name_customer: data.name_customer,
      number_people: Number(data.number_people),
      time_reservation: new Date(data.time_reservation).toISOString(),
      table: data.table,
      restaurant: data.restaurant,
    };

    const success = await createReservation(payload);

    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Creada',
        text: 'La reservación se creó exitosamente',
        confirmButtonColor: '#F97316',
      });
      handleClose();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear la reservación',
        confirmButtonColor: '#EF4444',
      });
    }
  };

  const handleClose = () => {
    reset();
    setSelectedReservation(null);
    setIsModalOpen(false);
  };

  const activeTables = Array.isArray(tables)
    ? tables.filter((t) => t.isActive && t.status === 'disponible')
    : [];

  const activeRestaurants = Array.isArray(restaurants)
    ? restaurants.filter((r) => r.isActive !== false)
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="p-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold">Nueva Reservación</h3>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-160px)]">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre del cliente
              </label>
              <input
                {...register('name_customer', { required: true, minLength: 2, maxLength: 150 })}
                type="text"
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.name_customer ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.name_customer && (
                <span className="text-red-500 text-xs mt-1 block">
                  El nombre es obligatorio (mín. 2 caracteres)
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Número de personas
                </label>
                <input
                  {...register('number_people', {
                    required: true,
                    min: 1,
                    max: 500,
                    valueAsNumber: true,
                  })}
                  type="number"
                  min={1}
                  max={500}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.number_people ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.number_people && (
                  <span className="text-red-500 text-xs mt-1 block">
                    Entre 1 y 500 personas
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Fecha y hora
                </label>
                <input
                  {...register('time_reservation', { required: true })}
                  type="datetime-local"
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.time_reservation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.time_reservation && (
                  <span className="text-red-500 text-xs mt-1 block">
                    La fecha y hora son obligatorias
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sucursal</label>
              <select
                {...register('restaurant', { required: true })}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.restaurant ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar sucursal...</option>
                {activeRestaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
              {errors.restaurant && (
                <span className="text-red-500 text-xs mt-1 block">
                  Debe seleccionar una sucursal
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mesa</label>
              <select
                {...register('table', { required: true })}
                disabled={!selectedRestaurantId}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.table ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">
                  {!selectedRestaurantId
                    ? 'Primero seleccione una sucursal...'
                    : 'Seleccionar mesa...'}
                </option>
                {activeTables.map((t) => (
                  <option key={t._id} value={t._id}>
                    Mesa {t.number} — cap. {t.capacity}
                  </option>
                ))}
              </select>
              {errors.table && (
                <span className="text-red-500 text-xs mt-1 block">
                  Debe seleccionar una mesa
                </span>
              )}
              {selectedRestaurantId && activeTables.length === 0 && (
                <span className="text-yellow-600 text-xs mt-1 block">
                  No hay mesas disponibles en esta sucursal en este momento
                </span>
              )}
            </div>
          </div>

          <div className="p-6 pt-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-main-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;