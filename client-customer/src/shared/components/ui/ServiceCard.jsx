/**
 * ServiceCard — card de ticket estándar para todas las páginas de servicio.
 * Borde punteado #f0997b + acento superior sólido naranja.
 * Acepta children para contenido flexible.
 */
const ServiceCard = ({ children, className = "", accentColor = "#ea580c" }) => (
  <div
    className={`bg-white rounded-2xl overflow-hidden ${className}`}
    style={{ border: "1px dashed #f0997b" }}
  >
    {/* Línea de acento superior */}
    <div className="h-1" style={{ background: accentColor }} />
    <div className="p-5">{children}</div>
  </div>
);

export default ServiceCard;
