import axios from '../../../shared/api/axios';

// ══════════════════════════════════════════════════════════════════════════
// PRODUCT ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════

export const getProductsRequest = async (page = 1, limit = 100) => {
  const params = new URLSearchParams({ page, limit, isActive: true });
  return await axios.get(`/product?${params.toString()}`);
};

export const getProductByIdRequest = async (id) => {
  return await axios.get(`/product/${id}`);
};
