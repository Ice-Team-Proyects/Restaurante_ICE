// c:/neww/Restaurante_ICE/client-user/src/features/restaurant/hooks/useRestaurant.js
import { useState, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]); // holds branches (customer) or tables (admin)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);

  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN" ||
    user?.role?.toUpperCase() === "ADMIN_ROLE" ||
    user?.email?.toLowerCase() === "admin@restaurante.com" ||
    user?.email?.toLowerCase().includes("admin");

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isAdmin) {
        // ADMIN: Cargar mesas de /table
        const response = await userClient.get("/table");
        const resData = response.data?.data || response.data || [];
        setRestaurants(resData);
      } else {
        // CLIENTE: Cargar sucursales de /restaurant
        const response = await userClient.get("/restaurant");
        const resData = response.data?.data || response.data || [];
        setRestaurants(resData);
      }
    } catch (err) {
      console.error("Error al obtener restaurantes/mesas:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const createTable = async (tableData) => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.post("/table", {
        number: parseInt(tableData.number),
        capacity: parseInt(tableData.capacity),
        status: "disponible"
      });
      await fetchRestaurants();
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al crear mesa";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateTable = async (id, tableData) => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.put(`/table/${id}`, tableData);
      await fetchRestaurants();
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al actualizar mesa";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const deleteTable = async (id) => {
    setLoading(true);
    setError("");
    try {
      await userClient.patch(`/table/delete/${id}`);
      await fetchRestaurants();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al eliminar mesa";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    createTable,
    updateTable,
    deleteTable,
    isAdmin,
  };
};
