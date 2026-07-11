import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, ChefHat } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  // Usar el username que nos devuelve el backend
  const userName = user?.username || 'Usuario';
  const userRole = user?.role === 'ADMIN_ROLE' ? 'Administrador' : (user?.role || 'Empleado');
  const initial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="h-16 w-full flex items-stretch shadow-sm z-10 relative">
      {/* Bloque sólido del logo */}
      <div className="px-6 flex items-center gap-2 shrink-0" style={{ background: "#7f1d1d" }}>
        <img className="w-8 h-8" src={'../../../../src/assets/Logo de ICE.png'} alt="Logo de ICE" />
        <span className="text-white font-bold text-lg tracking-wide hidden sm:inline">
          ICE Admin
        </span>
      </div>

      {/* Zona clara con título y acciones */}
      <div className="flex-1 flex items-center justify-between px-4 sm:px-6" style={{ background: "#fef7ed" }}>
        <h1 className="text-gray-700 font-semibold text-base sm:text-lg">
          Gestor de Órdenes
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-gray-400 hover:text-[#ea580c] transition-colors"
            aria-label="Notificaciones"
          >
            <Bell size={20} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full hover:bg-orange-50 px-2 py-1.5 transition"
            >
              <div className="flex flex-col items-end text-right leading-tight">
                <span className="text-sm font-semibold text-gray-700">{userName}</span>
                <span className="text-[11px] text-gray-400">{userRole}</span>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold uppercase" style={{ background: "rgba(234,88,12,0.1)", color: "#ea580c" }}>
                {initial}
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{userName}</p>
                  <p className="text-xs text-slate-500">{userRole}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-left px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: "#ea580c" }}
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;