/**
 * AdminBadge — badge estándar con esquinas rounded-full.
 */
const AdminBadge = ({ children, className = '' }) => (
  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${className}`}>
    {children}
  </span>
);

export default AdminBadge;
