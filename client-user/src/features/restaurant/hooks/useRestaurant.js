// c:/neww/Restaurante_ICE/client-user/src/features/restaurant/hooks/useRestaurant.js
import { useState, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useRestaurant = () => {
<<<<<<< HEAD
  const [restaurants, setRestaurants] = useState([]); // holds branches (customer) or tables (admin)
=======
  const [restaurants, setRestaurants] = useState([]); // holds branches/sucursales
  const [tables, setTables] = useState([]); // holds tables/mesas
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
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
<<<<<<< HEAD
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
=======
      const response = await userClient.get("/restaurant");
      const resData = response.data?.data || response.data || [];
      setRestaurants(resData);
    } catch (err) {
      console.error("Error al obtener restaurantes:", err);
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, [isAdmin]);
=======
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
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a

  const createTable = async (tableData) => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.post("/table", {
        number: parseInt(tableData.number),
        capacity: parseInt(tableData.capacity),
        status: "disponible"
      });
<<<<<<< HEAD
      await fetchRestaurants();
=======
      await fetchTables();
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
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
<<<<<<< HEAD
      await fetchRestaurants();
=======
      await fetchTables();
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
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
<<<<<<< HEAD
      await fetchRestaurants();
=======
      await fetchTables();
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
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
<<<<<<< HEAD
    loading,
    error,
    fetchRestaurants,
=======
    tables,
    loading,
    error,
    fetchRestaurants,
    fetchTables,
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
    createTable,
    updateTable,
    deleteTable,
    isAdmin,
  };
};
