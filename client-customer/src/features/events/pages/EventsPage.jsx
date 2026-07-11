import { useEffect, useState } from "react";
import { PartyPopper, CalendarDays, Users, MapPin } from "lucide-react";
import axiosInstance from "../../../shared/api/axios";
import { useAuthStore } from "../../auth/store/authStore";
import { Spinner } from "../../auth/components/Spinner";
import { showSuccess, showError } from "../../../shared/utils/toast";
import PageHeader from "../../../shared/components/ui/PageHeader";
import ServiceCard from "../../../shared/components/ui/ServiceCard";

const EventsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inscribing, setInscribing] = useState(null);
  const [form, setForm] = useState({ name_customer: "", email_customer: "", phone_customer: "", number_people: "", total_price: "" });

  useEffect(() => {
    axiosInstance.get("/event/events")
      .then((res) => { setEvents((res.data.data || []).filter((e) => e.isActive !== false)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleInscribe = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/event/inscriptions", { ...form, id_event: inscribing, number_people: Number(form.number_people), total_price: Number(form.total_price), status: "pendiente" });
      showSuccess("¡Inscripción exitosa!");
      setInscribing(null);
      setForm({ name_customer: "", email_customer: "", phone_customer: "", number_people: "", total_price: "" });
    } catch (err) { showError(err.response?.data?.message || "Error al inscribirse"); }
  };

  if (loading) return <Spinner />;

  const inputClass = "w-full px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-main-orange bg-bg-light";

  return (
    <div className="animate-fadeIn">
      <PageHeader icon={PartyPopper} title="Eventos" subtitle="Próximos eventos especiales en nuestro restaurante" />
      {events.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No hay eventos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev) => (
            <ServiceCard key={ev._id}>
              <h3 className="text-base font-semibold text-gray-800 mb-3">{ev.name_event}</h3>
              <div className="space-y-1.5 text-xs text-gray-500 mb-3">
                <p className="flex items-center gap-2"><CalendarDays size={13} className="text-main-orange shrink-0" />{new Date(ev.date_event).toLocaleDateString("es-GT")}</p>
                <p className="flex items-center gap-2"><Users size={13} className="text-main-orange shrink-0" />{ev.capacity} personas</p>
                <p className="flex items-center gap-2"><MapPin size={13} className="text-main-orange shrink-0" />{ev.location}</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400 line-clamp-2 flex-1 pr-2">{ev.description}</p>
                <span className="text-lg font-semibold shrink-0" style={{ color: "#dc2626" }}>Q{ev.price}</span>
              </div>
              {isAuthenticated && inscribing !== ev._id && (
                <button onClick={() => setInscribing(ev._id)} className="w-full py-2 rounded-full text-white text-xs font-semibold transition hover:opacity-90" style={{ background: "#ea580c" }}>
                  Inscribirse
                </button>
              )}
              {inscribing === ev._id && (
                <form onSubmit={handleInscribe} className="mt-3 space-y-2 pt-3 border-t border-gray-100">
                  <input type="text" placeholder="Tu nombre" value={form.name_customer} onChange={(e) => setForm({ ...form, name_customer: e.target.value })} className={inputClass} required />
                  <input type="email" placeholder="Tu email" value={form.email_customer} onChange={(e) => setForm({ ...form, email_customer: e.target.value })} className={inputClass} required />
                  <input type="text" placeholder="Tu teléfono" value={form.phone_customer} onChange={(e) => setForm({ ...form, phone_customer: e.target.value })} className={inputClass} required />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Personas" value={form.number_people} min="1" onChange={(e) => setForm({ ...form, number_people: e.target.value })} className={inputClass} required />
                    <input type="number" placeholder="Precio total" value={form.total_price} min="0" onChange={(e) => setForm({ ...form, total_price: e.target.value })} className={inputClass} required />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setInscribing(null)} className="flex-1 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">Cancelar</button>
                    <button type="submit" className="flex-1 py-2 rounded-full text-white text-xs font-semibold transition hover:opacity-90" style={{ background: "#ea580c" }}>Confirmar</button>
                  </div>
                </form>
              )}
            </ServiceCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
