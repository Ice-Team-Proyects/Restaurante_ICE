import { useEffect, useState } from "react";
import axiosInstance from "../../../shared/api/axios";
import { Spinner } from "../../auth/components/Spinner";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/event/promotions")
      .then((res) => {
        setPromotions(
          (res.data.data || []).filter((p) => p.isActive !== false),
        );
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
        🎁 Promociones
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Aprovecha nuestras ofertas especiales
      </p>
      {promotions.length === 0 ? (
        <p className="text-center text-gray-400 py-20">
          No hay promociones disponibles
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-orange-100 hover:scale-[1.02]"
            >
              <div
                className="h-2"
                style={{
                  background: "linear-gradient(to right, #ea580c, #dc2626)",
                }}
              />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-800">
                    {p.name_promotion}
                  </h3>
                  <span
                    className="text-2xl font-black"
                    style={{ color: "#dc2626" }}
                  >
                    {p.discount_percentage}%
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{p.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                    style={{ background: "#dbeafe", color: "#1d4ed8" }}
                  >
                    📅 {new Date(p.date_start).toLocaleDateString("es-GT")} —{" "}
                    {new Date(p.date_end).toLocaleDateString("es-GT")}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                    style={{ background: "#dcfce7", color: "#15803d" }}
                  >
                    Mín. {p.min_people} personas
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
