/**
 * AdminCard — card isla estándar para todo el admin.
 * Fondo blanco, esquinas rounded-2xl, sin sombra dura.
 */
const AdminCard = ({ children, className = '', padding = true }) => (
  <div className={`bg-white rounded-2xl ${padding ? 'p-5' : ''} ${className}`}>
    {children}
  </div>
);

export default AdminCard;
