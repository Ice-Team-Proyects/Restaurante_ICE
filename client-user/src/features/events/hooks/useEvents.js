// c:/neww/Restaurante_ICE/client-user/src/features/events/hooks/useEvents.js
import { useState, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);

  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN" ||
    user?.role?.toUpperCase() === "ADMIN_ROLE" ||
    user?.email?.toLowerCase() === "admin@restaurante.com" ||
    user?.email?.toLowerCase().includes("admin");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.get("/event/events");
      const resData = response.data?.data || response.data || [];
      // Filter active events
      const active = resData.filter(ev => ev.isActive !== false);
      setEvents(active);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
      setError(
        err.response?.data?.message || err.message || "Error al conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInscriptions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.get("/event/inscriptions");
      const resData = response.data?.data || response.data || [];
      const active = resData.filter(ins => ins.isActive !== false);

      if (isAdmin) {
        setInscriptions(active);
      } else {
        // Customer: filter by their email
        const userEmail = user?.email || "";
        const filtered = active.filter(
          (ins) => ins.email_customer?.toLowerCase() === userEmail.toLowerCase()
        );
        setInscriptions(filtered);
      }
    } catch (err) {
      console.error("Error al obtener inscripciones:", err);
      setError(
        err.response?.data?.message || err.message || "Error al conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.get("/event/promotions");
      const resData = response.data?.data || response.data || [];
      const active = resData.filter(p => p.isActive !== false);
      setPromotions(active);
    } catch (err) {
      console.error("Error al obtener promociones:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerForEvent = async (eventId, numPeople, promoId = null) => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        name_customer: user?.name || user?.username || "Cliente",
        email_customer: user?.email || "cliente@email.com",
        phone_customer: user?.phone || "55512345",
        id_event: eventId,
        number_people: parseInt(numPeople),
      };
      if (promoId) {
        payload.id_promotion = promoId;
      }

      const response = await userClient.post("/event/inscriptions", payload);
      await fetchInscriptions();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error al registrarse a evento:", err);
      const msg = err.response?.data?.message || err.message || "Error al registrarse al evento";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        name_event: eventData.name_event,
        description: eventData.description,
        date_event: eventData.date_event,
        capacity: parseInt(eventData.capacity),
        location: eventData.location,
        price: parseFloat(eventData.price),
      };

      const response = await userClient.post("/event/events", payload);
      await fetchEvents();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error al crear evento:", err);
      const msg = err.response?.data?.message || err.message || "Error al crear evento";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const createPromotion = async (promoData) => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        name_promotion: promoData.name_promotion,
        description: promoData.description,
        discount_percentage: parseInt(promoData.discount_percentage),
        date_start: promoData.date_start,
        date_end: promoData.date_end,
        min_people: parseInt(promoData.min_people),
      };

      const response = await userClient.post("/event/promotions", payload);
      await fetchPromotions();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error al crear promoción:", err);
      const msg = err.response?.data?.message || err.message || "Error al crear promoción";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    inscriptions,
    promotions,
    loading,
    error,
    fetchEvents,
    fetchInscriptions,
    fetchPromotions,
    registerForEvent,
    createEvent,
    createPromotion,
    isAdmin,
  };
};
