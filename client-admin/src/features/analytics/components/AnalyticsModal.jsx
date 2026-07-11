import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

const ANALYTICS_TYPES = ['DASHBOARD', 'REPORTE', 'ESTADISTICA'];

const TYPE_CONFIG = {
  DASHBOARD: { bg: '#dbeafe', border: '#93c5fd', color: '#1d4ed8' },
  REPORTE: { bg: '#dcfce7', border: '#86efac', color: '#15803d' },
  ESTADISTICA: { bg: '#ffedd5', border: '#fdba74', color: '#c2410c' },
};

export const AnalyticsModal = ({ isOpen, onClose, analytics }) => {
  const { addAnalytics, editAnalytics, loading } = useAnalyticsStore();
  const isEdit = Boolean(analytics);

  const [form, setForm] = useState({
    metricName: '',
    value: 0,
    type: 'ESTADISTICA',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (analytics) {
        setForm({
          metricName: analytics.metricName,
          value: analytics.value,
          type: analytics.type,
          description: analytics.description || '',
        });
      } else {
        setForm({ metricName: '', value: 0, type: 'ESTADISTICA', description: '' });
      }
      setErrors({});
    }
  }, [isOpen, analytics]);

  const validate = () => {
    const errs = {};
    if (!form.metricName.trim() || form.metricName.trim().length < 2)
      errs.metricName = 'El nombre debe tener al menos 2 caracteres';
    if (form.value === '' || isNaN(form.value))
      errs.value = 'El valor es requerido y debe ser un número';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const payload = { ...form, value: Number(form.value) };
    const result = isEdit
      ? await editAnalytics(analytics._id, payload)
      : await addAnalytics(payload);

    if (result.success) {
      showSuccess(isEdit ? 'Análisis actualizado correctamente' : 'Análisis creado correctamente');
      onClose();
    } else {
      showError(result.error || 'Error al guardar el análisis');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
      <div
        className='bg-white rounded-2xl  w-full max-w-md overflow-hidden animate-scaleIn'
        style={{ border: '1px solid #e5e7eb' }}
      >
        {/* Header */}
        <div
          className='px-6 py-5 text-white'
          style={{ background: '#ff5722' }}
        >
          <div className='flex items-center gap-3'>
            <div
              className='w-10 h-10 rounded-xl flex items-center justify-center'
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M4 6h16M4 10h16M4 14h10M4 18h6'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <div>
              <h2 className='text-xl font-bold'>
                {isEdit ? 'Editar Análisis' : 'Nuevo Análisis'}
              </h2>
              <p className='text-orange-100 text-xs'>
                {isEdit
                  ? `Actualizando: ${analytics.metricName}`
                  : 'Agrega un nuevo registro analítico'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-5'>
          {/* Nombre de la métrica */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
              Nombre de la métrica <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={form.metricName}
              onChange={(e) => setForm({ ...form, metricName: e.target.value })}
              placeholder='Ej. Ventas Mensuales'
              className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
              style={{
                borderColor: errors.metricName ? '#ef4444' : '#e5e7eb',
                background: '#f9fafb',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.metricName ? '#ef4444' : '#e5e7eb')
              }
            />
            {errors.metricName && <p className='text-red-500 text-xs mt-1'>{errors.metricName}</p>}
          </div>

          {/* Valor */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
              Valor <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder='Ej. 15000'
              className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
              style={{
                borderColor: errors.value ? '#ef4444' : '#e5e7eb',
                background: '#f9fafb',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) => (e.target.style.borderColor = errors.value ? '#ef4444' : '#e5e7eb')}
            />
            {errors.value && <p className='text-red-500 text-xs mt-1'>{errors.value}</p>}
          </div>

          {/* Tipo */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Tipo <span className='text-red-500'>*</span>
            </label>
            <div className='grid grid-cols-3 gap-2'>
              {ANALYTICS_TYPES.map((t) => {
                const cfg = TYPE_CONFIG[t];
                const active = form.type === t;
                return (
                  <button
                    key={t}
                    type='button'
                    onClick={() => setForm({ ...form, type: t })}
                    className='py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all text-center'
                    style={{
                      borderColor: active ? cfg.color : '#e5e7eb',
                      background: active ? cfg.bg : '#f9fafb',
                      color: active ? cfg.color : '#6b7280',
                      transform: active ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder='Describe brevemente este análisis...'
              rows={3}
              className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none resize-none'
              style={{
                borderColor: '#e5e7eb',
                background: '#f9fafb',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition text-sm'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='flex-1 py-2.5 rounded-xl text-white font-semibold transition text-sm flex items-center justify-center gap-2'
              style={{ background: '#ff5722' }}
            >
              {loading ? <Spinner small /> : isEdit ? 'Guardar cambios' : 'Crear Análisis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
