import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <header className="bg-main-orange h-16 w-full flex items-center justify-between px-8 shadow-lg z-10 relative">
      <div className="flex items-center gap-3">
        <div className="bg-white p-1 rounded-md">
          <span className="text-main-orange font-bold text-xl">ICE</span>
        </div>
        <h1 className="text-white font-bold text-xl tracking-wide">
          Gestor de Órdenes
        </h1>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition"
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-semibold leading-none">{userName}</span>
            <span className="text-[11px] text-white/70">{userRole}</span>
          </div>
          <div className="w-10 h-10 bg-orange-800 rounded-full flex items-center justify-center border-2 border-white/30 text-sm font-bold uppercase">
            {initial}
          </div>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{userRole}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-slate-800 hover:bg-slate-100"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;