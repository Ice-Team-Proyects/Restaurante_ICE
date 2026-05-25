import axios from '../../../shared/api/axios';

// ══════════════════════════════════════════════════════════════════════════
// TABLE ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════

export const getTablesRequest = async () => {
  return await axios.get('/table');
};

export const getTableByIdRequest = async (id) => {
  return await axios.get(`/table/${id}`);
};
