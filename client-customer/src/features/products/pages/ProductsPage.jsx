import { useEffect, useState, useMemo } from "react";
import { Search, Plus, UtensilsCrossed } from "lucide-react";
import axiosInstance from "../../../shared/api/axios";
import { Spinner } from "../../auth/components/Spinner";
import PageHeader from "../../../shared/components/ui/PageHeader";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([axiosInstance.get("/product?limit=100"), axiosInstance.get("/category?limit=100")])
      .then(([pRes, cRes]) => {
        setProducts((pRes.data.data || []).filter((p) => p.isActive !== false));
        setCategories((cRes.data.data || []).filter((c) => c.isActive !== false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (selectedCat !== "all") list = list.filter((p) => p.category === selectedCat || p.category?._id === selectedCat);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter((p) => (p.saucer || "").toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)); }
    return list;
  }, [products, selectedCat, search]);

  if (loading) return <Spinner />;

  return (
    <div className="animate-fadeIn">
      <PageHeader icon={UtensilsCrossed} title="Nuestros Platillos" subtitle="Descubre los sabores auténticos de Oriente" />

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <div className="flex gap-1 p-1 rounded-full bg-white flex-wrap" style={{ border: "0.5px solid rgba(127,29,29,0.12)" }}>
          <button onClick={() => setSelectedCat("all")} className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
            style={{ background: selectedCat === "all" ? "#ea580c" : "transparent", color: selectedCat === "all" ? "#fff" : "#6b7280" }}>
            Todos
          </button>
          {categories.map((c) => (
            <button key={c._id} onClick={() => setSelectedCat(c._id)} className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
              style={{ background: selectedCat === c._id ? "#ea580c" : "transparent", color: selectedCat === c._id ? "#fff" : "#6b7280" }}>
              {c.categoryName}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-[260px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar platillo..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-main-orange"
            style={{ border: "0.5px solid rgba(127,29,29,0.12)" }} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No hay platillos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p, idx) => {
            const isPopular = idx % 5 === 0;
            return (
              <div key={p._id} className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px dashed #f0997b" }}>
                <div className="h-1" style={{ background: "#ea580c" }} />
                {/* Imagen o placeholder con palillos SVG */}
                <div className="relative">
                  {p.photo ? (
                    <img src={p.photo} alt={p.saucer} className="w-full h-40 object-cover bg-gray-100"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-36 flex items-center justify-center" style={{ background: "#fde0d0" }}>
                      <svg width="54" height="52" viewBox="0 0 110 106" fill="none">
                        <ellipse cx="55" cy="48" rx="36" ry="11" fill="#ea580c"/>
                        <path d="M19 48 Q15 82 55 87 Q95 82 91 48 Z" fill="#dc2626"/>
                        <path d="M30 53 Q42 45 55 53 Q68 61 80 53" stroke="#fed7aa" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                        <line x1="44" y1="32" x2="76" y2="66" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" opacity=".5"/>
                        <line x1="51" y1="30" x2="83" y2="64" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" opacity=".5"/>
                      </svg>
                    </div>
                  )}
                  {isPopular && (
                    <span className="absolute top-2 right-2 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "#dc2626" }}>
                      Popular
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800">{p.saucer}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[2rem]">{p.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-semibold" style={{ color: "#dc2626" }}>Q{p.price}</span>
                    <button type="button"
                      className="w-7 h-7 rounded-full flex items-center justify-center border transition hover:bg-orange-50"
                      style={{ borderColor: "#fcd9bd", color: "#ea580c" }} aria-label="Agregar">
                      <Plus size={15} />
                    </button>
                  </div>
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
