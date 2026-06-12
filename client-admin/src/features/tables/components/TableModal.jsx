import { useEffect, useState } from 'react';
import { useTablesStore } from '../store/tablesStore.js';
import { useRestaurantStore } from '../../restaurants/store/restaurantStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

const STATUS_OPTIONS = [
  { value: 'disponible', label: 'Disponible', color: '#15803d' },
  { value: 'ocupada', label: 'Ocupada', color: '#ea580c' },
  { value: 'reservada', label: 'Reservada', color: '#1d4ed8' },
];

export const TableModal = ({ isOpen, onClose, table }) => {
  const { addTable, editTable, loading } = useTablesStore();
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  const isEdit = Boolean(table);

  const [form, setForm] = useState({ number: '', capacity: '', status: 'disponible', restaurant: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchRestaurants();
      if (table) {
        setForm({
          number: table.number,
          capacity: table.capacity,
          status: table.status,
          restaurant: table.restaurant?._id || table.restaurant || '',
        });
      } else {
        setForm({ number: '', capacity: '', status: 'disponible', restaurant: '' });
      }
      setErrors({});
    }
  }, [isOpen, table, fetchRestaurants]);

  const validate = () => {
    const errs = {};
    if (!form.number || isNaN(form.number) || Number(form.number) < 1) {
      errs.number = 'Número de mesa debe ser mayor a 0';
    }
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1) {
      errs.capacity = 'Capacidad debe ser mayor a 0';
    }
    if (!form.restaurant) {
      errs.restaurant = 'Debes seleccionar una sucursal';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      number: Number(form.number),
      capacity: Number(form.capacity),
      status: form.status,
      restaurant: form.restaurant,
    };

    const result = isEdit
      ? await editTable(table._id, payload)
      : await addTable(payload);

    if (result.success) {
      showSuccess(isEdit ? 'Mesa actualizada correctamente' : 'Mesa creada correctamente');
      onClose();
    } else {
      showError(result.error || 'Error al guardar la mesa');
    }
  };

  const activeRestaurants = Array.isArray(restaurants)
    ? restaurants.filter((r) => r.isActive !== false)
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn"
        style={{ border: '1px solid #e5e7eb' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 text-white"
          style={{ background: 'linear-gradient(to right, #ea580c, #dc2626)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="3" rx="1.5" stroke="white" strokeWidth="2"/>
                <path d="M5 10v7M19 10v7M9 17h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                {isEdit ? 'Editar Mesa' : 'Nueva Mesa'}
              </h2>
              <p className="text-orange-100 text-xs">
                {isEdit ? `Actualizando Mesa #${table.number}` : 'Agrega una nueva mesa al restaurante'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Sucursal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Sucursal / Local <span className="text-red-500">*</span>
            </label>
            <select
              value={form.restaurant}
              onChange={(e) => setForm({ ...form, restaurant: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none"
              style={{
                borderColor: errors.restaurant ? '#ef4444' : '#e5e7eb',
                background: '#f9fafb',
              }}
            >
              <option value="">Seleccionar sucursal...</option>
              {activeRestaurants.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.restaurant && (
              <p className="text-red-500 text-xs mt-1">{errors.restaurant}</p>
            )}
          </div>

          {/* Número */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Número de Mesa <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="Ej. 5"
              className="w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none"
              style={{
                borderColor: errors.number ? '#ef4444' : '#e5e7eb',
                background: '#f9fafb',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) => (e.target.style.borderColor = errors.number ? '#ef4444' : '#e5e7eb')}
            />
            {errors.number && (
              <p className="text-red-500 text-xs mt-1">{errors.number}</p>
            )}
          </div>

          {/* Capacidad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Capacidad (personas) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              placeholder="Ej. 4"
              className="w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none"
              style={{
                borderColor: errors.capacity ? '#ef4444' : '#e5e7eb',
                background: '#f9fafb',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) => (e.target.style.borderColor = errors.capacity ? '#ef4444' : '#e5e7eb')}
            />
            {errors.capacity && (
              <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, status: opt.value })}
                  className="py-2.5 px-2 rounded-xl border-2 text-xs font-semibold transition-all"
                  style={{
                    borderColor: form.status === opt.value ? opt.color : '#e5e7eb',
                    background: form.status === opt.value ? `${opt.color}15` : '#f9fafb',
                    color: form.status === opt.value ? opt.color : '#6b7280',
                    transform: form.status === opt.value ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-white font-semibold transition text-sm flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(to right, #ea580c, #dc2626)' }}
            >
              {loading ? <Spinner small /> : (isEdit ? 'Guardar cambios' : 'Crear Mesa')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
