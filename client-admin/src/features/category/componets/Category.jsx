import { useEffect, useMemo, useState } from 'react';
import { useCategoryStore } from '../store/categoryStore.js';
import { useUIStore } from '../../auth/store/uiStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { CategoryModal } from '../componets/CategoryModal.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

/* ─── TYPE CONFIG ─── */
const TYPE_CONFIG = {
  'Bebidas Frias':     { bg: '#dbeafe', border: '#93c5fd', color: '#1d4ed8', emoji: '🧊' },
  'Platillos':         { bg: '#dcfce7', border: '#86efac', color: '#15803d', emoji: '🍽️' },
  'Bebidas Calientes': { bg: '#ffedd5', border: '#fdba74', color: '#c2410c', emoji: '☕' },
  'Sopas':             { bg: '#fef9c3', border: '#fde047', color: '#a16207', emoji: '🍜' },
};

const ALL_TYPES = ['Bebidas Frias', 'Platillos', 'Bebidas Calientes', 'Sopas'];

/* ─── STATS ROW ─── */
const StatsRow = ({ categories }) => {
  const active = categories.filter((c) => c.isActive !== false);
  const inactive = categories.filter((c) => c.isActive === false);

  const stats = [
    { label: 'Total', value: categories.length, color: '#ea580c', bg: '#fff7ed', border: '#fdba74' },
    { label: 'Activas', value: active.length, color: '#15803d', bg: '#dcfce7', border: '#86efac' },
    { label: 'Inactivas', value: inactive.length, color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5' },
    ...ALL_TYPES.map((t) => ({
      label: t,
      value: active.filter((c) => c.type === t).length,
      color: TYPE_CONFIG[t]?.color || '#374151',
      bg: TYPE_CONFIG[t]?.bg || '#f9fafb',
      border: TYPE_CONFIG[t]?.border || '#e5e7eb',
    })),
  ];

  return (
    <div
      className="mb-6"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl transition hover:scale-[1.02]"
          style={{
            background: s.bg,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ color: s.color, fontSize: '1.8rem', fontWeight: 900, lineHeight: 1 }}>{s.value}</span>
          <span style={{ color: s.color, fontSize: '11px', fontWeight: 600, lineHeight: 1.3 }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── CATEGORY CARD ─── */
const CategoryCard = ({ category, onEdit, onDelete, onRestore }) => {
  const cfg = TYPE_CONFIG[category.type] || { bg: '#f3f4f6', border: '#e5e7eb', color: '#374151', emoji: '📁' };
  const isInactive = category.isActive === false;

  return (
    <div
      className="bg-white rounded-2xl transition-colors overflow-hidden flex flex-col animate-fadeInUp"
      style={{ opacity: isInactive ? 0.7 : 1 }}
    >
      {/* Top accent */}
      <div className="h-1.5 w-full" style={{ background: cfg.color }} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: cfg.bg }}
          >
            {cfg.emoji}
          </div>
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide"
            style={{
              background: isInactive ? '#fee2e2' : cfg.bg,
              color: isInactive ? '#b91c1c' : cfg.color,
            }}
          >
            {isInactive ? 'Inactiva' : 'Activa'}
          </span>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-base font-bold text-gray-800 leading-tight">{category.categoryName}</h3>
          <span
            className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-xl"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {category.type}
          </span>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{category.description}</p>
        </div>

        {/* Divider + Actions */}
        <div className="border-t border-gray-100 pt-3 flex gap-2 mt-auto">
          {isInactive ? (
            <button
              onClick={() => onRestore(category._id)}
              className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 flex items-center justify-center gap-1.5"
              style={{ background: '#22c55e' }}
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
                onClick={() => onEdit(category)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border transition hover:bg-orange-50"
                style={{ borderColor: '#fdba74', color: '#ea580c' }}
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(category._id, category.categoryName)}
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

/* ─── FILTER TABS ─── */
const FILTER_TABS = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Activas' },
  { key: 'inactive', label: 'Inactivas' },
  ...ALL_TYPES.map((t) => ({ key: t, label: t })),
];

/* ─── MAIN PAGE ─── */
const CategoriesPage = () => {
  const { categories, loading, error, fetchCategories, removeCategory, activateCategory } = useCategoryStore();
  const { openConfirm } = useUIStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const displayCategories = useMemo(() => {
    let list = [...categories];
    if (filter === 'inactive') list = list.filter((c) => c.isActive === false);
    else if (filter === 'active') list = list.filter((c) => c.isActive !== false);
    else if (filter !== 'all') list = list.filter((c) => c.isActive !== false && c.type === filter);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c.categoryName || '').toLowerCase().includes(q) ||
          (c.type || '').toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [categories, filter, search]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = (id, name) => {
    openConfirm({
      title: `Eliminar Categoría`,
      message: `¿Estás seguro de que deseas eliminar "${name}"? Se realizará un soft delete.`,
      onConfirm: async () => {
        const result = await removeCategory(id);
        if (result.success) showSuccess(`Categoría "${name}" eliminada`);
        else showError(result.error);
      },
    });
  };

  const handleRestore = (id) => {
    openConfirm({
      title: 'Restaurar Categoría',
      message: '¿Deseas restaurar esta categoría?',
      onConfirm: async () => {
        const result = await activateCategory(id);
        if (result.success) showSuccess('Categoría restaurada correctamente');
        else showError(result.error);
      },
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  if (loading && categories.length === 0) return <Spinner />;

  return (
    <div className="max-w-screen-xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            Gestión de Categorías
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Administra las categorías del menú del restaurante</p>
        </div>
        <button
          onClick={() => { setSelectedCategory(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-colors"
          style={{ background: '#ff5722' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Nueva Categoría
        </button>
      </div>

      {/* Stats */}
      <StatsRow categories={categories} />

      {/* Filters + Search */}
      <div className="mb-5" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '14px', background: '#fff', flexWrap: 'wrap' }}>
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
                background: filter === tab.key ? '#ff5722' : 'transparent',
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
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px', borderRadius: '10px', border: 'none', background: '#fff', fontSize: '13px', color: '#374151', outline: 'none' }}
          />
        </div>

        <button
          onClick={fetchCategories}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '10px', border: 'none', background: '#fff', color: '#6b7280', fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
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
        <div className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2" style={{ background: '#fee2e2', color: '#b91c1c' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && displayCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 text-4xl" style={{ background: '#fff7ed' }}>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-1">No hay categorías</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            {filter !== 'all' || search ? 'Ninguna coincide con los filtros.' : 'Crea tu primera categoría para organizar el menú.'}
          </p>
          {(filter !== 'all' || search) && (
            <button onClick={() => { setFilter('all'); setSearch(''); }} className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition">
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {displayCategories.length > 0 && (
        <>
          <p className="text-xs text-gray-400 font-medium mb-3">
            Mostrando {displayCategories.length} de {categories.length} categorías
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayCategories.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            ))}
          </div>
        </>
      )}

      <CategoryModal isOpen={modalOpen} onClose={handleModalClose} category={selectedCategory} />
    </div>
  );
};

export default CategoriesPage;