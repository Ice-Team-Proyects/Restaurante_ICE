import { useEffect, useState } from "react";
import axiosInstance from "../../../shared/api/axios";
import { useAuthStore } from "../../auth/store/authStore";
import { Spinner } from "../../auth/components/Spinner";
import { showSuccess, showError } from "../../../shared/utils/toast";

const EventsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inscribing, setInscribing] = useState(null);
  const [form, setForm] = useState({
    name_customer: "",
    email_customer: "",
    phone_customer: "",
    number_people: "",
    total_price: "",
  });

  useEffect(() => {
    axiosInstance
      .get("/event/events")
      .then((res) => {
        setEvents((res.data.data || []).filter((e) => e.isActive !== false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInscribe = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/event/inscriptions", {
        ...form,
        id_event: inscribing,
        number_people: Number(form.number_people),
        total_price: Number(form.total_price),
        status: "pendiente",
      });
      showSuccess("¡Inscripción exitosa!");
      setInscribing(null);
      setForm({
        name_customer: "",
        email_customer: "",
        phone_customer: "",
        number_people: "",
        total_price: "",
      });
    } catch (err) {
      showError(err.response?.data?.message || "Error al inscribirse");
    }
  };

  if (loading) return <Spinner />;

  const inputClass =
    "w-full px-3 py-2 rounded-xl border border-orange-200 text-sm focus:outline-none focus:border-red-500 bg-white";

  return (
    <div className="animate-fadeIn">
      <h1
        className="text-3xl font-black text-gray-800 mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        🎉 Eventos
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Próximos eventos especiales en nuestro restaurante
      </p>
      {events.length === 0 ? (
        <p className="text-center text-gray-400 py-20">
          No hay eventos disponibles
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-orange-100"
            >
              <div
                className="h-2"
                style={{
                  background: "linear-gradient(to right, #dc2626, #ea580c)",
                }}
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800">
                  {ev.name_event}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                    style={{ background: "#dbeafe", color: "#1d4ed8" }}
                  >
                    📅 {new Date(ev.date_event).toLocaleDateString("es-GT")}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                    style={{ background: "#dcfce7", color: "#15803d" }}
                  >
                    👥 {ev.capacity}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                    style={{ background: "#ffedd5", color: "#c2410c" }}
                  >
                    Q{ev.price}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">📍 {ev.location}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {ev.description}
                </p>

                {isAuthenticated && inscribing !== ev._id && (
                  <button
                    onClick={() => setInscribing(ev._id)}
                    className="mt-3 w-full py-2 rounded-xl text-white text-xs font-bold"
                    style={{
                      background: "linear-gradient(to right, #dc2626, #ea580c)",
                    }}
                  >
                    Inscribirse
                  </button>
                )}

                {inscribing === ev._id && (
                  <form
                    onSubmit={handleInscribe}
                    className="mt-3 space-y-2 pt-3 border-t border-orange-100"
                  >
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={form.name_customer}
                      onChange={(e) =>
                        setForm({ ...form, name_customer: e.target.value })
                      }
                      className={inputClass}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Tu email"
                      value={form.email_customer}
                      onChange={(e) =>
                        setForm({ ...form, email_customer: e.target.value })
                      }
                      className={inputClass}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Tu teléfono"
                      value={form.phone_customer}
                      onChange={(e) =>
                        setForm({ ...form, phone_customer: e.target.value })
                      }
                      className={inputClass}
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Personas"
                        value={form.number_people}
                        onChange={(e) =>
                          setForm({ ...form, number_people: e.target.value })
                        }
                        className={inputClass}
                        required
                        min="1"
                      />
                      <input
                        type="number"
                        placeholder="Precio total"
                        value={form.total_price}
                        onChange={(e) =>
                          setForm({ ...form, total_price: e.target.value })
                        }
                        className={inputClass}
                        required
                        min="0"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setInscribing(null)}
                        className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl text-white text-xs font-bold"
                        style={{
                          background:
                            "linear-gradient(to right, #dc2626, #ea580c)",
                        }}
                      >
                        Confirmar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
