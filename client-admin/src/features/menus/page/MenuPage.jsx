import { useEffect } from 'react';
import MenuList from '../componets/MenuList';
import MenuModal from '../componets/MenuModal';
import { useMenuStore } from '../store/menuStore';

const MenuPage = () => {
    const { fetchMenus, setIsModalOpen } = useMenuStore();

    useEffect(() => {
        fetchMenus();
    }, []);

    return (
        <div className="animate-fadeIn relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Gestión de Menús</h2>
                    <p className="text-gray-500">Administra las colecciones de productos del restaurante</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-main-orange text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-orange-600 transition-colors"
                >
                    + Nuevo Menú
                </button>
            </div>

            <MenuList />
            <MenuModal />
        </div>
    );
};

export default MenuPage;