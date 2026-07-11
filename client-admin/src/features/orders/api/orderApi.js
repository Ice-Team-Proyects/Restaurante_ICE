import axios from '../../../shared/api/axios';

// ══════════════════════════════════════════════════════════════════════════
// ORDER ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════

export const getOrdersRequest = async (page = 1, limit = 10, status = null, isActive = true) => {
  const params = new URLSearchParams({ page, limit, isActive });
  if (status) params.append('status', status);
  return await axios.get(`/order?${params.toString()}`);
};

export const createOrderRequest = async (orderData) => {
  return await axios.post('/order', orderData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateOrderRequest = async (id, orderData) => {
  return await axios.put(`/order/${id}`, orderData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteOrderRequest = async (id) => {
  return await axios.patch(`/order/delete/${id}`);
};
