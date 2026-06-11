import { useEffect, useMemo, useState } from 'react';
import { useProductsStore } from '../store/productsStore.js';
import { useCategoryStore } from '../../category/store/categoryStore.js';
import { useUIStore } from '../../auth/store/uiStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { ProductModal } from '../components/ProductModal.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';
import { getImageUrl } from '../../../shared/utils/cloudinary.js';

/* ─── PRODUCT CARD ─── */
const ProductCard = ({ product, onEdit, onDelete, onRestore }) => {
  const isInactive = product.isActive === false;
  const imageUrl = getImageUrl(product.photo);

  const categoryName =
    typeof product.category === 'object'
      ? product.category?.categoryName
      : product.category || '—';

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col animate-fadeInUp"
      style={{ border: '2px solid #e5e7eb', opacity: isInactive ? 0.7 : 1 }}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={imageUrl || 'https://placehold.co/400x240/fff7ed/ea580c?text=Sin+Imagen'}
          alt={product.saucer}
          className="w-full h-44 object-cover bg-gray-100"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x240/fff7ed/ea580c?text=Sin+Imagen';
          }}
        />
        {/* Status badge over image */}
        <span
          className="absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow"
          style={{
            background: isInactive ? '#fee2e2' : '#dcfce7',
            color: isInactive ? '#b91c1c' : '#15803d',
          }}
        >
          {isInactive ? 'Inactivo' : 'Activo'}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Category tag */}
        <span
          className="self-start text-xs font-semibold px-2 py-0.5 rounded-lg"
          style={{ background: '#fff7ed', color: '#ea580c' }}
        >
          {categoryName}
        </span>

        {/* Name */}
        <h3 className="text-base font-bold text-gray-800 leading-tight line-clamp-2">{product.saucer}</h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 flex-1">{product.description}</p>

        {/* Price */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xl font-black" style={{ color: '#ea580c' }}>
            Q{Number(product.price).toFixed(2)}
          </span>
        </div>

        {/* Divider + Actions */}
        <div className="border-t border-gray-100 pt-3 flex gap-2 mt-1">
          {isInactive ? (
            <button
              onClick={() => onRestore(product._id)}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 flex items-center justify-center gap-1.5"
              style={{ background: 'linear-gradient(to right,#22c55e,#16a34a)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M4 8v4h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Restaurar
            </button>
          ) : (
            <>
              <button
                onClick={() => onEdit(product)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border transition hover:bg-orange-50"
                style={{ borderColor: '#fdba74', color: '#ea580c' }}
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(product._id, product.saucer)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border transition hover:bg-red-50"
                style={{ borderColor: '#fca5a5', color: '#ef4444' }}
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── STATS ROW ─── */
const StatsRow = ({ products }) => {
  const active = products.filter((p) => p.isActive !== false);
  const inactive = products.filter((p) => p.isActive === false);

  const stats = [
    { label: 'Total', value: products.length, color: '#ea580c', bg: '#fff7ed', border: '#fdba74' },
    { label: 'Activos', value: active.length, color: '#15803d', bg: '#dcfce7', border: '#86efac' },
    { label: 'Inactivos', value: inactive.length, color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5' },
  ];

  return (
    <div className="mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl transition hover:scale-[1.02]"
          style={{ background: s.bg, border: `1.5px solid ${s.border}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <span style={{ color: s.color, fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{s.value}</span>
          <span style={{ color: s.color, fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── MAIN PAGE ─── */
const ProductsPage = () => {
  const { products, loading, error, fetchProducts, removeProduct, activateProduct } = useProductsStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { openConfirm } = useUIStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
    if (categories.length === 0) fetchCategories();
  }, []);

  // Build category filter tabs dynamically
  const activeCategories = useMemo(() => categories.filter((c) => c.isActive !== false), [categories]);

  const FILTER_TABS = useMemo(() => [
    { key: 'all', label: 'Todos' },
    { key: 'active', label: 'Activos' },
    { key: 'inactive', label: 'Inactivos' },
    ...activeCategories.map((c) => ({ key: c._id, label: c.categoryName })),
  ], [activeCategories]);

  const displayProducts = useMemo(() => {
    let list = [...products];
    if (filter === 'inactive') list = list.filter((p) => p.isActive === false);
    else if (filter === 'active') list = list.filter((p) => p.isActive !== false);
    else if (filter !== 'all') {
      list = list.filter((p) => {
        const catId = typeof p.category === 'object' ? p.category?._id : p.category;
        return p.isActive !== false && catId === filter;
      });
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.saucer || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, filter, search]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id, name) => {
    openConfirm({
      title: 'Eliminar Producto',
      message: `¿Estás seguro de que deseas eliminar "${name}"? Se realizará un soft delete.`,
      onConfirm: async () => {
        const result = await removeProduct(id);
        if (result.success) showSuccess(`"${name}" eliminado`);
        else showError(result.error);
      },
    });
  };

  const handleRestore = (id) => {
    openConfirm({
      title: 'Restaurar Producto',
      message: '¿Deseas restaurar este producto y ponerlo como activo?',
      onConfirm: async () => {
        const result = await activateProduct(id);
        if (result.success) showSuccess('Producto restaurado correctamente');
        else showError(result.error);
      },
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading && products.length === 0) return <Spinner />;

  return (
    <div className="max-w-screen-xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Gestión de Productos
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Administra el menú de platillos y bebidas</p>
        </div>
        <button
          onClick={() => { setSelectedProduct(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.03] active:scale-95"
          style={{ background: 'linear-gradient(to right,#ea580c,#dc2626)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Stats */}
      <StatsRow products={products} />

      {/* Filters + Search */}
      <div className="mb-5" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '14px', background: '#fff', border: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all .15s',
                background: filter === tab.key ? 'linear-gradient(to right,#ea580c,#dc2626)' : 'transparent',
                color: filter === tab.key ? '#fff' : '#6b7280',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: '1', minWidth: '180px', maxWidth: '260px' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '13px', color: '#374151', outline: 'none' }}
          />
        </div>

        <button
          onClick={fetchProducts}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
            <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 8v4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2" style={{ background: '#fee2e2', color: '#b91c1c', border: '1.5px solid #fca5a5' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && displayProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg text-4xl" style={{ background: 'linear-gradient(135deg,#fff7ed,#ffedd5)' }}>
            🍽️
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-1">No hay productos</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            {filter !== 'all' || search ? 'Ninguno coincide con los filtros.' : 'Agrega tu primer producto al menú.'}
          </p>
          {(filter !== 'all' || search) && (
            <button onClick={() => { setFilter('all'); setSearch(''); }} className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition">
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {displayProducts.length > 0 && (
        <>
          <p className="text-xs text-gray-400 font-medium mb-3">
            Mostrando {displayProducts.length} de {products.length} productos
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            ))}
          </div>
        </>
      )}

      <ProductModal isOpen={modalOpen} onClose={handleModalClose} product={selectedProduct} />
    </div>
  );
};

export default ProductsPage;