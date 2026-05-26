import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "../components/Spinner";
import { showSuccess, showError } from "../../../shared/utils/toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isRegister) {
      const result = await register(form);
      setLoading(false);
      if (result.success) {
        showSuccess(result.message || "Registrado. Verifica tu email.");
        setIsRegister(false);
      } else {
        showError(result.error);
      }
    } else {
      const result = await login({
        email: form.email,
        password: form.password,
      });
      setLoading(false);
      if (result.success) {
        showSuccess("Bienvenido");
        navigate("/");
      } else {
        showError(result.error);
      }
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border-2 border-orange-200 text-gray-800 text-sm focus:outline-none focus:border-red-500 bg-white/80";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #ea580c 100%)",
      }}
    >
      <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div
          className="text-center py-8 px-6"
          style={{
            background:
              "linear-gradient(to bottom, rgba(127,29,29,0.1), transparent)",
          }}
        >
          <span className="text-6xl block mb-3">🐉</span>
          <h1
            className="text-3xl font-black text-gray-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Restaurante ICE
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sabores auténticos de Oriente
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  required
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={form.surname}
                  onChange={(e) =>
                    setForm({ ...form, surname: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                placeholder="Usuario"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className={inputClass}
                required
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputClass}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(to right, #7f1d1d, #dc2626)",
            }}
          >
            {loading ? (
              <Spinner small />
            ) : isRegister ? (
              "Registrarse"
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-red-600 font-bold hover:underline"
            >
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
