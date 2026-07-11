/**
 * AdminButton — botón primario estándar del admin.
 */
const AdminButton = ({ children, onClick, type = 'button', disabled = false, variant = 'primary', size = 'md', className = '' }) => {
  const base = 'inline-flex items-center gap-2 font-semibold transition-colors rounded-xl';
  const sizes = { sm: 'px-4 py-1.5 text-xs', md: 'px-5 py-2 text-sm', lg: 'px-6 py-2.5 text-sm' };
  const variants = {
    primary: 'bg-main-orange text-white hover:bg-orange-600',
    secondary: 'bg-bg-light text-gray-600 hover:bg-orange-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
};

export default AdminButton;
