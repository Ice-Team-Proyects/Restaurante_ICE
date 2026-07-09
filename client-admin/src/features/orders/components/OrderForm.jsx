import { useEffect, useState } from 'react';
import { useOrderStore } from '../store/orderStore';
import { useTableStore } from '../../tables/store/tableStore';
import { useProductStore } from '../../product/store/productStore';
import toast from 'react-hot-toast';

const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PREPARING', label: 'Preparando' },
  { value: 'READY', label: 'Listo' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
];

export const OrderForm = ({ order = null, onClose }) => {
  const [formData, setFormData] = useState({
    tableId: '',
    items: [{ productId: '', quantity: 1, price: 0 }],
    totalAmount: 0,
    status: 'PENDING',
  });

  const tables = useTableStore((s) => s.tables);
  const fetchTables = useTableStore((s) => s.fetchTables);
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const getProductById = useProductStore((s) => s.getProductById);
  const createOrder = useOrderStore((s) => s.createOrder);
  const updateOrder = useOrderStore((s) => s.updateOrder);

  useEffect(() => {
    fetchTables();
    fetchProducts();
  }, [fetchTables, fetchProducts]);

  useEffect(() => {
    if (order) {
      setFormData({
        tableId: order.tableId?._id || order.tableId,
        items: order.items || [{ productId: '', quantity: 1, price: 0 }],
        totalAmount: order.totalAmount || 0,
        status: order.status || 'PENDING',
      });
    }
  }, [order]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tableId' ? value : value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    
    if (field === 'productId') {
      // When selecting a product, auto-fill the price
      const selectedProduct = getProductById(value);
      newItems[index] = {
        ...newItems[index],
        productId: value,
        price: selectedProduct?.price || 0,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value,
      };
    }
    
    setFormData((prev) => ({
      ...prev,
      items: newItems,
      totalAmount: newItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      items: newItems,
      totalAmount: newItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tableId) {
      toast.error('Selecciona una mesa');
      return;
    }

    if (formData.items.length === 0 || formData.items.some((item) => !item.productId)) {
      toast.error('Agrega al menos un producto válido');
      return;
    }

    if (formData.totalAmount <= 0) {
      toast.error('El total debe ser mayor a 0');
      return;
    }

    try {
      if (order) {
        await updateOrder(order._id, formData);
        toast.success('Orden actualizada correctamente');
      } else {
        await createOrder(formData);
        toast.success('Orden creada correctamente');
      }
      onClose?.();
    } catch (err) {
      toast.error(err.message || 'Error al guardar la orden');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl  w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-main-orange to-orange-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">{order ? 'Editar Orden' : 'Nueva Orden'}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mesa */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mesa *
            </label>
            <select
              name="tableId"
              value={formData.tableId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-main-orange focus:border-transparent"
            >
              <option value="">Selecciona una mesa</option>
              {tables.map((table) => (
                <option key={table._id} value={table._id}>
                  Mesa {table.number} (Capacidad: {table.capacity})
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-main-orange focus:border-transparent"
            >
              {ORDER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-slate-700">
                Productos *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 transition"
              >
                + Agregar Producto
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 items-end bg-slate-50 p-3 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Producto</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-main-orange focus:border-transparent"
                    >
                      <option value="">Selecciona un producto</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.saucer} - ${product.price?.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Cantidad</label>
                    <input
                      type="number"
                      placeholder="1"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-20 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-main-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Precio Unit.</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className="w-24 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-main-orange"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-100 p-4 rounded-xl">
            <p className="text-lg font-semibold text-slate-800">
              Total: <span className="text-main-orange">${formData.totalAmount.toFixed(2)}</span>
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-main-orange to-orange-600 text-white rounded-xl font-semibold hover: transition"
            >
              {order ? 'Actualizar' : 'Crear'} Orden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
