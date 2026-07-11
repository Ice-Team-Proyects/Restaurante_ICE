import { useEffect, useState } from "react";
import { Store, MapPin, Phone, Clock } from "lucide-react";
import axiosInstance from "../../../shared/api/axios";
import { Spinner } from "../../auth/components/Spinner";
import PageHeader from "../../../shared/components/ui/PageHeader";
import ServiceCard from "../../../shared/components/ui/ServiceCard";

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/restaurant")
      .then((res) => { setRestaurants((res.data.data || []).filter((r) => r.isActive !== false)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="animate-fadeIn">
      <PageHeader icon={Store} title="Nuestros Restaurantes" subtitle="Visítanos en cualquiera de nuestras sucursales" />
      {restaurants.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No hay restaurantes disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((r) => (
            <ServiceCard key={r._id}>
              {r.photo && (
                <div className="rounded-xl overflow-hidden mb-4 -mx-5 -mt-5">
                  <img src={r.photo} alt={r.name} className="w-full h-40 object-cover bg-gray-100"
                    onError={(e) => { e.target.style.display = "none"; }} />
                </div>
              )}
              <h3 className="text-base font-semibold text-gray-800 mb-3">{r.name}</h3>
              <div className="space-y-1.5 text-sm text-gray-500">
                {r.address && <p className="flex items-center gap-2"><MapPin size={14} className="text-main-orange shrink-0" />{r.address}</p>}
                {r.phone   && <p className="flex items-center gap-2"><Phone   size={14} className="text-main-orange shrink-0" />{r.phone}</p>}
                {r.openingHours && <p className="flex items-center gap-2"><Clock size={14} className="text-main-orange shrink-0" />{r.openingHours}</p>}
              </div>
              {r.description && <p className="text-sm text-gray-400 mt-3">{r.description}</p>}
            </ServiceCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
