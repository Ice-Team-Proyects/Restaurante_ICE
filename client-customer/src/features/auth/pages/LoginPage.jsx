import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "../components/Spinner";
import { showSuccess, showError } from "../../../shared/utils/toast";

/* ── Panel izquierdo: idéntico en login y registro ── */
const LeftPanel = ({ isRegister }) => (
  <div
    className="hidden md:flex md:w-5/12 flex-col items-center justify-center gap-5 relative overflow-hidden px-8 py-10"
    style={{ background: "#7f1d1d" }}
  >
    {/* Patrón de nubes chinas SVG — fondo */}
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      viewBox="0 0 220 520"
      preserveAspectRatio="xMidYMid slice"
    >
      <g opacity=".13" fill="#fde0d0">
        <path d="M-10 40 Q5 18 28 28 Q38 8 62 22 Q72 34 52 44 Q62 56 42 56 Q18 62 6 50 Z"/>
        <path d="M90 10 Q105 -12 128 -2 Q138 -22 162 -8 Q172 4 152 14 Q162 26 142 26 Q118 32 106 20 Z"/>
        <path d="M155 60 Q170 38 193 48 Q203 28 227 42 Q237 54 217 64 Q227 76 207 76 Q183 82 171 70 Z"/>
        <path d="M-15 130 Q0 108 23 118 Q33 98 57 112 Q67 124 47 134 Q57 146 37 146 Q13 152 1 140 Z"/>
        <path d="M70 115 Q85 93 108 103 Q118 83 142 97 Q152 109 132 119 Q142 131 122 131 Q98 137 86 125 Z"/>
        <path d="M155 145 Q170 123 193 133 Q203 113 227 127 Q237 139 217 149 Q227 161 207 161 Q183 167 171 155 Z"/>
        <path d="M-10 230 Q5 208 28 218 Q38 198 62 212 Q72 224 52 234 Q62 246 42 246 Q18 252 6 240 Z"/>
        <path d="M90 215 Q105 193 128 203 Q138 183 162 197 Q172 209 152 219 Q162 231 142 231 Q118 237 106 225 Z"/>
        <path d="M160 240 Q175 218 198 228 Q208 208 232 222 Q242 234 222 244 Q232 256 212 256 Q188 262 176 250 Z"/>
        <path d="M-15 330 Q0 308 23 318 Q33 298 57 312 Q67 324 47 334 Q57 346 37 346 Q13 352 1 340 Z"/>
        <path d="M75 320 Q90 298 113 308 Q123 288 147 302 Q157 314 137 324 Q147 336 127 336 Q103 342 91 330 Z"/>
        <path d="M160 345 Q175 323 198 333 Q208 313 232 327 Q242 339 222 349 Q232 361 212 361 Q188 367 176 355 Z"/>
        <path d="M10 430 Q25 408 48 418 Q58 398 82 412 Q92 424 72 434 Q82 446 62 446 Q38 452 26 440 Z"/>
        <path d="M110 420 Q125 398 148 408 Q158 388 182 402 Q192 414 172 424 Q182 436 162 436 Q138 442 126 430 Z"/>
      </g>
      {/* olas decorativas */}
      <g opacity=".08" stroke="#fde0d0" strokeWidth="1" fill="none">
        <path d="M-20 180 Q20 168 55 180 Q90 192 125 180 Q160 168 195 180 Q230 192 260 180"/>
        <path d="M-20 190 Q20 178 55 190 Q90 202 125 190 Q160 178 195 190 Q230 202 260 190"/>
        <path d="M-20 380 Q20 368 55 380 Q90 392 125 380 Q160 368 195 380 Q230 392 260 380"/>
        <path d="M-20 390 Q20 378 55 390 Q90 402 125 390 Q160 378 195 390 Q230 402 260 390"/>
      </g>
    </svg>

    {/* Ilustración tazón ramen */}
    <div style={{ position: "relative" }}>
      <svg width="130" height="122" viewBox="0 0 110 106" fill="none">
        {/* vapor */}
        <path d="M36 22 Q33 14 36 9 Q39 4 36 0" stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".6"/>
        <path d="M55 20 Q52 12 55 7 Q58 2 55 0" stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".8"/>
        <path d="M74 22 Q71 14 74 9 Q77 4 74 0" stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".6"/>
        {/* tazón */}
        <ellipse cx="55" cy="48" rx="36" ry="11" fill="#ea580c"/>
        <path d="M19 48 Q15 82 55 87 Q95 82 91 48 Z" fill="#dc2626"/>
        <ellipse cx="55" cy="48" rx="36" ry="11" fill="none" stroke="#f97316" strokeWidth="1.5"/>
        {/* fideos */}
        <path d="M30 53 Q42 45 55 53 Q68 61 80 53" stroke="#fed7aa" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <path d="M32 61 Q44 54 57 61 Q68 67 78 61" stroke="#fed7aa" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        {/* cebollín */}
        <circle cx="46" cy="55" r="3.5" fill="#4ade80" opacity=".85"/>
        <circle cx="66" cy="57" r="3.5" fill="#4ade80" opacity=".85"/>
        {/* palillos */}
        <line x1="44" y1="32" x2="76" y2="66" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round"/>
        <line x1="51" y1="30" x2="83" y2="64" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round"/>
        {/* base */}
        <ellipse cx="55" cy="87" rx="22" ry="5.5" fill="#991b1b"/>
        <rect x="42" y="87" width="26" height="9" rx="4.5" fill="#991b1b"/>
        <ellipse cx="55" cy="96" rx="16" ry="4" fill="#7f1d1d"/>
      </svg>
    </div>

    {/* Texto */}
    <div style={{ position: "relative", textAlign: "center" }}>
      <p style={{ color: "#fff", fontWeight: 500, fontSize: "22px", margin: 0 }}>
        Restaurante ICE
      </p>
      <p style={{ color: "#fde0d0", fontSize: "13px", margin: "6px 0 0", opacity: .75 }}>
        {isRegister ? "Únete a nuestra familia" : "Sabores auténticos de Oriente"}
      </p>
    </div>

    {/* Ola decorativa inferior */}
    <svg width="120" height="14" viewBox="0 0 120 14" style={{ position: "relative", opacity: .35 }}>
      <path d="M0 7 Q15 0 30 7 Q45 14 60 7 Q75 0 90 7 Q105 14 120 7" stroke="#fde0d0" strokeWidth="1.5" fill="none"/>
    </svg>
  </div>
);

