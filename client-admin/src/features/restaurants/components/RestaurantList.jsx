import Swal from 'sweetalert2';
import { useRestaurantStore } from '../store/restaurantStore';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dss7fs6pl';
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return `${CLOUDINARY_BASE}/${photo}`;
};

const RestaurantList = () => {
  const { 
    restaurants, 
    deleteRestaurant, 
    setSelectedRestaurant, 
    setIsModalOpen,
    restoreRestaurant 
  } = useRestaurantStore();

  if (!Array.isArray(restaurants) || restaurants.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No hay restaurantes registrados.
      </div>
    );
  }

  const handleDelete = (id, name) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de desactivar ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRestaurant(id);
        Swal.fire({
          title: 'Eliminado',
          text: 'El restaurante ha sido desactivado.',
          icon: 'success',
          confirmButtonColor: '#F97316',
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => {
        const imageUrl = getImageUrl(restaurant.photo) || restaurant.image;

        return (
          <div key={restaurant._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={restaurant.name}
                className="w-full h-48 object-cover bg-gray-100"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            
            <div
              className="w-full h-48 bg-gray-100 items-center justify-center text-gray-400 text-sm font-medium"
              style={{ display: imageUrl ? 'none' : 'flex' }}
            >
              Sin Imagen
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">{restaurant.name}</h3>
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    restaurant.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {restaurant.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="space-y-1 mb-5">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Dirección:</span> {restaurant.address}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Teléfono:</span> {restaurant.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Horario:</span> {restaurant.openingHours}
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setIsModalOpen(true);
                  }}
                  className="text-main-orange hover:text-orange-700 text-sm font-medium transition-colors"
                >
                  Editar
                </button>
                
                {restaurant.isActive ? (
                  <button 
                    onClick={() => handleDelete(restaurant._id, restaurant.name)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Desactivar
                  </button>
                ) : (
                  <button 
                    onClick={() => restoreRestaurant(restaurant._id)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                  >
                    Restaurar
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RestaurantList;