import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useRestaurantStore } from '../store/restaurantStore';

const RestaurantModal = () => {
  const { isModalOpen, setIsModalOpen, createRestaurant, updateRestaurant, selectedRestaurant, setSelectedRestaurant } = useRestaurantStore();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  
  const [preview, setPreview] = useState(null);
  const imageFile = watch('image');

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [imageFile]);

  useEffect(() => {
    if (selectedRestaurant) {
      setValue('name', selectedRestaurant.name);
      setValue('address', selectedRestaurant.address);
      setValue('phone', selectedRestaurant.phone);
      setValue('openingHours', selectedRestaurant.openingHours);
      setValue('description', selectedRestaurant.description);
      setPreview(null);
    } else {
      reset();
      setPreview(null);
    }
  }, [selectedRestaurant, setValue, reset]);

  if (!isModalOpen) return null;

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    formData.append('name', data.name || '');
    formData.append('address', data.address || '');
    formData.append('phone', data.phone || '');
    formData.append('openingHours', data.openingHours || '');
    formData.append('description', data.description || '');

    if (data.image && data.image instanceof FileList && data.image[0]) {
      formData.append('image', data.image[0]);
    } else if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    let success;
    if (selectedRestaurant) {
      success = await updateRestaurant(selectedRestaurant._id, formData);
      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El restaurante se actualizó correctamente',
          confirmButtonColor: '#F97316'
        });
        handleClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el restaurante',
          confirmButtonColor: '#EF4444'
        });
      }
    } else {
      success = await createRestaurant(formData);
      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El restaurante se creó exitosamente',
          confirmButtonColor: '#F97316'
        });
        handleClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear el restaurante en el servidor',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const onInvalidSubmit = (formErrors) => {
    console.warn("Campos requeridos faltantes o inválidos:", formErrors);
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    setSelectedRestaurant(null);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="p-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold">
            {selectedRestaurant ? 'Editar Restaurante' : 'Nuevo Restaurante'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-160px)]">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input { ...register('name', { required: true }) } className={`w-full border rounded-lg px-3 py-2 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} type="text" />
              {errors.name && <span className="text-red-500 text-xs mt-1 block">El nombre es obligatorio</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dirección</label>
              <input { ...register('address', { required: true }) } className={`w-full border rounded-lg px-3 py-2 ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} type="text" />
              {errors.address && <span className="text-red-500 text-xs mt-1 block">La dirección es obligatoria</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input { ...register('phone', { required: true }) } className={`w-full border rounded-lg px-3 py-2 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} type="text" />
                {errors.phone && <span className="text-red-500 text-xs mt-1 block">El teléfono es obligatorio</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Horario</label>
                <input { ...register('openingHours', { required: true }) } className={`w-full border rounded-lg px-3 py-2 ${errors.openingHours ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} type="text" />
                {errors.openingHours && <span className="text-red-500 text-xs mt-1 block">El horario es obligatorio</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea { ...register('description') } className="w-full border border-gray-300 rounded-lg px-3 py-2" rows="2"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Imagen</label>
              <input type="file" { ...register('image') } className="w-full text-sm" />
              { preview && (
                <img src={preview} className="mt-2 w-full h-32 object-cover rounded-lg border" alt="Previsualización" />
              ) }
            </div>
          </div>

          <div className="p-6 pt-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-main-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              {selectedRestaurant ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantModal;