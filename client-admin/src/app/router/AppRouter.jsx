import { Navigate, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import DashboardContainer from '../../shared/components/layout/DashboardContainer';
import Dashboard from '../../features/orders/pages/Dashboard';
import RestaurantsPage from '../../features/restaurants/pages/RestaurantsPage';
import CategoriesPage from '../../features/category/componets/Category';
import ProductsPage from '../../features/product/components/Product';
import { Tables } from '../../features/tables/components/Tables.jsx';

export const AppRouter = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<LoginPage />} />

      {isAuthenticated ? (
        <Route path="/" element={<DashboardContainer />}>
          <Route index element={<Dashboard />} />
          <Route path="restaurants" element={<RestaurantsPage />} />
          <Route path="tables" element={<Tables />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Route>
      ) : (
        <Route path="/" element={<LoginPage />} />
      )}

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
};