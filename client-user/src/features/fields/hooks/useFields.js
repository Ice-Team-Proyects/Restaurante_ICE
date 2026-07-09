// c:/neww/Restaurante_ICE/client-user/src/features/fields/hooks/useFields.js
import { useState, useEffect, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  
  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN" ||
    user?.email?.toLowerCase().includes("admin");

  const fetchFields = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isAdmin) {
        // ADMINISTRADOR: Cargar mesas reales de /table
        const response = await userClient.get("/table");
        const data = response.data.data || response.data || [];
        const mapped = data.map((item) => ({
          id: item._id || item.id,
          name: `Mesa #${item.number}`,
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600",
          location: `Capacidad: ${item.capacity} personas`,
          isAvailable: String(item.status).toLowerCase() === "disponible",
          status: item.status || "disponible",
          number: item.number,
          capacity: item.capacity,
        }));
        setFields(mapped);
      } else {
        // CLIENTE: Cargar restaurantes/sucursales reales de /restaurant
        const response = await userClient.get("/restaurant");
        const data = response.data.data || response.data || [];
        const mapped = data.map((item) => ({
          id: item._id || item.id,
          name: item.name || "Sucursal Restaurante",
          image: item.photo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600",
          location: `${item.address || "Ubicación"} • ${item.openingHours || "8:00 - 22:00"}`,
          isAvailable: Boolean(item.isActive !== undefined ? item.isActive : true),
          description: item.description || "Nuestra sucursal premium de Restaurante ICE.",
          phone: item.phone,
        }));
        setFields(mapped);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al obtener datos");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const updateTableStatus = async (tableId, newStatus) => {
    setLoading(true);
    try {
      await userClient.put(`/table/${tableId}`, { status: newStatus });
      await fetchFields();
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al actualizar mesa");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return {
    fields,
    loading,
    error,
    refreshFields: fetchFields,
    updateTableStatus,
  };
};
