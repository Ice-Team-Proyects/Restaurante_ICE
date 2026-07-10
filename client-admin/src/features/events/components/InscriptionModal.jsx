import { useEffect, useState } from 'react';
import { useEventsStore } from '../store/eventsStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

const STATUS_OPTIONS = ['pendiente', 'confirmada', 'cancelada'];

const STATUS_CONFIG = {
  pendiente: { bg: '#fef9c3', border: '#fde047', color: '#a16207' },
  confirmada: { bg: '#dcfce7', border: '#86efac', color: '#15803d' },
  cancelada: { bg: '#fee2e2', border: '#fca5a5', color: '#b91c1c' },
};

export const InscriptionModal = ({ isOpen, onClose }) => {
  const { addInscription, loadingInscriptions: loading, events } = useEventsStore();

  const [form, setForm] = useState({
    name_customer: '',
    email_customer: '',
    phone_customer: '',
    id_event: '',
    number_people: '',
    total_price: '',
    status: 'pendiente',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({
        name_customer: '',
        email_customer: '',
        phone_customer: '',
        id_event: '',
        number_people: '',
        total_price: '',
        status: 'pendiente',
      });
      setErrors({});
    }
  }, [isOpen]);

  const activeEvents = events.filter((e) => e.isActive !== false);

  const validate = () => {
    const errs = {};
    if (!form.name_customer.trim()) errs.name_customer = 'El nombre es requerido';
    if (!form.email_customer.trim()) errs.email_customer = 'El email es requerido';
    if (!form.phone_customer.trim()) errs.phone_customer = 'El teléfono es requerido';
    if (!form.id_event) errs.id_event = 'Selecciona un evento';
    if (!form.number_people || isNaN(form.number_people) || Number(form.number_people) < 1)
      errs.number_people = 'Debe ser al menos 1 persona';
    if (form.total_price === '' || isNaN(form.total_price) || Number(form.total_price) < 0)
      errs.total_price = 'El precio debe ser 0 o mayor';
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
      number_people: Number(form.number_people),
      total_price: Number(form.total_price),
    };

    const result = await addInscription(payload);

    if (result.success) {
      showSuccess('Inscripción creada correctamente');
      onClose();
    } else {
      showError(result.error || 'Error al crear la inscripción');
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
                  d='M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            <div>
              <h2 className='text-xl font-bold'>
                Nueva Inscripción
              </h2>
              <p className='text-orange-100 text-xs'>Inscribe un cliente a un evento</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4 max-h-[65vh] overflow-y-auto'>
          {/* Nombre */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
              Nombre del cliente <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={form.name_customer}
              onChange={(e) => setForm({ ...form, name_customer: e.target.value })}
              placeholder='Ej. María López'
              className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
              style={inputStyle('name_customer')}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.name_customer ? '#ef4444' : '#e5e7eb')
              }
            />
            {errors.name_customer && (
              <p className='text-red-500 text-xs mt-1'>{errors.name_customer}</p>
            )}
          </div>

          {/* Email y Teléfono */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Email <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                value={form.email_customer}
                onChange={(e) => setForm({ ...form, email_customer: e.target.value })}
                placeholder='correo@email.com'
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('email_customer')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.email_customer ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.email_customer && (
                <p className='text-red-500 text-xs mt-1'>{errors.email_customer}</p>
              )}
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Teléfono <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={form.phone_customer}
                onChange={(e) => setForm({ ...form, phone_customer: e.target.value })}
                placeholder='55512345'
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('phone_customer')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.phone_customer ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.phone_customer && (
                <p className='text-red-500 text-xs mt-1'>{errors.phone_customer}</p>
              )}
            </div>
          </div>

          {/* Evento */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
              Evento <span className='text-red-500'>*</span>
            </label>
            <select
              value={form.id_event}
              onChange={(e) => setForm({ ...form, id_event: e.target.value })}
              className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
              style={inputStyle('id_event')}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) => (e.target.style.borderColor = errors.id_event ? '#ef4444' : '#e5e7eb')}
            >
              <option value=''>Selecciona un evento</option>
              {activeEvents.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.name_event}
                </option>
              ))}
            </select>
            {errors.id_event && <p className='text-red-500 text-xs mt-1'>{errors.id_event}</p>}
          </div>

          {/* Personas y Precio */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                N° Personas <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={form.number_people}
                onChange={(e) => setForm({ ...form, number_people: e.target.value })}
                placeholder='Ej. 4'
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('number_people')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.number_people ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.number_people && (
                <p className='text-red-500 text-xs mt-1'>{errors.number_people}</p>
              )}
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1.5'>
                Precio total <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={form.total_price}
                onChange={(e) => setForm({ ...form, total_price: e.target.value })}
                placeholder='Ej. 480'
                className='w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none'
                style={inputStyle('total_price')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.total_price ? '#ef4444' : '#e5e7eb')
                }
              />
              {errors.total_price && (
                <p className='text-red-500 text-xs mt-1'>{errors.total_price}</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Estado <span className='text-red-500'>*</span>
            </label>
            <div className='grid grid-cols-3 gap-2'>
              {STATUS_OPTIONS.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const active = form.status === s;
                return (
                  <button
                    key={s}
                    type='button'
                    onClick={() => setForm({ ...form, status: s })}
                    className='py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all text-center capitalize'
                    style={{
                      borderColor: active ? cfg.color : '#e5e7eb',
                      background: active ? cfg.bg : '#f9fafb',
                      color: active ? cfg.color : '#6b7280',
                      transform: active ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
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
              {loading ? <Spinner small /> : 'Crear Inscripción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
