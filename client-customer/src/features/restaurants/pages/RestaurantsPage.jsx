import { useEffect, useState } from "react";
import axiosInstance from "../../../shared/api/axios";
import { Spinner } from "../../auth/components/Spinner";

import { getImageUrl } from "../../../shared/utils/cloudinary";


const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/restaurant")
      .then((res) => {
        setRestaurants(
          (res.data.data || []).filter((r) => r.isActive !== false),
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
        🏬 Nuestros Restaurantes
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Visítanos en cualquiera de nuestras sucursales
      </p>
      {restaurants.length === 0 ? (
        <p className="text-center text-gray-400 py-20">
          No hay restaurantes disponibles
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.map((r) => {
            const imageUrl = getImageUrl(r.photo);
            return (
              <div
                key={r._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-orange-100"
              >
                <img
                  src={imageUrl || "https://placehold.co/400x240/fff7ed/ea580c?text=Sin+Imagen"}
                  alt={r.name}
                  className="w-full h-48 object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x240/fff7ed/ea580c?text=Sin+Imagen";
                  }}
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800">{r.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 {r.address}</p>
                  <p className="text-sm text-gray-500">📞 {r.phone}</p>
                  {r.openingHours && (
                    <p className="text-sm text-gray-500">🕐 {r.openingHours}</p>
                  )}
                  {r.description && (
                    <p className="text-sm text-gray-400 mt-2">{r.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
