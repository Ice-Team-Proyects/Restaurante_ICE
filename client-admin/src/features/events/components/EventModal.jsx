import { useEffect, useState } from 'react';
import { useEventsStore } from '../store/eventsStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const EventModal = ({ isOpen, onClose, event }) => {
  const { addEvent, loadingEvents: loading } = useEventsStore();
  const isEdit = Boolean(event);

  const [form, setForm] = useState({
    name_event: '',
    description: '',
    date_event: '',
    capacity: '',
    location: '',
    price: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setForm({
          name_event: event.name_event,
          description: event.description,
          date_event: event.date_event ? event.date_event.slice(0, 10) : '',
          capacity: event.capacity,
          location: event.location,
          price: event.price,
        });
      } else {
        setForm({
          name_event: '',
          description: '',
          date_event: '',
          capacity: '',
          location: '',
          price: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, event]);

  const validate = () => {
    const errs = {};
    if (!form.name_event.trim() || form.name_event.trim().length < 2)
      errs.name_event = 'El nombre debe tener al menos 2 caracteres';
    if (!form.description.trim()) errs.description = 'La descripción es requerida';
    if (!form.date_event) errs.date_event = 'La fecha es requerida';
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1)
      errs.capacity = 'La capacidad debe ser al menos 1';
    if (!form.location.trim()) errs.location = 'La ubicación es requerida';
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 0)
      errs.price = 'El precio debe ser 0 o mayor';
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
      capacity: Number(form.capacity),
      price: Number(form.price),
    };

    const result = await addEvent(payload);

    if (result.success) {
      showSuccess(isEdit ? 'Evento actualizado correctamente' : 'Evento creado correctamente');
      onClose();
    } else {
      showError(result.error || 'Error al guardar el evento');
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
        className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn'
        style={{ border: '1px solid #e5e7eb' }}
      >
        {/* Header */}
        <div
          className='px-6 py-5 text-white'
          style={{ background: 'linear-gradient(to right, #ea580c, #dc2626)' }}
        >
          <div className='flex items-center gap-3'>
            <div
              className='w-10 h-10 rounded-xl flex items-center justify-center'
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <div>
              <h2 className='text-xl font-bold' style={{ fontFamily: "'Playfair Display', serif" }}>
                {isEdit ? 'Editar Evento' : 'Nuevo Evento'}
              </h2>
              <p className='text-orange-100 text-xs'>
                {isEdit
                  ? `Actualizando: ${event.name_event}`
                  : 'Agrega un nuevo evento al restaurante'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4 max-h-[65vh] overflow-y-auto'>
          {/* Nombre */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
              Nombre del evento <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={form.name_event}
              onChange={(e) => setForm({ ...form, name_event: e.target.value })}
              placeholder='Ej. Noche Italiana'
              className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
              style={inputStyle('name_event')}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.name_event ? '#ef4444' : '#e5e7eb')
              }
            />
            {errors.name_event && <p className='text-red-500 text-xs mt-1'>{errors.name_event}</p>}
          </div>

          {/* Fecha y Capacidad */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Fecha <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                value={form.date_event}
                onChange={(e) => setForm({ ...form, date_event: e.target.value })}
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('date_event')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.date_event ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.date_event && (
                <p className='text-red-500 text-xs mt-1'>{errors.date_event}</p>
              )}
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Capacidad <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                placeholder='Ej. 50'
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('capacity')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.capacity ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.capacity && <p className='text-red-500 text-xs mt-1'>{errors.capacity}</p>}
            </div>
          </div>

          {/* Ubicación y Precio */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Ubicación <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder='Ej. Salón Principal'
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('location')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.location ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.location && <p className='text-red-500 text-xs mt-1'>{errors.location}</p>}
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Precio <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder='Ej. 120'
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('price')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) => (e.target.style.borderColor = errors.price ? '#ef4444' : '#e5e7eb')}
              />
              {errors.price && <p className='text-red-500 text-xs mt-1'>{errors.price}</p>}
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
              placeholder='Describe el evento...'
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

          {/* Botones */}
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
              style={{ background: 'linear-gradient(to right, #ea580c, #dc2626)' }}
            >
              {loading ? <Spinner small /> : isEdit ? 'Guardar cambios' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
