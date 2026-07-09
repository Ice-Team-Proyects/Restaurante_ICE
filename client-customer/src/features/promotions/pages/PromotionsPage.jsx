import { useEffect, useState } from "react";
import { Gift, CalendarDays, Users } from "lucide-react";
import axiosInstance from "../../../shared/api/axios";
import { Spinner } from "../../auth/components/Spinner";
import PageHeader from "../../../shared/components/ui/PageHeader";
import ServiceCard from "../../../shared/components/ui/ServiceCard";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/event/promotions")
      .then((res) => { setPromotions((res.data.data || []).filter((p) => p.isActive !== false)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="animate-fadeIn">
      <PageHeader icon={Gift} title="Promociones" subtitle="Aprovecha nuestras ofertas especiales" />
      {promotions.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No hay promociones disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((p) => (
            <ServiceCard key={p._id}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-gray-800 flex-1 pr-3">{p.name_promotion}</h3>
                <span className="text-2xl font-bold shrink-0" style={{ color: "#dc2626" }}>{p.discount_percentage}%</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{p.description}</p>
              <div className="space-y-1.5 text-xs text-gray-400">
                <p className="flex items-center gap-2"><CalendarDays size={13} className="text-main-orange shrink-0" />{new Date(p.date_start).toLocaleDateString("es-GT")} — {new Date(p.date_end).toLocaleDateString("es-GT")}</p>
                <p className="flex items-center gap-2"><Users size={13} className="text-main-orange shrink-0" />Mín. {p.min_people} personas</p>
              </div>
            </ServiceCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
