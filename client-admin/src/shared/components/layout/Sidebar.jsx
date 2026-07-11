import { Link, useLocation } from 'react-router-dom';
import {
  ClipboardList,
  Store,
  LayoutGrid,
  Tags,
  UtensilsCrossed,
  CalendarCheck,
  PartyPopper,
  BarChart3,
  BookOpen,
  UserCircle,
} from 'lucide-react';

const menuItems = [
  { name: 'Órdenes', path: '/', icon: ClipboardList },
  { name: 'Restaurantes', path: '/restaurants', icon: Store },
  { name: 'Mesas', path: '/tables', icon: LayoutGrid },
  { name: 'Categorías', path: '/categories', icon: Tags },
  { name: 'Productos', path: '/products', icon: UtensilsCrossed },
  { name: 'Reservaciones', path: '/reservations', icon: CalendarCheck },
  { name: 'Eventos', path: '/events', icon: PartyPopper },
  { name: 'Estadísticas', path: '/analytics', icon: BarChart3 },
  { name: 'Menus', path: '/menus', icon: BookOpen },
  { name: 'Mi perfil', path: '/perfil', icon: UserCircle },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 p-3">
      <nav className="bg-white rounded-2xl shadow-sm h-full p-3 flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                isActive
                  ? 'bg-red-800 text-white'
                  : 'text-red-900/70 hover:bg-red-800/10'
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;