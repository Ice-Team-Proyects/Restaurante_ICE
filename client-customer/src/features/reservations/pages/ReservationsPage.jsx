import { useState } from "react";
import axiosInstance from "../../../shared/api/axios";
import { useAuthStore } from "../../auth/store/authStore";
import { Spinner } from "../../auth/components/Spinner";
import { showSuccess, showError } from "../../../shared/utils/toast";

const ReservationsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name_customer: "", number_people: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name_customer.trim() || !form.number_people)
      return showError("Completa todos los campos");
    setLoading(true);
    try {
      await axiosInstance.post("/reservation", {
        name_customer: form.name_customer,
        number_people: Number(form.number_people),
      });
      showSuccess("Reservación creada exitosamente");
      setSuccess(true);
      setForm({ name_customer: "", number_people: "" });
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
