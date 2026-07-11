/**
 * AdminPageHeader — encabezado estándar de todas las páginas del admin.
 * Ícono lucide en cuadro naranja + título + subtítulo + botón de acción opcional.
 */
const AdminPageHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fff0e9' }}>
        <Icon size={22} style={{ color: '#ff5722' }} />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-gray-800 leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && action}
  </div>
);

export default AdminPageHeader;
