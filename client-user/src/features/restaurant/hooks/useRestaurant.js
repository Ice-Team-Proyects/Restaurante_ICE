// c:/neww/Restaurante_ICE/client-user/src/features/restaurant/hooks/useRestaurant.js
import { useState, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]); // holds branches/sucursales
  const [tables, setTables] = useState([]); // holds tables/mesas
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
      const response = await userClient.get("/restaurant");
      const resData = response.data?.data || response.data || [];
      setRestaurants(resData);
    } catch (err) {
      console.error("Error al obtener restaurantes:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.get("/table");
      const resData = response.data?.data || response.data || [];
      setTables(resData);
    } catch (err) {
      console.error("Error al obtener mesas:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createTable = async (tableData) => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.post("/table", {
        number: parseInt(tableData.number),
        capacity: parseInt(tableData.capacity),
        status: "disponible"
      });
      await fetchTables();
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
      await fetchTables();
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
      await fetchTables();
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
    tables,
    loading,
    error,
    fetchRestaurants,
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
    isAdmin,
  };
};
