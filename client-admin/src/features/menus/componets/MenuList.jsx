import Swal from 'sweetalert2';
import { useMenuStore } from '../store/menuStore';
import { getImageUrl } from '../../../shared/utils/cloudinary.js';

const MenuList = () => {
    const { menus, deleteMenu, setSelectedMenu, setIsModalOpen } = useMenuStore();

    if (!menus || menus.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400">
                No hay menús registrados.
            </div>
        );
    }

    const handleDelete = (id, name) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Estás a punto de desactivar "${name}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#9CA3AF',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMenu(id);
                Swal.fire({ title: 'Eliminado', text: 'El menú ha sido desactivado.', icon: 'success', confirmButtonColor: '#F97316' });
            }
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu) => (
                <div
                    key={menu._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                    {/* Header */}
                    <div className="bg-orange-50 px-5 py-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{menu.name}</h3>
                            {menu.description && (
                                <p className="text-xs text-gray-500 mt-0.5">{menu.description}</p>
                            )}
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            menu.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {menu.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>

                    {/* Products list */}
                    <div className="p-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                            {menu.products?.length || 0} producto{menu.products?.length !== 1 ? 's' : ''}
                        </p>

                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {menu.products?.length === 0 && (
                                <p className="text-sm text-gray-400">Sin productos asignados</p>
                            )}
                            {menu.products?.map((product) => {
                                const imageUrl = getImageUrl(product.photo);
                                return (
                                    <div key={product._id} className="flex items-center gap-3">
                                        <img
                                            src={imageUrl || 'https://placehold.co/40x40/fff7ed/ea580c?text=?'}
                                            alt={product.saucer}
                                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                            onError={(e) => { e.target.src = 'https://placehold.co/40x40/fff7ed/ea580c?text=?'; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-700 truncate">{product.saucer}</p>
                                            <p className="text-xs text-orange-500 font-semibold">Q{Number(product.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4 mt-3 border-t border-gray-100">
                            <button
                                onClick={() => { setSelectedMenu(menu); setIsModalOpen(true); }}
                                className="text-main-orange hover:text-orange-700 text-sm font-medium transition-colors"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(menu._id, menu.name)}
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

export default MenuList;