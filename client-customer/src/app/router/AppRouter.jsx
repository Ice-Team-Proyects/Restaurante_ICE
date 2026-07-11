import { Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "../../shared/components/layout/CustomerLayout";
import LoginPage from "../../features/auth/pages/LoginPage";
import HomePage from "../../features/home/pages/HomePage";
import RestaurantsPage from "../../features/restaurants/pages/RestaurantsPage";
import ProductsPage from "../../features/products/pages/ProductsPage";
import ReservationsPage from "../../features/reservations/pages/ReservationsPage";
import MenusPage from "../../features/menus/pages/MenusPage";
import EventsPage from "../../features/events/pages/EventsPage";
import PromotionsPage from "../../features/promotions/pages/PromotionsPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";

export const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<CustomerLayout />}>
      <Route index element={<HomePage />} />
      <Route path="restaurants" element={<RestaurantsPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="menus" element={<MenusPage />} />
      <Route path="reservations" element={<ReservationsPage />} />
      <Route path="events" element={<EventsPage />} />
      <Route path="promotions" element={<PromotionsPage />} />
      <Route path="perfil" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
