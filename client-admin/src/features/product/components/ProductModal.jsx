import { useEffect, useState } from 'react';
import { useProductsStore } from '../store/productsStore.js';
import { useCategoryStore } from '../../category/store/categoryStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const ProductModal = ({ isOpen, onClose, product }) => {
  const { addProduct, editProduct, loading } = useProductsStore();
  const { categories, fetchCategories } = useCategoryStore();
  const isEdit = Boolean(product);

  const [form, setForm] = useState({ saucer: '', description: '', price: '', category: '' });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Load categories if not yet loaded
  useEffect(() => {
    if (isOpen && categories.length === 0) fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setForm({
          saucer: product.saucer,
          description: product.description,
          price: product.price,
          category: product.category?._id || product.category || '',
        });
        setPreview(null);
        setImageFile(null);
      } else {
        setForm({ saucer: '', description: '', price: '', category: '' });
        setPreview(null);
        setImageFile(null);
      }
      setErrors({});
    }
  }, [isOpen, product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.saucer.trim() || form.saucer.trim().length < 2)
      errs.saucer = 'El nombre debe tener al menos 2 caracteres';
    if (!form.description.trim())
      errs.description = 'La descripción es requerida';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errs.price = 'El precio debe ser mayor a 0';
    if (!form.category)
      errs.category = 'Debes seleccionar una categoría';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const formData = new FormData();
    formData.append('saucer', form.saucer);
    formData.append('description', form.description);
    formData.append('price', Number(form.price));
    formData.append('category', form.category);
    if (imageFile) formData.append('image', imageFile);

    const result = isEdit
      ? await editProduct(product._id, formData)
      : await addProduct(formData);

    if (result.success) {
      showSuccess(isEdit ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      onClose();
    } else {
      showError(result.error || 'Error al guardar el producto');
    }
  };

  const activeCategories = categories.filter((c) => c.isActive !== false);

  const inputStyle = (field) => ({
    borderColor: errors[field] ? '#ef4444' : '#e5e7eb',
    background: '#f9fafb',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div
        className="bg-white rounded-2xl  w-full max-w-lg overflow-hidden animate-scaleIn"
        style={{ border: '1px solid #e5e7eb', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 text-white sticky top-0 z-10"
          style={{ background: '#ff5722' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 3h18M3 8h18M3 13h12M3 18h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <p className="text-orange-100 text-xs">
                {isEdit ? `Actualizando: ${product.saucer}` : 'Agrega un nuevo platillo o bebida'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nombre del platillo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nombre del Platillo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.saucer}
              onChange={(e) => setForm({ ...form, saucer: e.target.value })}
              placeholder="Ej. Pizza Pepperoni"
              className="w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none"
              style={inputStyle('saucer')}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) => (e.target.style.borderColor = errors.saucer ? '#ef4444' : '#e5e7eb')}
            />
            {errors.saucer && <p className="text-red-500 text-xs mt-1">{errors.saucer}</p>}
          </div>

          {/* Precio + Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Precio (Q) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Ej. 60.00"
                className="w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none"
                style={inputStyle('price')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) => (e.target.style.borderColor = errors.price ? '#ef4444' : '#e5e7eb')}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none"
                style={inputStyle('category')}
                onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
                onBlur={(e) => (e.target.style.borderColor = errors.category ? '#ef4444' : '#e5e7eb')}
              >
                <option value="">Seleccionar...</option>
                {activeCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe el producto, ingredientes, etc."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border-2 text-gray-800 text-sm transition focus:outline-none resize-none"
              style={inputStyle('description')}
              onFocus={(e) => (e.target.style.borderColor = '#ea580c')}
              onBlur={(e) => (e.target.style.borderColor = errors.description ? '#ef4444' : '#e5e7eb')}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Imagen del Producto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            {preview && (
              <img
                src={preview}
                alt="Previsualización"
                className="mt-3 w-full h-36 object-cover rounded-xl border border-gray-200"
              />
            )}
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
              style={{ background: '#ff5722' }}
            >
              {loading ? <Spinner small /> : (isEdit ? 'Guardar cambios' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};