/* ── Componente principal ── */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  const [form, setForm] = useState({
    name: "", surname: "", username: "", email: "", password: "", phone: "",
  });

  /* ── Lógica original intacta ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isRegister) {
      if (form.password !== confirmPassword) {
        setConfirmError(true);
        setLoading(false);
        return;
      }
      setConfirmError(false);
      const result = await register(form);
      setLoading(false);
      if (result.success) {
        showSuccess(result.message || "Registrado. Verifica tu email.");
        setIsRegister(false);
      } else {
        showError(result.error);
      }
    } else {
      const result = await login({ email: form.email, password: form.password });
      setLoading(false);
      if (result.success) {
        showSuccess("Bienvenido");
        navigate("/");
      } else {
        showError(result.error);
      }
    }
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (field === "password") setConfirmError(false);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-800 bg-white";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#7c1d1d" }}
    >
      {/* ── Fondo mural: siluetas de comida asiática distribuidas ── */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradiente radial que aclara el centro donde va la card */}
          <radialGradient id="center-fade" cx="50%" cy="50%" r="55%">
            <stop offset="0%"   stopColor="#9a1c1c" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3d0a0a" stopOpacity="0" />
          </radialGradient>
          {/* Overlay oscuro en bordes */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="40%"  stopColor="transparent" />
            <stop offset="100%" stopColor="#1a0505" stopOpacity="0.7" />
          </radialGradient>
        </defs>

        {/* ── Tazón ramen grande — esquina inferior izquierda ── */}
        <g opacity=".22" transform="translate(60,520) scale(1.8)">
          <path d="M36 22 Q33 14 36 9 Q39 4 36 0" stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".6"/>
          <path d="M55 20 Q52 12 55 7 Q58 2 55 0"  stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".8"/>
          <path d="M74 22 Q71 14 74 9 Q77 4 74 0"  stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".6"/>
          <ellipse cx="55" cy="48" rx="36" ry="11" fill="#fde0d0"/>
          <path d="M19 48 Q15 82 55 87 Q95 82 91 48 Z" fill="#fde0d0"/>
          <path d="M30 53 Q42 45 55 53 Q68 61 80 53" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M32 61 Q44 54 57 61 Q68 67 78 61" stroke="#7f1d1d" strokeWidth="2"   strokeLinecap="round" fill="none"/>
          <line x1="64" y1="32" x2="88" y2="60" stroke="#fde0d0" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="71" y1="30" x2="95" y2="58" stroke="#fde0d0" strokeWidth="3.5" strokeLinecap="round"/>
        </g>

        {/* ── Tazón ramen mediano — esquina superior derecha ── */}
        <g opacity=".18" transform="translate(960,40) scale(1.4)">
          <path d="M55 20 Q52 12 55 7 Q58 2 55 0"  stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".7"/>
          <path d="M36 22 Q33 14 36 9 Q39 4 36 0" stroke="#fde0d0" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".5"/>
          <ellipse cx="55" cy="48" rx="36" ry="11" fill="#fde0d0"/>
          <path d="M19 48 Q15 82 55 87 Q95 82 91 48 Z" fill="#fde0d0"/>
          <path d="M30 53 Q42 45 55 53 Q68 61 80 53" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <line x1="64" y1="32" x2="88" y2="60" stroke="#fde0d0" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="71" y1="30" x2="95" y2="58" stroke="#fde0d0" strokeWidth="3.5" strokeLinecap="round"/>
        </g>

        {/* ── Dumplings — esquina superior izquierda ── */}
        <g opacity=".2" transform="translate(40,60) scale(1.6)">
          <ellipse cx="40" cy="28" rx="34" ry="20" fill="#fde0d0"/>
          <path d="M6 28 Q4 50 40 54 Q76 50 74 28 Z" fill="#fde0d0" opacity=".7"/>
          <path d="M10 27 Q25 16 40 27 Q55 38 70 27" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <ellipse cx="40" cy="28" rx="34" ry="20" fill="none" stroke="#7f1d1d" strokeWidth="1.5"/>
          <line x1="52" y1="10" x2="76" y2="2"  stroke="#fde0d0" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="58" y1="8"  x2="82" y2="0"  stroke="#fde0d0" strokeWidth="3.5" strokeLinecap="round"/>
        </g>

        {/* ── Dumplings pequeños — esquina inferior derecha ── */}
        <g opacity=".17" transform="translate(1050,620) scale(1.3)">
          <ellipse cx="40" cy="28" rx="34" ry="20" fill="#fde0d0"/>
          <path d="M6 28 Q4 50 40 54 Q76 50 74 28 Z" fill="#fde0d0" opacity=".7"/>
          <path d="M10 27 Q25 16 40 27 Q55 38 70 27" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <line x1="52" y1="10" x2="76" y2="2"  stroke="#fde0d0" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="58" y1="8"  x2="82" y2="0"  stroke="#fde0d0" strokeWidth="3.5" strokeLinecap="round"/>
        </g>

        {/* ── Bao (bollos) — lado izquierdo centro ── */}
        <g opacity=".17" transform="translate(20,350) scale(1.5)">
          <ellipse cx="32" cy="24" rx="30" ry="20" fill="#fde0d0"/>
          <path d="M2 24 Q3 44 32 47 Q61 44 62 24" fill="#fde0d0" opacity=".6"/>
          <path d="M8 20 Q20 13 32 20 Q44 27 56 20" stroke="#7f1d1d" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".7"/>
          <circle cx="32" cy="14" r="6" fill="#fde0d0" opacity=".9"/>
        </g>

        {/* ── Linterna grande — derecha centro-alto ── */}
        <g opacity=".2" transform="translate(1100,200)">
          <line x1="20" y1="0"  x2="20" y2="22" stroke="#fde0d0" strokeWidth="2" opacity=".6"/>
          <rect x="4"  y="22" width="32" height="52" rx="16" fill="#fde0d0"/>
          <rect x="9"  y="18" width="22" height="8"  rx="4"  fill="#fde0d0" opacity=".7"/>
          <rect x="9"  y="74" width="22" height="8"  rx="4"  fill="#fde0d0" opacity=".7"/>
          <line x1="20" y1="82" x2="15" y2="98" stroke="#fde0d0" strokeWidth="1.5" opacity=".5"/>
          <line x1="20" y1="82" x2="25" y2="98" stroke="#fde0d0" strokeWidth="1.5" opacity=".5"/>
        </g>

        {/* ── Linterna pequeña — izquierda arriba ── */}
        <g opacity=".18" transform="translate(140,20)">
          <line x1="14" y1="0"  x2="14" y2="16" stroke="#fde0d0" strokeWidth="1.5" opacity=".5"/>
          <rect x="2"  y="16" width="24" height="38" rx="12" fill="#fde0d0"/>
          <rect x="6"  y="13" width="16" height="6"  rx="3"  fill="#fde0d0" opacity=".6"/>
          <rect x="6"  y="54" width="16" height="6"  rx="3"  fill="#fde0d0" opacity=".6"/>
          <line x1="14" y1="60" x2="11" y2="72" stroke="#fde0d0" strokeWidth="1.2" opacity=".5"/>
          <line x1="14" y1="60" x2="17" y2="72" stroke="#fde0d0" strokeWidth="1.2" opacity=".5"/>
        </g>

        {/* ── Flores de cerezo — dispersas ── */}
        <g opacity=".15" fill="#fda4af">
          {/* Grupo superior derecho */}
          <circle cx="850" cy="80"  r="9"/><circle cx="865" cy="68"  r="9"/><circle cx="837" cy="68"  r="9"/>
          <circle cx="860" cy="94"  r="9"/><circle cx="840" cy="94"  r="9"/>
          <circle cx="852" cy="76"  r="4" fill="#fff" opacity=".5"/>
          {/* Rama */}
          <line x1="851" y1="80" x2="870" y2="110" stroke="#c084fc" strokeWidth="1.5" opacity=".4"/>
          <line x1="851" y1="80" x2="830" y2="108" stroke="#c084fc" strokeWidth="1.5" opacity=".4"/>
          {/* Grupo inferior izquierdo */}
          <circle cx="340" cy="680" r="7"/><circle cx="353" cy="670" r="7"/><circle cx="328" cy="670" r="7"/>
          <circle cx="349" cy="692" r="7"/><circle cx="332" cy="692" r="7"/>
          <circle cx="341" cy="677" r="3" fill="#fff" opacity=".5"/>
          {/* Grupo izquierda media */}
          <circle cx="95"  cy="480" r="6"/><circle cx="107" cy="471" r="6"/><circle cx="84"  cy="471" r="6"/>
          <circle cx="103" cy="490" r="6"/><circle cx="88"  cy="490" r="6"/>
        </g>

        {/* ── Patrón de ola base (muy sutil) ── */}
        <path d="M0 775 Q150 760 300 775 Q450 790 600 775 Q750 760 900 775 Q1050 790 1200 775"
          stroke="#fde0d0" strokeWidth="1.5" fill="none" opacity=".12"/>
        <path d="M0 785 Q150 770 300 785 Q450 800 600 785 Q750 770 900 785 Q1050 800 1200 785"
          stroke="#fde0d0" strokeWidth="1" fill="none" opacity=".08"/>

        {/* ── Caracteres chinos muy tenues en esquinas ── */}
        <text x="30"   y="780" fontSize="120" fontWeight="bold" fill="#fde0d0" opacity=".04" fontFamily="serif">食</text>
        <text x="980"  y="760" fontSize="100" fontWeight="bold" fill="#fde0d0" opacity=".04" fontFamily="serif">味</text>
        <text x="500"  y="120" fontSize="90"  fontWeight="bold" fill="#fde0d0" opacity=".03" fontFamily="serif">麺</text>

        {/* ── Overlay: difumina el centro para que la card resalte ── */}
        <rect width="1200" height="800" fill="url(#center-fade)"/>
        {/* ── Viñeta en bordes ── */}
        <rect width="1200" height="800" fill="url(#vignette)"/>
      </svg>

      {/* ── Card con sombra más pronunciada para destacar sobre el fondo ── */}
      <div
        className="w-full max-w-3xl flex rounded-3xl overflow-hidden relative z-10"
        style={{ boxShadow: "0 8px 60px rgba(0,0,0,0.45)" }}
      >
        {/* Panel izquierdo — idéntico siempre */}
        <LeftPanel isRegister={isRegister} />

        {/* Panel derecho — crema con nubes tenues */}
        <div className="flex-1 relative overflow-hidden flex flex-col justify-center">
          {/* Fondo crema */}
          <div style={{ position: "absolute", inset: 0, background: "#fef7ed" }} />
          {/* Nubes tenues */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            viewBox="0 0 280 520"
            preserveAspectRatio="xMidYMid slice"
          >
            <g opacity=".055" fill="#7f1d1d">
              <path d="M-10 40 Q5 18 28 28 Q38 8 62 22 Q72 34 52 44 Q62 56 42 56 Q18 62 6 50 Z"/>
              <path d="M140 20 Q155 -2 178 8 Q188 -12 212 2 Q222 14 202 24 Q212 36 192 36 Q168 42 156 30 Z"/>
              <path d="M50 180 Q65 158 88 168 Q98 148 122 162 Q132 174 112 184 Q122 196 102 196 Q78 202 66 190 Z"/>
              <path d="M170 210 Q185 188 208 198 Q218 178 242 192 Q252 204 232 214 Q242 226 222 226 Q198 232 186 220 Z"/>
              <path d="M-10 330 Q5 308 28 318 Q38 298 62 312 Q72 324 52 334 Q62 346 42 346 Q18 352 6 340 Z"/>
              <path d="M150 350 Q165 328 188 338 Q198 318 222 332 Q232 344 212 354 Q222 366 202 366 Q178 372 166 360 Z"/>
              <path d="M60 450 Q75 428 98 438 Q108 418 132 432 Q142 444 122 454 Q132 466 112 466 Q88 472 76 460 Z"/>
            </g>
          </svg>

          {/* Formulario */}
          <form onSubmit={handleSubmit} style={{ position: "relative", padding: "32px 28px", display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* Toggle login / registro */}
            <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "999px", padding: "3px", marginBottom: "6px" }}>
              <button
                type="button"
                onClick={() => { setIsRegister(false); setConfirmError(false); setConfirmPassword(""); }}
                style={{
                  flex: 1, padding: "8px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 500,
                  border: "none", cursor: "pointer", transition: "all .2s",
                  background: !isRegister ? "#7f1d1d" : "transparent",
                  color: !isRegister ? "#fff" : "#6b7280",
                }}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setConfirmError(false); setConfirmPassword(""); }}
                style={{
                  flex: 1, padding: "8px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 500,
                  border: "none", cursor: "pointer", transition: "all .2s",
                  background: isRegister ? "#7f1d1d" : "transparent",
                  color: isRegister ? "#fff" : "#6b7280",
                }}
              >
                Registrarse
              </button>
            </div>

            {/* ── CAMPOS DE REGISTRO ── */}
            {isRegister && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#9a3412", marginBottom: "4px" }}>Nombre</label>
                    <input type="text" placeholder="Tu nombre" value={form.name}
                      onChange={set("name")} className={inputClass} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#9a3412", marginBottom: "4px" }}>Apellido</label>
                    <input type="text" placeholder="Tu apellido" value={form.surname}
                      onChange={set("surname")} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#9a3412", marginBottom: "4px" }}>Usuario</label>
                  <input type="text" placeholder="Nombre de usuario" value={form.username}
                    onChange={set("username")} className={inputClass} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#9a3412", marginBottom: "4px" }}>Teléfono</label>
                  <input type="text" placeholder="Tu teléfono" value={form.phone}
                    onChange={set("phone")} className={inputClass} />
                </div>
              </>
            )}

            {/* ── CAMPOS COMUNES ── */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#9a3412", marginBottom: "4px" }}>Correo electrónico</label>
              <input type="email" placeholder="correo@ejemplo.com" value={form.email}
                onChange={set("email")} className={inputClass} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#9a3412", marginBottom: "4px" }}>Contraseña</label>
              <input type="password" placeholder={isRegister ? "Mínimo 8 caracteres" : "Tu contraseña"} value={form.password}
                onChange={set("password")} className={inputClass} required />
            </div>

            {/* ── CONFIRMAR CONTRASEÑA (solo registro) ── */}
            {isRegister && (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: confirmError ? "#dc2626" : "#9a3412", marginBottom: "4px" }}>
                  Confirmar contraseña {confirmError && <span style={{ fontWeight: 400, marginLeft: "4px" }}>— Las contraseñas no coinciden</span>}
                </label>
                <input
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(false); }}
                  className={inputClass}
                  style={confirmError ? { outline: "none", boxShadow: "0 0 0 2px #dc2626" } : {}}
                  required
                />
              </div>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 transition hover:opacity-90"
              style={{ background: "#ea580c", marginTop: "6px" }}
            >
              {loading ? <Spinner small /> : isRegister ? "Crear cuenta" : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
