import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Store,
  BookOpen,
  UtensilsCrossed,
  CalendarCheck,
  PartyPopper,
  Gift,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  Flame,
} from "lucide-react";
import { useAuthStore } from "../../../features/auth/store/authStore";

const NAV_ITEMS = [
  { name: "Inicio", path: "/", icon: Home },
  { name: "Restaurantes", path: "/restaurants", icon: Store },
  { name: "Menú", path: "/menus", icon: BookOpen },
  { name: "Platillos", path: "/products", icon: UtensilsCrossed },
  { name: "Reservaciones", path: "/reservations", icon: CalendarCheck },
  { name: "Eventos", path: "/events", icon: PartyPopper },
  { name: "Promociones", path: "/promotions", icon: Gift },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="flex items-stretch h-16">
        {/* Bloque sólido del logo */}
        <Link
          to="/"
          className="flex items-center gap-2 px-6 shrink-0"
          style={{ background: "#7f1d1d" }}
        >
          <Flame className="text-orange-400" size={24} />
          <span className="text-white font-bold text-lg tracking-wide hidden sm:inline">
            ICE
          </span>
        </Link>

        {/* Zona clara con navegación */}
        <div
          className="flex-1 flex items-center justify-between px-4 sm:px-6"
          style={{ background: "#fef7ed" }}
        >
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-red-800 text-white"
                      : "text-red-900/70 hover:bg-red-800/10"
                  }`}
                >
                  <Icon size={15} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Botón menú móvil */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-full text-red-800 hover:bg-red-800/10 transition"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>

          {/* Acciones de usuario */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/perfil"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-red-900/80 hover:bg-red-800/10 transition"
                >
                  <User size={15} />
                  {user?.username}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: "#ea580c" }}
                >
                  <LogOut size={15} />
                  Salir
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "#ea580c" }}
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileOpen && (
        <div className="md:hidden px-3 pb-3 flex flex-col gap-1" style={{ background: "#fef7ed" }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red-800 text-white"
                    : "text-red-900/70 hover:bg-red-800/10"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}

          <div className="h-px my-1" style={{ background: "rgba(127,29,29,0.1)" }} />

          {isAuthenticated ? (
            <>
              <Link
                to="/perfil"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-900/70 hover:bg-red-800/10 transition"
              >
                <User size={16} />
                {user?.username}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white transition"
                style={{ background: "#ea580c" }}
              >
                <LogOut size={16} />
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center px-3 py-2 rounded-xl text-sm font-semibold text-white transition"
              style={{ background: "#ea580c" }}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
