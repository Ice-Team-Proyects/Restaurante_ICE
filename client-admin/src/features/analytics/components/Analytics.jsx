import { useEffect, useMemo, useState } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore.js';
import { useUIStore } from '../../auth/store/uiStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { AnalyticsModal } from './AnalyticsModal.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

/* ─── TYPE CONFIG ─── */
const TYPE_CONFIG = {
  DASHBOARD: { bg: '#dbeafe', border: '#93c5fd', color: '#1d4ed8', emoji: '📊' },
  REPORTE: { bg: '#dcfce7', border: '#86efac', color: '#15803d', emoji: '📋' },
  ESTADISTICA: { bg: '#ffedd5', border: '#fdba74', color: '#c2410c', emoji: '📈' },
};

const ALL_TYPES = ['DASHBOARD', 'REPORTE', 'ESTADISTICA'];

/* ─── STATS ROW ─── */
const StatsRow = ({ analytics }) => {
  const active = analytics.filter((a) => a.isActive !== false);
  const inactive = analytics.filter((a) => a.isActive === false);

  const stats = [
    { label: 'Total', value: analytics.length, color: '#ea580c', bg: '#fff7ed', border: '#fdba74' },
    { label: 'Activos', value: active.length, color: '#15803d', bg: '#dcfce7', border: '#86efac' },
    {
      label: 'Inactivos',
      value: inactive.length,
      color: '#b91c1c',
      bg: '#fee2e2',
      border: '#fca5a5',
    },
    ...ALL_TYPES.map((t) => ({
      label: t,
      value: active.filter((a) => a.type === t).length,
      color: TYPE_CONFIG[t]?.color || '#374151',
      bg: TYPE_CONFIG[t]?.bg || '#f9fafb',
      border: TYPE_CONFIG[t]?.border || '#e5e7eb',
    })),
  ];

  return (
    <div
      className='mb-6'
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px',
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className='rounded-2xl transition hover:scale-[1.02]'
          style={{
            background: s.bg,
            border: `1.5px solid ${s.border}`,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ color: s.color, fontSize: '1.8rem', fontWeight: 900, lineHeight: 1 }}>
            {s.value}
          </span>
          <span style={{ color: s.color, fontSize: '11px', fontWeight: 600, lineHeight: 1.3 }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── ANALYTICS CARD ─── */
const AnalyticsCard = ({ analytics, onEdit, onDelete, onRestore }) => {
  const cfg = TYPE_CONFIG[analytics.type] || {
    bg: '#f3f4f6',
    border: '#e5e7eb',
    color: '#374151',
    emoji: '📁',
  };
  const isInactive = analytics.isActive === false;

  return (
    <div
      className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col animate-fadeInUp'
      style={{ border: `2px solid ${cfg.border}`, opacity: isInactive ? 0.7 : 1 }}
    >
      {/* Top accent */}
      <div
        className='h-1.5 w-full'
        style={{ background: `linear-gradient(to right, ${cfg.color}, ${cfg.border})` }}
      />

      <div className='p-5 flex flex-col gap-3 flex-1'>
        {/* Header */}
        <div className='flex items-start justify-between gap-2'>
          <div
            className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0'
            style={{ background: cfg.bg }}
          >
            {cfg.emoji}
          </div>
          <span
            className='text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide'
            style={{
              background: isInactive ? '#fee2e2' : cfg.bg,
              color: isInactive ? '#b91c1c' : cfg.color,
              border: `1px solid ${isInactive ? '#fca5a5' : cfg.border}`,
            }}
          >
            {isInactive ? 'Inactivo' : 'Activo'}
          </span>
        </div>

        {/* Info */}
        <div>
          <h3 className='text-base font-bold text-gray-800 leading-tight'>
            {analytics.metricName}
          </h3>
          <div className='flex items-center gap-2 mt-1'>
            <span
              className='inline-block text-xs font-semibold px-2 py-0.5 rounded-lg'
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {analytics.type}
            </span>
            <span className='text-lg font-black' style={{ color: cfg.color }}>
              {analytics.value}
            </span>
          </div>
          {analytics.description && (
            <p className='text-sm text-gray-500 mt-2 line-clamp-2'>{analytics.description}</p>
          )}
        </div>

        {/* Divider + Actions */}
        <div className='border-t border-gray-100 pt-3 flex gap-2 mt-auto'>
          {isInactive ? (
            <button
              onClick={() => onRestore(analytics._id)}
              className='flex-1 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 flex items-center justify-center gap-1.5'
              style={{ background: 'linear-gradient(to right,#22c55e,#16a34a)' }}
            >
              <svg width='13' height='13' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8'
                  stroke='white'
                  strokeWidth='2.5'
                  strokeLinecap='round'
                />
                <path
                  d='M4 8v4h4'
                  stroke='white'
                  strokeWidth='2.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              Restaurar
            </button>
          ) : (
            <>
              <button
                onClick={() => onEdit(analytics)}
                className='flex-1 py-2 rounded-xl text-xs font-bold border transition hover:bg-orange-50'
                style={{ borderColor: '#fdba74', color: '#ea580c' }}
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(analytics._id, analytics.metricName)}
                className='flex-1 py-2 rounded-xl text-xs font-bold border transition hover:bg-red-50'
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
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Activos' },
  { key: 'inactive', label: 'Inactivos' },
  ...ALL_TYPES.map((t) => ({ key: t, label: t })),
];

/* ─── MAIN PAGE ─── */
const AnalyticsPage = () => {
  const { analytics, loading, error, fetchAnalytics, removeAnalytics, activateAnalytics } =
    useAnalyticsStore();
  const { openConfirm } = useUIStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnalytics, setSelectedAnalytics] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const displayAnalytics = useMemo(() => {
    let list = [...analytics];
    if (filter === 'inactive') list = list.filter((a) => a.isActive === false);
    else if (filter === 'active') list = list.filter((a) => a.isActive !== false);
    else if (filter !== 'all') list = list.filter((a) => a.isActive !== false && a.type === filter);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          (a.metricName || '').toLowerCase().includes(q) ||
          (a.type || '').toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [analytics, filter, search]);

  const handleEdit = (item) => {
    setSelectedAnalytics(item);
    setModalOpen(true);
  };

  const handleDelete = (id, name) => {
    openConfirm({
      title: 'Eliminar Análisis',
      message: `¿Estás seguro de que deseas eliminar "${name}"? Se realizará un soft delete.`,
      onConfirm: async () => {
        const result = await removeAnalytics(id);
        if (result.success) showSuccess(`Análisis "${name}" eliminado`);
        else showError(result.error);
      },
    });
  };

  const handleRestore = (id) => {
    openConfirm({
      title: 'Restaurar Análisis',
      message: '¿Deseas restaurar este análisis?',
      onConfirm: async () => {
        const result = await activateAnalytics(id);
        if (result.success) showSuccess('Análisis restaurado correctamente');
        else showError(result.error);
      },
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAnalytics(null);
  };

  if (loading && analytics.length === 0) return <Spinner />;

  return (
    <div className='max-w-screen-xl mx-auto animate-fadeIn'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <div>
          <h1
            className='text-3xl font-black text-gray-800 leading-tight'
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gestión de Estadísticas
          </h1>
          <p className='text-gray-500 text-sm mt-0.5'>
            Administra los registros analíticos del restaurante
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedAnalytics(null);
            setModalOpen(true);
          }}
          className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.03] active:scale-95'
          style={{ background: 'linear-gradient(to right,#ea580c,#dc2626)' }}
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <path d='M12 5v14M5 12h14' stroke='white' strokeWidth='2.5' strokeLinecap='round' />
          </svg>
          Nuevo Análisis
        </button>
      </div>

      {/* Stats */}
      <StatsRow analytics={analytics} />

      {/* Filters + Search */}
      <div
        className='mb-5'
        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            borderRadius: '14px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            flexWrap: 'wrap',
          }}
        >
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
                background:
                  filter === tab.key ? 'linear-gradient(to right,#ea580c,#dc2626)' : 'transparent',
                color: filter === tab.key ? '#fff' : '#6b7280',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: '1', minWidth: '180px', maxWidth: '260px' }}>
          <svg
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
            width='15'
            height='15'
            viewBox='0 0 24 24'
            fill='none'
          >
            <circle cx='11' cy='11' r='7' stroke='#9ca3af' strokeWidth='2' />
            <path d='M21 21l-4.35-4.35' stroke='#9ca3af' strokeWidth='2' strokeLinecap='round' />
          </svg>
          <input
            type='text'
            placeholder='Buscar análisis...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '32px',
              paddingRight: '12px',
              paddingTop: '7px',
              paddingBottom: '7px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              fontSize: '13px',
              color: '#374151',
              outline: 'none',
            }}
          />
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#6b7280',
            fontSize: '13px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
          >
            <path
              d='M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <path
              d='M4 8v4h4'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className='mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2'
          style={{ background: '#fee2e2', color: '#b91c1c', border: '1.5px solid #fca5a5' }}
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <circle cx='12' cy='12' r='9' stroke='#ef4444' strokeWidth='2' />
            <path d='M12 8v4M12 16h.01' stroke='#ef4444' strokeWidth='2' strokeLinecap='round' />
          </svg>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && displayAnalytics.length === 0 && (
        <div className='flex flex-col items-center justify-center py-24 text-center'>
          <div
            className='w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg text-4xl'
            style={{ background: 'linear-gradient(135deg,#fff7ed,#ffedd5)' }}
          ></div>
          <h3 className='text-xl font-bold text-gray-700 mb-1'>No hay análisis</h3>
          <p className='text-gray-400 text-sm max-w-xs'>
            {filter !== 'all' || search
              ? 'Ninguno coincide con los filtros.'
              : 'Crea tu primer registro analítico.'}
          </p>
          {(filter !== 'all' || search) && (
            <button
              onClick={() => {
                setFilter('all');
                setSearch('');
              }}
              className='mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition'
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {displayAnalytics.length > 0 && (
        <>
          <p className='text-xs text-gray-400 font-medium mb-3'>
            Mostrando {displayAnalytics.length} de {analytics.length} análisis
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {displayAnalytics.map((item) => (
              <AnalyticsCard
                key={item._id}
                analytics={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            ))}
          </div>
        </>
      )}

      <AnalyticsModal isOpen={modalOpen} onClose={handleModalClose} analytics={selectedAnalytics} />
    </div>
  );
};

export default AnalyticsPage;
