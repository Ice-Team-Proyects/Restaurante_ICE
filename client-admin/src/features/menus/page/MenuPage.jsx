import { useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import MenuList from '../componets/MenuList';
import MenuModal from '../componets/MenuModal';
import { useMenuStore } from '../store/menuStore';
import AdminPageHeader from '../../../shared/components/ui/AdminPageHeader';

const MenuPage = () => {
  const { fetchMenus, setIsModalOpen } = useMenuStore();

  useEffect(() => { fetchMenus(); }, []);

  return (
    <div className="animate-fadeIn">
      <AdminPageHeader
        icon={BookOpen}
        title="Gestión de Menús"
        subtitle="Administra las colecciones de productos del restaurante"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-main-orange text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} /> Nuevo Menú
          </button>
        }
      />
      <MenuList />
      <MenuModal />
    </div>
  );
};

export default MenuPage;
