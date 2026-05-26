import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Órdenes',       path: '/' },
    { name: 'Restaurantes',  path: '/restaurants' },
    { name: 'Mesas',         path: '/tables' },
    { name: 'Categorías',    path: '/categories' },
    { name: 'Productos',     path: '/products' },
    { name: 'Reservaciones', path: '/reservations' },
    { name: 'Eventos',       path: '/events' },
    { name: 'Estadísticas',  path: '/analytics' },
    { name: 'Menus',         path: '/menus' },

  ];

  return (
    <aside className="w-64 bg-white h-[calc(100-64px)] shadow-md">
      <nav className="mt-10 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-main-orange text-white'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-main-orange'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;