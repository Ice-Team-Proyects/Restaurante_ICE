import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardContainer from '../../shared/components/layout/DashboardContainer';
import Dashboard from '../../features/orders/pages/Dashboard';
import RestaurantsPage from '../../features/restaurants/pages/RestaurantsPage';
import CategoriesPage from '../../features/category/componets/Category';
import ProductsPage from '../../features/product/components/Product';
import ReservationsPage from '../../features/reservations/pages/ReservationsPage';


export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardContainer />}>
        <Route index element={<Dashboard />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Route>
    </Routes>
  );
};