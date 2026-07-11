import { Link } from "react-router-dom";
import { Store, BookOpen, UtensilsCrossed, CalendarCheck, PartyPopper, Gift } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";

const SECTIONS = [
  { title: "Restaurantes",  desc: "Conoce nuestras sucursales",       icon: Store,           path: "/restaurants" },
  { title: "Menú",          desc: "Explora nuestros menús",            icon: BookOpen,         path: "/menus" },
  { title: "Platillos",     desc: "Descubre nuestros sabores",         icon: UtensilsCrossed,  path: "/products" },
  { title: "Reservaciones", desc: "Reserva tu mesa con anticipación",  icon: CalendarCheck,    path: "/reservations" },
  { title: "Eventos",       desc: "Próximos eventos especiales",       icon: PartyPopper,      path: "/events" },
  { title: "Promociones",   desc: "Ofertas y descuentos exclusivos",   icon: Gift,             path: "/promotions" },
];

const HomePage = () => (
  <div className="animate-fadeIn">
    {/* Hero dividido */}
    <div className="rounded-3xl mb-10 overflow-hidden flex flex-col sm:flex-row min-h-[220px]" style={{ border: "1px dashed #f0997b" }}>
      <div className="flex items-center justify-center px-8 py-10 sm:w-2/5" style={{ background: "#7f1d1d", position: "relative", overflow: "hidden" }}>
        {/* nubes tenues en hero */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 180 220" preserveAspectRatio="xMidYMid slice">
          <g opacity=".12" fill="#fde0d0">
            <path d="M-10 30 Q5 8 28 18 Q38 -2 62 12 Q72 24 52 34 Q62 46 42 46 Q18 52 6 40 Z"/>
            <path d="M90 5 Q105 -17 128 -7 Q138 -27 162 -13 Q172 -1 152 9 Q162 21 142 21 Q118 27 106 15 Z"/>
            <path d="M-5 110 Q10 88 33 98 Q43 78 67 92 Q77 104 57 114 Q67 126 47 126 Q23 132 11 120 Z"/>
            <path d="M100 120 Q115 98 138 108 Q148 88 172 102 Q182 114 162 124 Q172 136 152 136 Q128 142 116 130 Z"/>
            <path d="M20 190 Q35 168 58 178 Q68 158 92 172 Q102 184 82 194 Q92 206 72 206 Q48 212 36 200 Z"/>
          </g>
        </svg>
        {/* Ilustración: tazón ramen SVG */}
        <svg width="90" height="88" viewBox="0 0 110 106" fill="none" style={{ position: "relative" }}>
          <path d="M36 22 Q33 14 36 9 Q39 4 36 0" stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".6"/>
          <path d="M55 20 Q52 12 55 7 Q58 2 55 0" stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".8"/>
          <path d="M74 22 Q71 14 74 9 Q77 4 74 0" stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".6"/>
          <ellipse cx="55" cy="48" rx="36" ry="11" fill="#ea580c"/>
          <path d="M19 48 Q15 82 55 87 Q95 82 91 48 Z" fill="#dc2626"/>
          <ellipse cx="55" cy="48" rx="36" ry="11" fill="none" stroke="#f97316" strokeWidth="1.5"/>
          <path d="M30 53 Q42 45 55 53 Q68 61 80 53" stroke="#fed7aa" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M32 61 Q44 54 57 61 Q68 67 78 61" stroke="#fed7aa" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <circle cx="46" cy="55" r="3.5" fill="#4ade80" opacity=".85"/>
          <circle cx="66" cy="57" r="3.5" fill="#4ade80" opacity=".85"/>
          <line x1="44" y1="32" x2="76" y2="66" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round"/>
          <line x1="51" y1="30" x2="83" y2="64" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round"/>
          <ellipse cx="55" cy="87" rx="22" ry="5.5" fill="#991b1b"/>
          <rect x="42" y="87" width="26" height="9" rx="4.5" fill="#991b1b"/>
          <ellipse cx="55" cy="96" rx="16" ry="4" fill="#7f1d1d"/>
        </svg>
      </div>
      <div className="flex-1 flex flex-col justify-center px-8 py-10" style={{ background: "#fef7ed" }}>
        <h1 className="text-4xl font-bold mb-2" style={{ color: "#7f1d1d" }}>Restaurante ICE</h1>
        <p className="text-gray-500 text-base max-w-md mb-6">Auténticos sabores orientales en cada bocado</p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/menus" className="px-6 py-2.5 rounded-full text-white font-semibold text-sm transition hover:opacity-90" style={{ background: "#ea580c" }}>Ver menú</Link>
          <Link to="/reservations" className="px-6 py-2.5 rounded-full font-semibold text-sm transition border" style={{ borderColor: "#7f1d1d", color: "#7f1d1d" }}>Reservar mesa</Link>
        </div>
      </div>
    </div>

    {/* Grid de secciones */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {SECTIONS.map((s) => {
        const Icon = s.icon;
        return (
          <Link key={s.path} to={s.path}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 transition hover:bg-orange-50/40"
            style={{ border: "1px dashed #f0997b" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#fde0d0" }}>
              <Icon size={24} style={{ color: "#ea580c" }} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
);

export default HomePage;
