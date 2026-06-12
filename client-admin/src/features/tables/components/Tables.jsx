import { useEffect, useState, useMemo } from 'react';
import { useTablesStore } from '../store/tablesStore.js';
import { useUIStore } from '../../auth/store/uiStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { TableModal } from './TableModal.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

/* ─── STATUS CONFIG ─── */
const STATUS_CONFIG = {
  disponible: {
    label: 'Libre',
    bg: '#dcfce7',
    border: '#86efac',
    icon: '#22c55e',
    text: '#15803d',
    badgeBg: '#dcfce7',
    icon_svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  ocupada: {
    label: 'Ocupada',
    bg: '#ffedd5',
    border: '#fdba74',
    icon: '#f97316',
    text: '#c2410c',
    badgeBg: '#ffedd5',
    icon_svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="#f97316" strokeWidth="2.5"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  reservada: {
    label: 'Reservada',
    bg: '#dbeafe',
    border: '#93c5fd',
    icon: '#3b82f6',
    text: '#1d4ed8',
    badgeBg: '#dbeafe',
    icon_svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2.5"/>
        <path d="M16 2v4M8 2v4M3 10h18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 14h8M8 18h5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  inactiva: {
    label: 'Inactiva',
    bg: '#fee2e2',
    border: '#fca5a5',
    icon: '#ef4444',
    text: '#b91c1c',
    badgeBg: '#fee2e2',
    icon_svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2.5"/>
        <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

/* ─── STATUS FILTER TABS ─── */
const FILTER_TABS = [
  { key: 'all', label: 'Todas' },
  { key: 'disponible', label: 'Libres' },
  { key: 'ocupada', label: 'Ocupadas' },
  { key: 'reservada', label: 'Reservadas' },
  { key: 'inactiva', label: 'Inactivas' },
];

/* ─── QUICK-STATUS PILL (inline changer) ─── */
const QuickStatusPill = ({ table, onChange }) => {
  const [open, setOpen] = useState(false);
  const opts = ['disponible', 'ocupada', 'reservada'];

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all hover:scale-105 active:scale-95"
        style={{
          background: STATUS_CONFIG[table.status]?.bg || '#f3f4f6',
          borderColor: STATUS_CONFIG[table.status]?.border || '#e5e7eb',
          color: STATUS_CONFIG[table.status]?.text || '#374151',
        }}
        title="Cambiar estado"
      >
        {STATUS_CONFIG[table.status]?.icon_svg}
        {STATUS_CONFIG[table.status]?.label || table.status}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-fadeIn"
          style={{ minWidth: 140 }}
          onMouseLeave={() => setOpen(false)}
        >
          {opts.map((s) => (
            <button
              key={s}
              onClick={(e) => { e.stopPropagation(); onChange(s); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-orange-50 transition text-left"
              style={{ color: STATUS_CONFIG[s]?.text }}
            >
              {STATUS_CONFIG[s]?.icon_svg}
              {STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── TABLE CARD ─── */
const TableCard = ({ table, onEdit, onDelete, onRestore, onStatusChange }) => {
  const cfg = table.isActive === false
    ? STATUS_CONFIG.inactiva
    : (STATUS_CONFIG[table.status] || STATUS_CONFIG.disponible);

  const isInactive = table.isActive === false;

  return (
    <div
      className="table-card animate-fadeInUp bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
      style={{
        border: `2px solid ${cfg.border}`,
        opacity: isInactive ? 0.75 : 1,
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(to right, ${cfg.icon}, ${cfg.border})` }}
      />

      {/* Card body */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Number badge + status */}
        <div className="flex items-start justify-between">
          {/* Big number */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}
          >
            <span className="text-white text-2xl font-black">{table.number}</span>
          </div>

          {/* Status badge */}
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: cfg.bg, color: cfg.text, border: `1.5px solid ${cfg.border}` }}
          >
            {cfg.icon_svg}
            {cfg.label}
          </span>
        </div>

        {/* Info rows */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#9ca3af" strokeWidth="2"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>
              Capacidad: <strong className="text-gray-700">{table.capacity} personas</strong>
            </span>
          </div>

          {table.restaurant && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2M3 21h2" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 10h6M9 14h6" stroke="#9ca3af" strokeWidth="2"/>
              </svg>
              <span>
                Sucursal: <strong className="text-gray-700">{table.restaurant.name || table.restaurant}</strong>
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#9ca3af" strokeWidth="2"/>
              <circle cx="12" cy="9" r="2.5" stroke="#9ca3af" strokeWidth="2"/>
            </svg>
            <span className="truncate text-gray-400">ID: {table._id}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Actions */}
        <div className="flex gap-2 items-center">
          {isInactive ? (
            /* Inactive table: restore button */
            <button
              onClick={() => onRestore(table._id)}
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
              {/* Quick status change */}
              <QuickStatusPill table={table} onChange={(s) => onStatusChange(table._id, s)} />

              {/* Edit */}
              <button
                onClick={() => onEdit(table)}
                className="p-2 rounded-xl transition hover:bg-orange-50 border border-gray-200 hover:border-orange-300"
                title="Editar mesa"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Delete */}
              <button
                onClick={() => onDelete(table._id, table.number)}
                className="p-2 rounded-xl transition hover:bg-red-50 border border-gray-200 hover:border-red-300"
                title="Eliminar mesa"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── STATS SUMMARY ROW ─── */
const StatsRow = ({ tables }) => {
  const active = tables.filter((t) => t.isActive !== false);
  const counts = {
    total: tables.length,
    disponible: active.filter((t) => t.status === 'disponible').length,
    ocupada: active.filter((t) => t.status === 'ocupada').length,
    reservada: active.filter((t) => t.status === 'reservada').length,
    inactiva: tables.filter((t) => t.isActive === false).length,
  };

  const stats = [
    { label: 'Total Mesas', value: counts.total, color: '#ea580c', bg: '#fff7ed', border: '#fdba74' },
    { label: 'Disponibles', value: counts.disponible, color: '#15803d', bg: '#dcfce7', border: '#86efac' },
    { label: 'Ocupadas', value: counts.ocupada, color: '#c2410c', bg: '#ffedd5', border: '#fdba74' },
    { label: 'Reservadas', value: counts.reservada, color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd' },
    { label: 'Inactivas', value: counts.inactiva, color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5' },
  ];

  return (
    <div className="mb-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl transition hover:scale-[1.02]"
          style={{
            background: s.bg,
            border: `1.5px solid ${s.border}`,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ color: s.color, fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{s.value}</span>
          <span style={{ color: s.color, fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── MAIN TABLES VIEW ─── */
export const Tables = () => {
  const { tables, loading, error, fetchTables, editTable, removeTable, activateTable } = useTablesStore();
  const { openConfirm } = useUIStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // Filter + search logic
  const displayTables = useMemo(() => {
    let list = [...tables];
    if (filter === 'inactiva') {
      list = list.filter((t) => t.isActive === false);
    } else if (filter !== 'all') {
      list = list.filter((t) => t.isActive !== false && t.status === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          String(t.number).includes(q) ||
          String(t.capacity).includes(q) ||
          (t.status || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => a.number - b.number);
  }, [tables, filter, search]);

  // Quick status change handler
  const handleStatusChange = async (id, newStatus) => {
    const result = await editTable(id, { status: newStatus });
    if (result.success) showSuccess('Estado actualizado');
    else showError(result.error);
  };

  const handleEdit = (table) => {
    setSelectedTable(table);
    setModalOpen(true);
  };

  const handleDelete = (id, number) => {
    openConfirm({
      title: `Eliminar Mesa #${number}`,
      message: `¿Estás seguro de que deseas eliminar la Mesa #${number}? Esta acción realizará un soft delete.`,
      onConfirm: async () => {
        const result = await removeTable(id);
        if (result.success) showSuccess(`Mesa #${number} eliminada`);
        else showError(result.error);
      },
    });
  };

  const handleRestore = (id) => {
    openConfirm({
      title: 'Restaurar Mesa',
      message: '¿Deseas restaurar esta mesa y ponerla como disponible?',
      onConfirm: async () => {
        const result = await activateTable(id);
        if (result.success) showSuccess('Mesa restaurada correctamente');
        else showError(result.error);
      },
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTable(null);
  };

  if (loading && tables.length === 0) return <Spinner />;

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-3xl font-black text-gray-800 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gestión de Mesas
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Administra el estado y la distribución de las mesas del restaurante
          </p>
        </div>

        <button
          onClick={() => { setSelectedTable(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.03] active:scale-95"
          style={{ background: 'linear-gradient(to right,#ea580c,#dc2626)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Nueva Mesa
        </button>
      </div>

      {/* ── STATS ── */}
      <StatsRow tables={tables} />

      {/* ── FILTERS + SEARCH ── */}
      <div className="mb-5" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Row 1: filter tabs + refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Filter tabs pill group */}
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '4px',
              borderRadius: '14px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              flexWrap: 'wrap',
            }}
          >
            {FILTER_TABS.map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all .15s',
                    background: active ? 'linear-gradient(to right,#ea580c,#dc2626)' : 'transparent',
                    color: active ? '#fff' : '#6b7280',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '180px', maxWidth: '280px' }}>
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar mesa..."
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

          {/* Refresh */}
          <button
            onClick={fetchTables}
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
              whiteSpace: 'nowrap',
            }}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
            >
              <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 8v4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {loading ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* ── ERROR STATE ── */}
      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: '#fee2e2', color: '#b91c1c', border: '1.5px solid #fca5a5' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error} — Verifica que el servidor esté corriendo en{' '}
          <code className="bg-red-100 px-1 rounded">localhost:3021</code>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && displayTables.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg,#fff7ed,#ffedd5)' }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="3" rx="1.5" stroke="#ea580c" strokeWidth="2"/>
              <path d="M5 10v7M19 10v7M9 17h6" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-1">No hay mesas</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            {filter !== 'all' || search
              ? 'Ninguna mesa coincide con los filtros aplicados.'
              : 'Crea tu primera mesa para empezar a gestionar el restaurante.'}
          </p>
          {(filter !== 'all' || search) && (
            <button
              onClick={() => { setFilter('all'); setSearch(''); }}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* ── GRID OF TABLE CARDS ── */}
      {displayTables.length > 0 && (
        <>
          <p className="text-xs text-gray-400 font-medium mb-3">
            Mostrando {displayTables.length} de {tables.length} mesas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayTables.map((table) => (
              <TableCard
                key={table._id}
                table={table}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </>
      )}

      {/* ── MODAL ── */}
      <TableModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        table={selectedTable}
      />
    </div>
  );
};
