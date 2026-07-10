// c:/neww/Restaurante_ICE/client-user/src/features/reservations/hooks/useReservations.js
import { useState, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);

  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN" ||
    user?.email?.toLowerCase().includes("admin");

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const currentUserName = user?.name || user?.Name || user?.username || user?.Username || "Usuario";
      
      // Consultar el microservicio de reservas del restaurante
      const response = await userClient.get("/reservation");
      const allRes = response.data.data || response.data || [];
      
      // Si es ADMIN, mostrar todas. Si es cliente, filtrar por su nombre de usuario
      const filtered = isAdmin
        ? allRes
        : allRes.filter(
            (item) =>
              item.name_customer?.toLowerCase() === currentUserName.toLowerCase()
          );

      // Map: { id, customerName, date, time, people, field: { name, image }, normalizedStatus }
      const mapped = filtered.map((item) => {
        const dateObj = item.time_reservation ? new Date(item.time_reservation) : new Date();
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const hh = String(dateObj.getHours()).padStart(2, '0');
        const min = String(dateObj.getMinutes()).padStart(2, '0');

        return {
          id: item._id || item.id,
          customerName: item.name_customer || "Cliente",
          date: `${yyyy}-${mm}-${dd}`,
          time: `${hh}:${min}`,
          people: item.number_people || 2,
          field: {
            id: item.table?._id || item.table || "mesa_gen",
            name: item.table?.number ? `Mesa #${item.table.number}` : item.table || "Mesa General",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600",
            restaurantName: item.restaurant?.name || "Sucursal ICE",
          },
          normalizedStatus: item.isActive !== false ? "CONFIRMADA" : "CANCELADA",
        };
      });

      setReservations(mapped);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al obtener historial de reservaciones"
      );
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  const fetchAvailableTables = useCallback(async (restaurantId) => {
    try {
      const response = await userClient.get(`/table?limit=100&restaurant=${restaurantId}`);
      let resData = response.data?.data || response.data || [];
      let filtered = resData.filter(t => t.isActive !== false && t.status === "disponible");
      
      // Fallback si no hay mesas vinculadas a esta sucursal específica en la base de datos
      if (filtered.length === 0) {
        const allResponse = await userClient.get("/table?limit=100");
        const allTables = allResponse.data?.data || allResponse.data || [];
        filtered = allTables.filter(t => t.isActive !== false && t.status === "disponible");
      }
      return filtered;
    } catch (err) {
      console.error("Error al obtener mesas disponibles:", err);
      return [];
    }
  }, []);

  const createReservation = useCallback(async (reservationData) => {
    setLoading(true);
    setError("");
    try {
      // time_reservation debe ser un ISO8601 String
      const isoDateTimeString = new Date(`${reservationData.date}T${reservationData.time}:00`).toISOString();

      const payload = {
        name_customer: user?.name || user?.Name || user?.username || user?.Username || "Cliente",
        number_people: parseInt(reservationData.people) || 2,
        time_reservation: isoDateTimeString,
        table: reservationData.tableId,       // MongoId de la mesa
        restaurant: reservationData.restaurantId // MongoId de la sucursal
      };

      // Enviar al backend real
      await userClient.post("/reservation", payload);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error al crear reservación";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const cancelReservation = useCallback(async (id) => {
    setLoading(true);
    setError("");
    try {
      // Llamada al softdelete del backend: PATCH /reservation/delete/:id
      await userClient.patch(`/reservation/delete/${id}`);
      
      // Volver a consultar
      await fetchReservations();
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al cancelar reservación"
      );
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    fetchReservations,
    fetchAvailableTables,
    createReservation,
    cancelReservation,
  };
};
