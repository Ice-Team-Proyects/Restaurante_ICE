import { useEffect, useState } from 'react';
import { useEventsStore } from '../store/eventsStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const PromotionModal = ({ isOpen, onClose }) => {
  const { addPromotion, loadingPromotions: loading } = useEventsStore();

  const [form, setForm] = useState({
    name_promotion: '',
    description: '',
    discount_percentage: '',
    date_start: '',
    date_end: '',
    min_people: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({
        name_promotion: '',
        description: '',
        discount_percentage: '',
        date_start: '',
        date_end: '',
        min_people: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.name_promotion.trim()) errs.name_promotion = 'El nombre es requerido';
    if (!form.description.trim()) errs.description = 'La descripción es requerida';
    if (
      !form.discount_percentage ||
      isNaN(form.discount_percentage) ||
      Number(form.discount_percentage) < 1 ||
      Number(form.discount_percentage) > 100
    )
      errs.discount_percentage = 'Debe ser entre 1 y 100';
    if (!form.date_start) errs.date_start = 'La fecha de inicio es requerida';
    if (!form.date_end) errs.date_end = 'La fecha de fin es requerida';
    if (form.date_start && form.date_end && form.date_start > form.date_end)
      errs.date_end = 'La fecha fin debe ser posterior a la de inicio';
    if (!form.min_people || isNaN(form.min_people) || Number(form.min_people) < 1)
      errs.min_people = 'Debe ser al menos 1 persona';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const payload = {
      ...form,
      discount_percentage: Number(form.discount_percentage),
      min_people: Number(form.min_people),
    };

    const result = await addPromotion(payload);

    if (result.success) {
      showSuccess('Promoción creada correctamente');
      onClose();
    } else {
      showError(result.error || 'Error al crear la promoción');
    }
  };

  if (!isOpen) return null;

  const inputStyle = (field) => ({
    borderColor: errors[field] ? '#ef4444' : '#e5e7eb',
    background: '#f9fafb',
  });

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
                  d='M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <div>
              <h2 className='text-xl font-bold'>
                Nueva Promoción
              </h2>
              <p className='text-orange-100 text-xs'>Crea una promoción para eventos</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4 max-h-[65vh] overflow-y-auto'>
          {/* Nombre */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
              Nombre <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={form.name_promotion}
              onChange={(e) => setForm({ ...form, name_promotion: e.target.value })}
              placeholder='Ej. Descuento Familiar'
              className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
              style={inputStyle('name_promotion')}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.name_promotion ? '#ef4444' : '#e5e7eb')
              }
            />
            {errors.name_promotion && (
              <p className='text-red-500 text-xs mt-1'>{errors.name_promotion}</p>
            )}
          </div>

          {/* Descuento y Mín. personas */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Descuento (%) <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={form.discount_percentage}
                onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })}
                placeholder='Ej. 10'
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('discount_percentage')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.discount_percentage ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.discount_percentage && (
                <p className='text-red-500 text-xs mt-1'>{errors.discount_percentage}</p>
              )}
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Mín. personas <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={form.min_people}
                onChange={(e) => setForm({ ...form, min_people: e.target.value })}
                placeholder='Ej. 4'
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('min_people')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.min_people ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.min_people && (
                <p className='text-red-500 text-xs mt-1'>{errors.min_people}</p>
              )}
            </div>
          </div>

          {/* Fecha inicio y fin */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Fecha inicio <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                value={form.date_start}
                onChange={(e) => setForm({ ...form, date_start: e.target.value })}
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('date_start')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.date_start ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.date_start && (
                <p className='text-red-500 text-xs mt-1'>{errors.date_start}</p>
              )}
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Fecha fin <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                value={form.date_end}
                onChange={(e) => setForm({ ...form, date_end: e.target.value })}
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('date_end')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.date_end ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.date_end && <p className='text-red-500 text-xs mt-1'>{errors.date_end}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
              Descripción <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder='Describe la promoción...'
              rows={3}
              className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none resize-none'
              style={inputStyle('description')}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.description ? '#ef4444' : '#e5e7eb')
              }
            />
            {errors.description && (
              <p className='text-red-500 text-xs mt-1'>{errors.description}</p>
            )}
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
              {loading ? <Spinner small /> : 'Crear Promoción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
