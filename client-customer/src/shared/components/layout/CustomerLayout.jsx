import { Outlet } from "react-router-dom";
import { Flame } from "lucide-react";
import Navbar from "./Navbar";

const CustomerLayout = () => (
  <div className="min-h-screen" style={{ background: "#fef7ed" }}>
    <Navbar />
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <Outlet />
    </main>
    <footer
      className="text-center py-6 text-sm flex items-center justify-center gap-2"
      style={{ background: "#7f1d1d" }}
    >
      <Flame size={16} className="text-orange-300" />
      <span className="text-orange-200">Restaurante ICE — Sabores de Oriente</span>
    </footer>
  </div>
);

export default CustomerLayout;
