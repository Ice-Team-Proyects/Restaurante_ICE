import { create } from 'zustand';
import {
    getMenusRequest,
    createMenuRequest,
    updateMenuRequest,
    deleteMenuRequest,
    restoreMenuRequest,
} from '../../../shared/api/api';
import { getProductsRequest } from '../../../shared/api/api';

export const useMenuStore = create((set, get) => ({
    menus:          [],
    products:       [],   // productos disponibles para el selector
    selectedMenu:   null,
    loading:        false,
    isModalOpen:    false,

    fetchMenus: async () => {
        set({ loading: true });
        try {
            const response = await getMenusRequest();
            set({ menus: response.data.data || [], loading: false });
        } catch (error) {
            console.error(error);
            set({ loading: false });
        }
    },

    fetchProducts: async () => {
        try {
            const response = await getProductsRequest();
            const list = response.data.data?.products || response.data.data || response.data || [];
            // Solo productos activos
            set({ products: list.filter((p) => p.isActive !== false) });
        } catch (error) {
            console.error(error);
        }
    },

    createMenu: async (menuData) => {
        set({ loading: true });
        try {
            await createMenuRequest(menuData);
            await get().fetchMenus();
            set({ loading: false, isModalOpen: false });
            return true;
        } catch (error) {
            console.error(error);
            set({ loading: false });
            return false;
        }
    },

    updateMenu: async (id, menuData) => {
        set({ loading: true });
        try {
            await updateMenuRequest(id, menuData);
            await get().fetchMenus();
            set({ loading: false, isModalOpen: false });
            return true;
        } catch (error) {
            console.error(error);
            set({ loading: false });
            return false;
        }
    },

    deleteMenu: async (id) => {
        try {
            await deleteMenuRequest(id);
            set((state) => ({
                menus: state.menus.filter((m) => m._id !== id),
            }));
        } catch (error) {
            console.error(error);
        }
    },

    restoreMenu: async (id) => {
        try {
            await restoreMenuRequest(id);
            await get().fetchMenus();
        } catch (error) {
            console.error(error);
        }
    },

    setMenus:        (menus)  => set({ menus }),
    setSelectedMenu: (menu)   => set({ selectedMenu: menu }),
    setIsModalOpen:  (isOpen) => set({ isModalOpen: isOpen }),
}));