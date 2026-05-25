import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useMenuStore } from '../store/menuStore';

const MenuModal = () => {
    const {
        isModalOpen, setIsModalOpen,
        createMenu, updateMenu,
        selectedMenu, setSelectedMenu,
        products, fetchProducts,
    } = useMenuStore();

    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const selectedProductIds = watch('products') || [];

    useEffect(() => {
        if (isModalOpen) fetchProducts();
    }, [isModalOpen]);

    useEffect(() => {
        if (selectedMenu) {
            setValue('name',        selectedMenu.name);
            setValue('description', selectedMenu.description || '');
            // Pre-seleccionar los IDs de productos que ya tiene el menú
            const ids = selectedMenu.products?.map((p) =>
                typeof p === 'object' ? p._id : p
            ) || [];
            setValue('products', ids);
        } else {
            reset();
        }
    }, [selectedMenu, setValue, reset]);

    if (!isModalOpen) return null;

    const toggleProduct = (id) => {
        const current = selectedProductIds || [];
        const updated = current.includes(id)
            ? current.filter((pid) => pid !== id)
            : [...current, id];
        setValue('products', updated);
    };

    const onSubmit = async (data) => {
        let success;

        if (selectedMenu) {
            success = await updateMenu(selectedMenu._id, data);
            if (success) Swal.fire({ icon: 'success', title: 'Actualizado', text: 'El menú se actualizó correctamente', confirmButtonColor: '#F97316' });
        } else {
            success = await createMenu(data);
            if (success) Swal.fire({ icon: 'success', title: 'Creado', text: 'El menú se creó exitosamente', confirmButtonColor: '#F97316' });
        }

        if (success) handleClose();
    };

    const handleClose = () => {
        reset();
        setSelectedMenu(null);
        setIsModalOpen(false);
    };

    const basePathCloudinary = import.meta.env.VITE_BASE_PATH_CLOUDINARY;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">
                    {selectedMenu ? 'Editar Menú' : 'Nuevo Menú'}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input
                            {...register('name', { required: true })}
                            className="w-full border rounded-lg px-3 py-2"
                            type="text"
                            placeholder="Ej. Menú del Día"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción</label>
                        <textarea
                            {...register('description')}
                            className="w-full border rounded-lg px-3 py-2"
                            rows="2"
                            placeholder="Describe brevemente este menú..."
                        />
                    </div>

                    {/* Selector de productos */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Productos ({selectedProductIds?.length || 0} seleccionados)
                        </label>
                        {products.length === 0 ? (
                            <p className="text-sm text-gray-400">Cargando productos...</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                                {products.map((product) => {
                                    const isSelected = (selectedProductIds || []).includes(product._id);
                                    const imageUrl = product.photo
                                        ? `${basePathCloudinary}Restaurante_ICE/${product.photo}.jpg`
                                        : null;

                                    return (
                                        <div
                                            key={product._id}
                                            onClick={() => toggleProduct(product._id)}
                                            className={`flex items-center gap-3 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'border-orange-400 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={imageUrl || 'https://placehold.co/48x48/fff7ed/ea580c?text=?'}
                                                alt={product.saucer}
                                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                onError={(e) => { e.target.src = 'https://placehold.co/48x48/fff7ed/ea580c?text=?'; }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{product.saucer}</p>
                                                <p className="text-xs text-orange-600 font-bold">Q{Number(product.price).toFixed(2)}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                                isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                            }`}>
                                                {isSelected && (
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-main-orange text-white px-4 py-2 rounded-lg">
                            {selectedMenu ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuModal;