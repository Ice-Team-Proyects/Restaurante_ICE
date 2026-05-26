import { useEffect, useMemo, useState } from 'react';
import { useEventsStore } from '../store/eventsStore.js';
import { useUIStore } from '../../auth/store/uiStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { EventModal } from './EventModal.jsx';
import { InscriptionModal } from './InscriptionModal.jsx';
import { PromotionModal } from './PromotionModal.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

/* 
   TARJETA DE EVENTO
    */
const EventCard = ({ event, onDelete, onRestore }) => {
  const isInactive = event.isActive === false;
  const dateStr = event.date_event ? new Date(event.date_event).toLocaleDateString('es-GT') : '';

  return (
    <div
      className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col animate-fadeInUp'
      style={{ border: '2px solid #93c5fd', opacity: isInactive ? 0.7 : 1 }}
    >
      <div
        className='h-1.5 w-full'
        style={{ background: 'linear-gradient(to right, #1d4ed8, #93c5fd)' }}
      />
      <div className='p-5 flex flex-col gap-3 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <div
            className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0'
            style={{ background: '#dbeafe' }}
          >
            🎉
          </div>
          <span
            className='text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide'
            style={{
              background: isInactive ? '#fee2e2' : '#dcfce7',
              color: isInactive ? '#b91c1c' : '#15803d',
              border: `1px solid ${isInactive ? '#fca5a5' : '#86efac'}`,
            }}
          >
            {isInactive ? 'Inactivo' : 'Activo'}
          </span>
        </div>
        <div>
          <h3 className='text-base font-bold text-gray-800 leading-tight'>{event.name_event}</h3>
          <div className='flex flex-wrap gap-2 mt-1'>
            <span
              className='text-xs font-semibold px-2 py-0.5 rounded-lg'
              style={{ background: '#dbeafe', color: '#1d4ed8' }}
            >
              📅 {dateStr}
            </span>
            <span
              className='text-xs font-semibold px-2 py-0.5 rounded-lg'
              style={{ background: '#dcfce7', color: '#15803d' }}
            >
              👥 {event.capacity}
            </span>
            <span
              className='text-xs font-semibold px-2 py-0.5 rounded-lg'
              style={{ background: '#ffedd5', color: '#c2410c' }}
            >
              Q{event.price}
            </span>
          </div>
          <p className='text-xs text-gray-500 mt-1'>📍 {event.location}</p>
          <p className='text-sm text-gray-500 mt-2 line-clamp-2'>{event.description}</p>
        </div>
        <div className='border-t border-gray-100 pt-3 flex gap-2 mt-auto'>
          {isInactive ? (
            <button
              onClick={() => onRestore(event._id)}
              className='flex-1 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 flex items-center justify-center gap-1.5'
              style={{ background: 'linear-gradient(to right,#22c55e,#16a34a)' }}
            >
              Restaurar
            </button>
          ) : (
            <button
              onClick={() => onDelete(event._id, event.name_event)}
              className='flex-1 py-2 rounded-xl text-xs font-bold border transition hover:bg-red-50'
              style={{ borderColor: '#fca5a5', color: '#ef4444' }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* 
   TARJETA DE INSCRIPCIÓN
    */
const STATUS_CONFIG = {
  pendiente: { bg: '#fef9c3', border: '#fde047', color: '#a16207' },
  confirmada: { bg: '#dcfce7', border: '#86efac', color: '#15803d' },
  cancelada: { bg: '#fee2e2', border: '#fca5a5', color: '#b91c1c' },
};

const InscriptionCard = ({ inscription, onDelete, onRestore }) => {
  const isInactive = inscription.isActive === false;
  const sCfg = STATUS_CONFIG[inscription.status] || STATUS_CONFIG.pendiente;

  return (
    <div
      className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col animate-fadeInUp'
      style={{ border: `2px solid ${sCfg.border}`, opacity: isInactive ? 0.7 : 1 }}
    >
      <div
        className='h-1.5 w-full'
        style={{ background: `linear-gradient(to right, ${sCfg.color}, ${sCfg.border})` }}
      />
      <div className='p-5 flex flex-col gap-3 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <div
            className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0'
            style={{ background: sCfg.bg }}
          >
            📝
          </div>
          <span
            className='text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide'
            style={{ background: sCfg.bg, color: sCfg.color, border: `1px solid ${sCfg.border}` }}
          >
            {inscription.status}
          </span>
        </div>
        <div>
          <h3 className='text-base font-bold text-gray-800 leading-tight'>
            {inscription.name_customer}
          </h3>
          <p className='text-xs text-gray-500 mt-1'>📧 {inscription.email_customer}</p>
          <p className='text-xs text-gray-500'>📞 {inscription.phone_customer}</p>
          <div className='flex flex-wrap gap-2 mt-2'>
            <span
              className='text-xs font-semibold px-2 py-0.5 rounded-lg'
              style={{ background: '#dbeafe', color: '#1d4ed8' }}
            >
              👥 {inscription.number_people} personas
            </span>
            <span
              className='text-xs font-semibold px-2 py-0.5 rounded-lg'
              style={{ background: '#ffedd5', color: '#c2410c' }}
            >
              Q{inscription.total_price}
            </span>
          </div>
        </div>
        <div className='border-t border-gray-100 pt-3 flex gap-2 mt-auto'>
          {isInactive ? (
            <button
              onClick={() => onRestore(inscription._id)}
              className='flex-1 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 flex items-center justify-center gap-1.5'
              style={{ background: 'linear-gradient(to right,#22c55e,#16a34a)' }}
            >
              Restaurar
            </button>
          ) : (
            <button
              onClick={() => onDelete(inscription._id, inscription.name_customer)}
              className='flex-1 py-2 rounded-xl text-xs font-bold border transition hover:bg-red-50'
              style={{ borderColor: '#fca5a5', color: '#ef4444' }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* 
   TARJETA DE PROMOCIÓN
    */
const PromotionCard = ({ promotion, onDelete, onRestore }) => {
  const isInactive = promotion.isActive === false;
  const startStr = promotion.date_start
    ? new Date(promotion.date_start).toLocaleDateString('es-GT')
    : '';
  const endStr = promotion.date_end ? new Date(promotion.date_end).toLocaleDateString('es-GT') : '';

  return (
    <div
      className='bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col animate-fadeInUp'
      style={{ border: '2px solid #fdba74', opacity: isInactive ? 0.7 : 1 }}
    >
      <div
        className='h-1.5 w-full'
        style={{ background: 'linear-gradient(to right, #c2410c, #fdba74)' }}
      />
      <div className='p-5 flex flex-col gap-3 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <div
            className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0'
            style={{ background: '#ffedd5' }}
          >
            🎁
          </div>
          <span
            className='text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide'
            style={{
              background: isInactive ? '#fee2e2' : '#dcfce7',
              color: isInactive ? '#b91c1c' : '#15803d',
              border: `1px solid ${isInactive ? '#fca5a5' : '#86efac'}`,
            }}
          >
            {isInactive ? 'Inactiva' : 'Activa'}
          </span>
        </div>
        <div>
          <h3 className='text-base font-bold text-gray-800 leading-tight'>
            {promotion.name_promotion}
          </h3>
          <div className='flex flex-wrap gap-2 mt-1'>
            <span
              className='text-xs font-semibold px-2 py-0.5 rounded-lg'
              style={{ background: '#dcfce7', color: '#15803d' }}
            >
              {promotion.discount_percentage}% descuento
            </span>
            <span
              className='text-xs font-semibold px-2 py-0.5 rounded-lg'
              style={{ background: '#dbeafe', color: '#1d4ed8' }}
            >
              Mín. {promotion.min_people} personas
            </span>
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            📅 {startStr} — {endStr}
          </p>
          <p className='text-sm text-gray-500 mt-2 line-clamp-2'>{promotion.description}</p>
        </div>
        <div className='border-t border-gray-100 pt-3 flex gap-2 mt-auto'>
          {isInactive ? (
            <button
              onClick={() => onRestore(promotion._id)}
              className='flex-1 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 flex items-center justify-center gap-1.5'
              style={{ background: 'linear-gradient(to right,#22c55e,#16a34a)' }}
            >
              Restaurar
            </button>
          ) : (
            <button
              onClick={() => onDelete(promotion._id, promotion.name_promotion)}
              className='flex-1 py-2 rounded-xl text-xs font-bold border transition hover:bg-red-50'
              style={{ borderColor: '#fca5a5', color: '#ef4444' }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* 
   PÁGINA PRINCIPAL CON TABS
    */
const TABS = [
  { key: 'events', label: 'Eventos', emoji: '🎉' },
  { key: 'inscriptions', label: 'Inscripciones', emoji: '📝' },
  { key: 'promotions', label: 'Promociones', emoji: '🎁' },
];

const EventsPage = () => {
  const {
    events,
    loadingEvents,
    errorEvents,
    fetchEvents,
    removeEvent,
    activateEvent,
    inscriptions,
    loadingInscriptions,
    errorInscriptions,
    fetchInscriptions,
    removeInscription,
    activateInscription,
    promotions,
    loadingPromotions,
    errorPromotions,
    fetchPromotions,
    removePromotion,
    activatePromotion,
  } = useEventsStore();
  const { openConfirm } = useUIStore();

  const [activeTab, setActiveTab] = useState('events');
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [inscriptionModalOpen, setInscriptionModalOpen] = useState(false);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchInscriptions();
    fetchPromotions();
  }, [fetchEvents, fetchInscriptions, fetchPromotions]);

  // Filtrado por búsqueda
  const filteredEvents = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.trim().toLowerCase();
    return events.filter(
      (e) =>
        (e.name_event || '').toLowerCase().includes(q) ||
        (e.location || '').toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q)
    );
  }, [events, search]);

  const filteredInscriptions = useMemo(() => {
    if (!search.trim()) return inscriptions;
    const q = search.trim().toLowerCase();
    return inscriptions.filter(
      (i) =>
        (i.name_customer || '').toLowerCase().includes(q) ||
        (i.email_customer || '').toLowerCase().includes(q) ||
        (i.status || '').toLowerCase().includes(q)
    );
  }, [inscriptions, search]);

  const filteredPromotions = useMemo(() => {
    if (!search.trim()) return promotions;
    const q = search.trim().toLowerCase();
    return promotions.filter(
      (p) =>
        (p.name_promotion || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    );
  }, [promotions, search]);

  // ─── Handlers ───
  const handleDeleteEvent = (id, name) => {
    openConfirm({
      title: 'Eliminar Evento',
      message: `¿Eliminar "${name}"?`,
      onConfirm: async () => {
        const r = await removeEvent(id);
        r.success ? showSuccess(`Evento "${name}" eliminado`) : showError(r.error);
      },
    });
  };
  const handleRestoreEvent = (id) => {
    openConfirm({
      title: 'Restaurar Evento',
      message: '¿Restaurar este evento?',
      onConfirm: async () => {
        const r = await activateEvent(id);
        r.success ? showSuccess('Evento restaurado') : showError(r.error);
      },
    });
  };
  const handleDeleteInscription = (id, name) => {
    openConfirm({
      title: 'Eliminar Inscripción',
      message: `¿Eliminar inscripción de "${name}"?`,
      onConfirm: async () => {
        const r = await removeInscription(id);
        r.success ? showSuccess('Inscripción eliminada') : showError(r.error);
      },
    });
  };
  const handleRestoreInscription = (id) => {
    openConfirm({
      title: 'Restaurar Inscripción',
      message: '¿Restaurar esta inscripción?',
      onConfirm: async () => {
        const r = await activateInscription(id);
        r.success ? showSuccess('Inscripción restaurada') : showError(r.error);
      },
    });
  };
  const handleDeletePromotion = (id, name) => {
    openConfirm({
      title: 'Eliminar Promoción',
      message: `¿Eliminar "${name}"?`,
      onConfirm: async () => {
        const r = await removePromotion(id);
        r.success ? showSuccess('Promoción eliminada') : showError(r.error);
      },
    });
  };
  const handleRestorePromotion = (id) => {
    openConfirm({
      title: 'Restaurar Promoción',
      message: '¿Restaurar esta promoción?',
      onConfirm: async () => {
        const r = await activatePromotion(id);
        r.success ? showSuccess('Promoción restaurada') : showError(r.error);
      },
    });
  };

  const loading =
    activeTab === 'events'
      ? loadingEvents
      : activeTab === 'inscriptions'
        ? loadingInscriptions
        : loadingPromotions;
  const error =
    activeTab === 'events'
      ? errorEvents
      : activeTab === 'inscriptions'
        ? errorInscriptions
        : errorPromotions;
  const refreshFn =
    activeTab === 'events'
      ? fetchEvents
      : activeTab === 'inscriptions'
        ? fetchInscriptions
        : fetchPromotions;

  const isFirstLoad =
    (activeTab === 'events' && loadingEvents && events.length === 0) ||
    (activeTab === 'inscriptions' && loadingInscriptions && inscriptions.length === 0) ||
    (activeTab === 'promotions' && loadingPromotions && promotions.length === 0);

  if (isFirstLoad) return <Spinner />;

  const openModal = () => {
    if (activeTab === 'events') setEventModalOpen(true);
    else if (activeTab === 'inscriptions') setInscriptionModalOpen(true);
    else setPromotionModalOpen(true);
  };

  const buttonLabel =
    activeTab === 'events'
      ? 'Nuevo Evento'
      : activeTab === 'inscriptions'
        ? 'Nueva Inscripción'
        : 'Nueva Promoción';

  return (
    <div className='max-w-screen-xl mx-auto animate-fadeIn'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <div>
          <h1
            className='text-3xl font-black text-gray-800 leading-tight'
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gestión de Eventos
          </h1>
          <p className='text-gray-500 text-sm mt-0.5'>
            Administra eventos, inscripciones y promociones
          </p>
        </div>
        <button
          onClick={openModal}
          className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.03] active:scale-95'
          style={{ background: 'linear-gradient(to right,#ea580c,#dc2626)' }}
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <path d='M12 5v14M5 12h14' stroke='white' strokeWidth='2.5' strokeLinecap='round' />
          </svg>
          {buttonLabel}
        </button>
      </div>

      {/* Stats */}
      <div
        className='mb-6'
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
        }}
      >
        {[
          {
            label: 'Eventos',
            value: events.filter((e) => e.isActive !== false).length,
            color: '#1d4ed8',
            bg: '#dbeafe',
            border: '#93c5fd',
          },
          {
            label: 'Inscripciones',
            value: inscriptions.filter((i) => i.isActive !== false).length,
            color: '#a16207',
            bg: '#fef9c3',
            border: '#fde047',
          },
          {
            label: 'Promociones',
            value: promotions.filter((p) => p.isActive !== false).length,
            color: '#c2410c',
            bg: '#ffedd5',
            border: '#fdba74',
          },
        ].map((s) => (
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

      {/* Tabs + Search */}
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
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearch('');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all .15s',
                background:
                  activeTab === tab.key
                    ? 'linear-gradient(to right,#ea580c,#dc2626)'
                    : 'transparent',
                color: activeTab === tab.key ? '#fff' : '#6b7280',
              }}
            >
              {tab.emoji} {tab.label}
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
            placeholder='Buscar...'
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
          onClick={refreshFn}
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
          {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className='mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2'
          style={{ background: '#fee2e2', color: '#b91c1c', border: '1.5px solid #fca5a5' }}
        >
          {error}
        </div>
      )}

      {/*  TAB: EVENTOS */}
      {activeTab === 'events' && (
        <>
          {filteredEvents.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <h3 className='text-xl font-bold text-gray-700 mb-1'>No hay eventos</h3>
              <p className='text-gray-400 text-sm'>Crea tu primer evento.</p>
            </div>
          ) : (
            <>
              <p className='text-xs text-gray-400 font-medium mb-3'>
                Mostrando {filteredEvents.length} de {events.length} eventos
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filteredEvents.map((ev) => (
                  <EventCard
                    key={ev._id}
                    event={ev}
                    onDelete={handleDeleteEvent}
                    onRestore={handleRestoreEvent}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* TAB: INSCRIPCIONES */}
      {activeTab === 'inscriptions' && (
        <>
          {filteredInscriptions.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <h3 className='text-xl font-bold text-gray-700 mb-1'>No hay inscripciones</h3>
              <p className='text-gray-400 text-sm'>Crea tu primera inscripción.</p>
            </div>
          ) : (
            <>
              <p className='text-xs text-gray-400 font-medium mb-3'>
                Mostrando {filteredInscriptions.length} de {inscriptions.length} inscripciones
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filteredInscriptions.map((ins) => (
                  <InscriptionCard
                    key={ins._id}
                    inscription={ins}
                    onDelete={handleDeleteInscription}
                    onRestore={handleRestoreInscription}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* TAB: PROMOCIONES*/}
      {activeTab === 'promotions' && (
        <>
          {filteredPromotions.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <h3 className='text-xl font-bold text-gray-700 mb-1'>No hay promociones</h3>
              <p className='text-gray-400 text-sm'>Crea tu primera promoción.</p>
            </div>
          ) : (
            <>
              <p className='text-xs text-gray-400 font-medium mb-3'>
                Mostrando {filteredPromotions.length} de {promotions.length} promociones
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filteredPromotions.map((promo) => (
                  <PromotionCard
                    key={promo._id}
                    promotion={promo}
                    onDelete={handleDeletePromotion}
                    onRestore={handleRestorePromotion}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Modales */}
      <EventModal isOpen={eventModalOpen} onClose={() => setEventModalOpen(false)} />
      <InscriptionModal
        isOpen={inscriptionModalOpen}
        onClose={() => setInscriptionModalOpen(false)}
      />
      <PromotionModal isOpen={promotionModalOpen} onClose={() => setPromotionModalOpen(false)} />
    </div>
  );
};

export default EventsPage;
