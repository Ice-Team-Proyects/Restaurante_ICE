import { useEffect, useState } from "react";
import axiosInstance from "../../../shared/api/axios";
import { Spinner } from "../../auth/components/Spinner";

const MenusPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/menu")
      .then((res) => {
        setMenus((res.data.data || []).filter((m) => m.isActive !== false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="animate-fadeIn">
      <h1
        className="text-3xl font-black text-gray-800 mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        📖 Nuestros Menús
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Explora nuestra selección gastronómica
      </p>
      {menus.length === 0 ? (
        <p className="text-center text-gray-400 py-20">
          No hay menús disponibles
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {menus.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-orange-100 hover:scale-[1.02]"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-sm"
                style={{ background: "#fff7ed" }}
              >
                📖
              </div>
              <h3 className="text-lg font-bold text-gray-800">{m.name}</h3>
              {m.description && (
                <p className="text-sm text-gray-500 mt-1">{m.description}</p>
              )}
              {m.products && m.products.length > 0 && (
                <p className="text-xs text-orange-600 font-semibold mt-2">
                  {m.products.length} platillos
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenusPage;
