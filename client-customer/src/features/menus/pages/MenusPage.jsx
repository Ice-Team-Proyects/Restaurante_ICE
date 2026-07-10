import { useEffect, useState } from "react";
import { BookOpen, UtensilsCrossed } from "lucide-react";
import axiosInstance from "../../../shared/api/axios";
import { Spinner } from "../../auth/components/Spinner";
import PageHeader from "../../../shared/components/ui/PageHeader";
import ServiceCard from "../../../shared/components/ui/ServiceCard";

const MenusPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/menu")
      .then((res) => { setMenus((res.data.data || []).filter((m) => m.isActive !== false)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="animate-fadeIn">
      <PageHeader icon={BookOpen} title="Nuestros Menús" subtitle="Explora nuestra selección gastronómica" />
      {menus.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No hay menús disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {menus.map((m) => (
            <ServiceCard key={m._id}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: "#fde0d0" }}>
                <BookOpen size={24} style={{ color: "#ea580c" }} />
              </div>
              <h3 className="text-base font-semibold text-gray-800">{m.name}</h3>
              {m.description && <p className="text-sm text-gray-500 mt-1">{m.description}</p>}
              {m.products?.length > 0 && (
                <p className="text-xs font-semibold mt-3 flex items-center gap-1.5" style={{ color: "#ea580c" }}>
                  <UtensilsCrossed size={13} />{m.products.length} platillos
                </p>
              )}
            </ServiceCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenusPage;
