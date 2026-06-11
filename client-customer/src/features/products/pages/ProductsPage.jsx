import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../shared/api/axios";
import { Spinner } from "../../auth/components/Spinner";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dss7fs6pl";
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  
  let path = photo;
  if (!path.startsWith("Restaurante_ICE/")) {
    path = "Restaurante_ICE/" + path;
  }
  
  if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(path)) {
    path = path + ".jpg";
  }
  
  return `${CLOUDINARY_BASE}/${path}`;
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/product?limit=100"),
      axiosInstance.get("/category?limit=100"),
    ])
      .then(([pRes, cRes]) => {
        setProducts((pRes.data.data || []).filter((p) => p.isActive !== false));
        setCategories(
          (cRes.data.data || []).filter((c) => c.isActive !== false),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (selectedCat !== "all")
      list = list.filter(
        (p) => p.category === selectedCat || p.category?._id === selectedCat,
      );
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.saucer || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, selectedCat, search]);

  if (loading) return <Spinner />;

  return (
    <div className="animate-fadeIn">
      <h1
        className="text-3xl font-black text-gray-800 mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        🍜 Nuestros Platillos
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Descubre los sabores auténticos de Oriente
      </p>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <div className="flex gap-1 p-1 rounded-xl bg-white border border-orange-100 shadow-sm flex-wrap">
          <button
            onClick={() => setSelectedCat("all")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
            style={{
              background:
                selectedCat === "all"
                  ? "linear-gradient(to right,#dc2626,#ea580c)"
                  : "transparent",
              color: selectedCat === "all" ? "#fff" : "#6b7280",
            }}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCat(c._id)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
              style={{
                background:
                  selectedCat === c._id
                    ? "linear-gradient(to right,#dc2626,#ea580c)"
                    : "transparent",
                color: selectedCat === c._id ? "#fff" : "#6b7280",
              }}
            >
              {c.categoryName}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar platillo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl border border-orange-200 text-sm bg-white flex-1 min-w-[180px] max-w-[260px] focus:outline-none focus:border-red-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-20">
          No hay platillos disponibles
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => {
            const imageUrl = getImageUrl(p.photo);
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-orange-100 hover:scale-[1.02]"
              >
                <img
                  src={imageUrl || "https://placehold.co/400x240/fff7ed/ea580c?text=Sin+Imagen"}
                  alt={p.saucer}
                  className="w-full h-44 object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x240/fff7ed/ea580c?text=Sin+Imagen";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-800">
                    {p.saucer}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                  <p
                    className="text-xl font-black mt-2"
                    style={{ color: "#dc2626" }}
                  >
                    Q{p.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
