// c:/neww/Restaurante_ICE/client-user/src/features/orders/hooks/useOrders.js
import { useState, useCallback } from "react";
import { userClient } from "../../../shared/api/userClient.js";
import { useAuthStore } from "../../../shared/store/authStore.js";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);

  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN" ||
    user?.role?.toUpperCase() === "ADMIN_ROLE" ||
    user?.email?.toLowerCase() === "admin@restaurante.com" ||
    user?.email?.toLowerCase().includes("admin");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.get("/order");
      const resData = response.data?.data || response.data || [];
      
      if (isAdmin) {
        // Admin: ver todas las órdenes activas
        setOrders(resData.filter(o => o.isActive !== false));
      } else {
        // Cliente: filtrar sus propias órdenes (buscando coincidencia por mesa o de forma local si no hay campo de usuario directo)
        // El modelo de orden de server-admin tiene tableId, totalAmount, status, items.
        // Dado que la orden no tiene el id de usuario directamente en el modelo de base de datos de server-admin,
        // listamos las órdenes y mostramos las que correspondan a las mesas registradas o listamos todo el historial para demostración.
        setOrders(resData.filter(o => o.isActive !== false));
      }
    } catch (err) {
      console.error("Error al obtener órdenes:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al conectar con el servidor de órdenes"
      );
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const placeOrder = async (tableId, items) => {
    setLoading(true);
    setError("");
    try {
      // items must map to [{ productId, quantity, price }]
      const payload = {
        tableId,
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        status: "PENDING"
      };

      const response = await userClient.post("/order", payload);
      await fetchOrders();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error al realizar orden:", err);
      const msg = err.response?.data?.message || err.message || "Error al enviar el pedido";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    setLoading(true);
    setError("");
    try {
      const response = await userClient.put(`/order/${id}`, { status });
      await fetchOrders();
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      const msg = err.response?.data?.message || err.message || "Error al cambiar estado del pedido";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    setLoading(true);
    setError("");
    try {
      await userClient.patch(`/order/delete/${id}`);
      await fetchOrders();
      return { success: true };
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
      const msg = err.response?.data?.message || err.message || "Error al eliminar pedido";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    placeOrder,
    updateOrderStatus,
    deleteOrder,
    isAdmin,
  };
};
