import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const CustomerLayout = () => (
  <div className="min-h-screen" style={{ background: "#fef7ed" }}>
    <Navbar />
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <Outlet />
    </main>
    <footer
      className="text-center py-6 text-sm text-gray-400"
      style={{ background: "#7f1d1d" }}
    >
      <p className="text-orange-200">🐉 Restaurante ICE — Sabores de Oriente</p>
    </footer>
  </div>
);

export default CustomerLayout;
