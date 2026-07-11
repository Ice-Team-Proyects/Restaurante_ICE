/**
 * PageHeader — encabezado estándar de todas las páginas de servicio.
 * Incluye ícono lucide + SVG de palillos decorativo alineado a la identidad oriental.
 */
const PageHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-1">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "#fde0d0" }}
      >
        <Icon size={22} style={{ color: "#ea580c" }} />
      </div>
      <h1 className="text-2xl font-bold" style={{ color: "#7f1d1d" }}>
        {title}
      </h1>
      {/* Palillos decorativos SVG */}
      <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true" className="shrink-0 opacity-60">
        <line x1="10" y1="32" x2="28" y2="6"  stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="16" y1="34" x2="34" y2="8"  stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
    {subtitle && (
      <p className="text-sm text-gray-500 ml-13" style={{ paddingLeft: "52px" }}>
        {subtitle}
      </p>
    )}
    {/* Línea de ola decorativa */}
    <svg width="160" height="10" viewBox="0 0 160 10" className="mt-2 opacity-30" aria-hidden="true">
      <path d="M0 5 Q20 0 40 5 Q60 10 80 5 Q100 0 120 5 Q140 10 160 5"
        stroke="#7f1d1d" strokeWidth="1.5" fill="none"/>
    </svg>
  </div>
);

export default PageHeader;
