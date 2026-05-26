import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/authStore";

const NAV_ITEMS = [
  { name: "🏠 Inicio", path: "/" },
  { name: "🏬 Restaurantes", path: "/restaurants" },
  { name: "📖 Menú", path: "/menus" },
  { name: "🍜 Platillos", path: "/products" },
  { name: "📅 Reservaciones", path: "/reservations" },
  { name: "🎉 Eventos", path: "/events" },
  { name: "🎁 Promociones", path: "/promotions" },
];

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg"
      style={{
        background: "linear-gradient(to right, #7f1d1d, #dc2626, #ea580c)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐉</span>
            <span
              className="text-white text-xl font-black"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Restaurante ICE
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background:
                    location.pathname === item.path
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  color:
                    location.pathname === item.path
                      ? "#fff"
                      : "rgba(255,255,255,0.8)",
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-white/80 text-sm hidden sm:block">
                  Hola, {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 rounded-lg text-sm font-bold bg-white/20 text-white hover:bg-white/30 transition"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg text-sm font-bold bg-white text-red-700 hover:bg-orange-50 transition"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition"
              style={{
                background:
                  location.pathname === item.path
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                color:
                  location.pathname === item.path
                    ? "#fff"
                    : "rgba(255,255,255,0.7)",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
