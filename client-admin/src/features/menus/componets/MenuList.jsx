import Swal from 'sweetalert2';
import { Pencil, Trash2 } from 'lucide-react';
import { useMenuStore } from '../store/menuStore';
import { getImageUrl } from '../../../shared/utils/cloudinary.js';

const MenuList = () => {
  const { menus, deleteMenu, setSelectedMenu, setIsModalOpen } = useMenuStore();

  if (!menus || menus.length === 0) {
    return <div className="bg-white rounded-2xl p-10 text-center text-gray-400">No hay menús registrados.</div>;
  }

  const handleDelete = (id, name) => {
    Swal.fire({
      title: '¿Estás seguro?', text: `Estás a punto de desactivar "${name}"`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#EF4444', cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMenu(id);
        Swal.fire({ title: 'Eliminado', text: 'El menú ha sido desactivado.', icon: 'success', confirmButtonColor: '#F97316' });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {menus.map((menu) => (
        <div key={menu._id} className="bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#fff0e9' }}>
            <div>
              <h3 className="text-base font-semibold text-gray-800">{menu.name}</h3>
              {menu.description && <p className="text-xs text-gray-500 mt-0.5">{menu.description}</p>}
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              menu.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {menu.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          {/* Products */}
          <div className="p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {menu.products?.length || 0} producto{menu.products?.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {!menu.products?.length && <p className="text-sm text-gray-400">Sin productos asignados</p>}
              {menu.products?.map((product) => {
                const imageUrl = getImageUrl(product.photo);
                return (
                  <div key={product._id} className="flex items-center gap-3">
                    <img
                      src={imageUrl || 'https://placehold.co/40x40/fff7ed/ea580c?text=?'}
                      alt={product.saucer}
                      className="w-9 h-9 rounded-xl object-cover shrink-0"
                      onError={(e) => { e.target.src = 'https://placehold.co/40x40/fff7ed/ea580c?text=?'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{product.saucer}</p>
                      <p className="text-xs font-semibold" style={{ color: '#ea580c' }}>Q{Number(product.price).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 mt-3 border-t border-gray-100">
              <button
                onClick={() => { setSelectedMenu(menu); setIsModalOpen(true); }}
                className="p-2 rounded-xl bg-bg-light text-gray-500 hover:text-main-orange transition"
                aria-label="Editar menú"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(menu._id, menu.name)}
                className="p-2 rounded-xl bg-bg-light text-gray-500 hover:text-red-500 transition"
                aria-label="Eliminar menú"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuList;
