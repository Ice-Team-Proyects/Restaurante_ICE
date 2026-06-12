import { useState, useEffect } from "react";
import axiosInstance from "../../../shared/api/axios";
import { useAuthStore } from "../../auth/store/authStore";
import { Spinner } from "../../auth/components/Spinner";
import { showSuccess, showError } from "../../../shared/utils/toast";

const ReservationsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);
  const [success, setSuccess] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({
    name_customer: "",
    number_people: "",
    time_reservation: "",
    restaurant: "",
    table: "",
  });

  // Cargar sucursales (Restaurantes) al montar
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingRestaurants(true);
      axiosInstance
        .get("/restaurant")
        .then((res) => {
          const allRestaurants = res.data?.data || res.data || [];
          setRestaurants(allRestaurants.filter((r) => r.isActive !== false));
          setLoadingRestaurants(false);
        })
        .catch((err) => {
          console.error("Error al cargar sucursales:", err);
          setLoadingRestaurants(false);
        });
    }
  }, [isAuthenticated]);

  // Cargar mesas cuando cambie la sucursal seleccionada
  useEffect(() => {
    if (form.restaurant) {
      setLoadingTables(true);
      setForm((prev) => ({ ...prev, table: "" })); // reset selected table
      axiosInstance
        .get(`/table?limit=100&restaurant=${form.restaurant}`)
        .then((res) => {
          const allTables = res.data?.data || [];
          // Filtrar mesas activas y disponibles
          setTables(
            allTables.filter((t) => t.isActive !== false && t.status === "disponible"),
          );
          setLoadingTables(false);
        })
        .catch((err) => {
          console.error("Error al cargar mesas:", err);
          setLoadingTables(false);
        });
    } else {
      setTables([]);
    }
  }, [form.restaurant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name_customer.trim() ||
      !form.number_people ||
      !form.time_reservation ||
      !form.restaurant ||
      !form.table
    ) {
      return showError("Completa todos los campos");
    }
    setLoading(true);
    try {
      await axiosInstance.post("/reservation", {
        name_customer: form.name_customer,
        number_people: Number(form.number_people),
        time_reservation: new Date(form.time_reservation).toISOString(),
        table: form.table,
        restaurant: form.restaurant,
      });
      showSuccess("Reservación creada exitosamente");
      setSuccess(true);
      setForm({ name_customer: "", number_people: "", time_reservation: "", restaurant: "", table: "" });
    } catch (err) {
      showError(err.response?.data?.message || "Error al crear reservación");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border-2 border-orange-200 text-gray-800 text-sm focus:outline-none focus:border-red-500 bg-white";

  return (
    <div className="animate-fadeIn max-w-lg mx-auto">
      <h1
        className="text-3xl font-black text-gray-800 mb-2 text-center"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        📅 Reservar Mesa
      </h1>
      <p className="text-gray-500 text-sm mb-8 text-center">
        Reserva tu lugar en nuestro restaurante
      </p>

      {!isAuthenticated ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-orange-100">
          <span className="text-5xl block mb-4">🔒</span>
          <p className="text-gray-600 font-semibold">
            Inicia sesión para hacer una reservación
          </p>
        </div>
      ) : success ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-green-200">
          <span className="text-5xl block mb-4">✅</span>
          <h3 className="text-xl font-bold text-green-700">
            ¡Reservación confirmada!
          </h3>
          <p className="text-gray-500 mt-2">Te esperamos pronto</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 px-6 py-2 rounded-xl text-sm font-bold text-white"
            style={{
              background: "linear-gradient(to right, #dc2626, #ea580c)",
            }}
          >
            Nueva Reservación
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-8 space-y-5 border border-orange-100"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nombre completo
            </label>
            <input
              type="text"
              value={form.name_customer}
              onChange={(e) =>
                setForm({ ...form, name_customer: e.target.value })
              }
              placeholder="Ej. Carlos Gómez"
              className={inputClass}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Número de personas
              </label>
              <input
                type="number"
                value={form.number_people}
                onChange={(e) =>
                  setForm({ ...form, number_people: e.target.value })
                }
                placeholder="Ej. 4"
                min="1"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Fecha y Hora
              </label>
              <input
                type="datetime-local"
                value={form.time_reservation}
                onChange={(e) =>
                  setForm({ ...form, time_reservation: e.target.value })
                }
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Sucursal / Local
            </label>
            {loadingRestaurants ? (
              <div className="text-gray-400 text-xs py-2 flex items-center gap-2">
                <Spinner small /> Cargando sucursales...
              </div>
            ) : (
              <select
                value={form.restaurant}
                onChange={(e) => setForm({ ...form, restaurant: e.target.value })}
                className={inputClass}
                required
              >
                <option value="">Seleccionar sucursal...</option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} — {r.address}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Mesa
            </label>
            {loadingTables ? (
              <div className="text-gray-400 text-xs py-2 flex items-center gap-2">
                <Spinner small /> Cargando mesas disponibles en esta sucursal...
              </div>
            ) : !form.restaurant ? (
              <select className={inputClass} disabled>
                <option value="">Primero selecciona una sucursal...</option>
              </select>
            ) : (
              <select
                value={form.table}
                onChange={(e) => setForm({ ...form, table: e.target.value })}
                className={inputClass}
                required
              >
                <option value="">Seleccionar mesa...</option>
                {tables.map((t) => (
                  <option key={t._id} value={t._id}>
                    Mesa {t.number} — Capacidad: {t.capacity} personas
                  </option>
                ))}
              </select>
            )}
            {form.restaurant && tables.length === 0 && !loadingTables && (
              <span className="text-yellow-600 text-xs mt-1 block">
                No hay mesas disponibles en esta sucursal en este momento
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(to right, #dc2626, #ea580c)",
            }}
          >
            {loading ? <Spinner small /> : "Confirmar Reservación"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReservationsPage;
