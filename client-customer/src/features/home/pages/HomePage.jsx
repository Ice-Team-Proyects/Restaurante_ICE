import { Link } from "react-router-dom";

const SECTIONS = [
  {
    title: "Restaurantes",
    desc: "Conoce nuestras sucursales",
    emoji: "🏬",
    path: "/restaurants",
    color: "#dc2626",
  },
  {
    title: "Menú",
    desc: "Explora nuestros menús",
    emoji: "📖",
    path: "/menus",
    color: "#ea580c",
  },
  {
    title: "Platillos",
    desc: "Descubre nuestros sabores",
    emoji: "🍜",
    path: "/products",
    color: "#b91c1c",
  },
  {
    title: "Reservaciones",
    desc: "Reserva tu mesa",
    emoji: "📅",
    path: "/reservations",
    color: "#dc2626",
  },
  {
    title: "Eventos",
    desc: "Próximos eventos especiales",
    emoji: "🎉",
    path: "/events",
    color: "#ea580c",
  },
  {
    title: "Promociones",
    desc: "Ofertas y descuentos",
    emoji: "🎁",
    path: "/promotions",
    color: "#b91c1c",
  },
];

const HomePage = () => (
  <div className="animate-fadeIn">
    {/* Hero */}
    <div
      className="text-center py-16 rounded-3xl mb-10 shadow-lg"
      style={{
        background: "linear-gradient(135deg, #7f1d1d, #dc2626, #ea580c)",
      }}
    >
      <span className="text-7xl block mb-4">🐉</span>
      <h1
        className="text-5xl font-black text-white mb-3"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Restaurante ICE
      </h1>
      <p className="text-orange-200 text-lg max-w-md mx-auto">
        Auténticos sabores orientales en cada bocado
      </p>
      <div className="flex justify-center gap-4 mt-6">
        <Link
          to="/menus"
          className="px-6 py-2.5 rounded-xl bg-white text-red-700 font-bold text-sm hover:bg-orange-50 transition shadow-md"
        >
          Ver Menú
        </Link>
        <Link
          to="/reservations"
          className="px-6 py-2.5 rounded-xl border-2 border-white/50 text-white font-bold text-sm hover:bg-white/10 transition"
        >
          Reservar Mesa
        </Link>
      </div>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {SECTIONS.map((s) => (
        <Link
          key={s.path}
          to={s.path}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex items-center gap-4 hover:scale-[1.02] border border-orange-100"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
            style={{ background: "#fff7ed" }}
          >
            {s.emoji}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{s.title}</h3>
            <p className="text-sm text-gray-500">{s.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default HomePage;
