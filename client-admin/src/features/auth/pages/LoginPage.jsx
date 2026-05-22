import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const C = {
  brand:     'linear-gradient(155deg,#0c0500 0%,#7c2d12 45%,#9f1239 100%)',
  submit:    'linear-gradient(to right,#ea580c,#dc2626)',
  amber:     '#f59e0b',
  amberSoft: '#fef3c7',
  orange:    '#ea580c',
  red:       '#dc2626',
  stone900:  '#1c0a00',
  stone700:  '#44403c',
  stone500:  '#78716c',
  stone400:  '#a8a29e',
  stone200:  '#e7e5e4',
  stone100:  '#f0ebe3',
  cream:     '#fffbf5',
};

const inputStyle = (hasError) => ({
  width: '100%',
  background: '#fff',
  border: `1.5px solid ${hasError ? C.red : C.stone200}`,
  borderRadius: '10px',
  padding: '10px 14px 10px 38px',
  fontSize: '13.5px',
  color: C.stone900,
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  transition: 'border-color .15s, box-shadow .15s',
});

const useFocusRing = () => ({
  onFocus: (e) => {
    e.target.style.borderColor = C.amber;
    e.target.style.boxShadow = `0 0 0 3px rgba(245,158,11,.14)`;
  },
  onBlur: (e) => {
    e.target.style.borderColor = C.stone200;
    e.target.style.boxShadow = 'none';
  },
});


/** Ícono posicionado dentro del input */
const InputIcon = ({ children }) => (
  <span style={{
    position: 'absolute', left: '12px', top: '50%',
    transform: 'translateY(-50%)', color: C.stone400,
    display: 'flex', alignItems: 'center', pointerEvents: 'none',
  }}>
    {children}
  </span>
);

/** Wrapper de campo con label y mensaje de error */
const Field = ({ label, error, children }) => (
  <div style={{ marginBottom: '13px' }}>
    <label style={{
      display: 'block', fontSize: '12.5px', fontWeight: 600,
      color: C.stone700, marginBottom: '4px', letterSpacing: '.01em',
    }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>{children}</div>
    {error && (
      <p style={{ fontSize: '11.5px', color: C.red, marginTop: '3px' }}>{error}</p>
    )}
  </div>
);

/** Botón principal con gradiente naranja→rojo */
const SubmitBtn = ({ loading, label }) => (
  <button
    type="submit"
    disabled={loading}
    style={{
      width: '100%', border: 'none', borderRadius: '10px',
      padding: '12px 0', fontSize: '14.5px', fontWeight: 700,
      cursor: loading ? 'not-allowed' : 'pointer',
      fontFamily: "'DM Sans', sans-serif", letterSpacing: '.02em',
      background: loading ? C.stone200 : C.submit,
      color: loading ? C.stone500 : '#fff',
      transition: 'opacity .15s, transform .1s',
    }}
    onMouseEnter={(e) => { if (!loading) e.target.style.opacity = '.9'; }}
    onMouseLeave={(e) => { e.target.style.opacity = '1'; }}
    onMouseDown={(e)  => { if (!loading) e.target.style.transform = 'scale(.98)'; }}
    onMouseUp={(e)    => { e.target.style.transform = 'scale(1)'; }}
  >
    {loading ? (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <svg style={{ animation: 'iceSpinAnim 1s linear infinite' }} width="15" height="15" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeDashoffset="10"/>
        </svg>
        Procesando…
      </span>
    ) : `${label} →`}
  </button>
);

/** Input de contraseña con show/hide toggle */
const PasswordInput = ({ id, placeholder, registration, hasError }) => {
  const [show, setShow] = useState(false);
  const ring = useFocusRing();
  return (
    <div style={{ position: 'relative' }}>
      <InputIcon>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </InputIcon>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder ?? '••••••••'}
        {...registration}
        {...ring}
        style={{ ...inputStyle(hasError), paddingRight: '40px' }}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        style={{
          position: 'absolute', right: '11px', top: '50%',
          transform: 'translateY(-50%)', background: 'none', border: 'none',
          cursor: 'pointer', color: C.stone400, padding: '2px',
          display: 'flex', alignItems: 'center',
        }}
        tabIndex={-1}
      >
        {show ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  );
};

/** Tab strip segmentado */
const TabStrip = ({ active, onChange }) => {
  const tabs = [
    { id: 'login',    label: 'Iniciar sesión' },
    { id: 'register', label: 'Crear cuenta'   },
    { id: 'verify',   label: 'Verificar'      },
    { id: 'forgot',   label: 'Recuperar'      },
  ];
  return (
    <div style={{
      display: 'flex', gap: '2px',
      background: C.stone100, borderRadius: '10px', padding: '3px',
      marginBottom: '20px',
    }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          style={{
            flex: 1, padding: '7px 4px', border: 'none', borderRadius: '8px',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", transition: 'background .15s, color .15s',
            background: active === t.id ? '#fff' : 'none',
            color:      active === t.id ? C.stone900 : C.stone400,
            boxShadow:  active === t.id ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

// ─── Panel de marca (izquierdo) ────────────────────────────────────────────
const BrandPanel = () => (
  <div style={{
    width: '100%', background: C.brand,
    padding: '36px 28px', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
    // En pantallas pequeñas se oculta con media query en el CSS inyectado
  }}>
    {/* Decoración SVG de fondo */}
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 300 580" fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <circle cx="260" cy="60"  r="90"  fill="rgba(251,191,36,.06)"/>
      <circle cx="260" cy="60"  r="55"  fill="rgba(251,191,36,.07)"/>
      <circle cx="-20" cy="480" r="120" fill="rgba(251,113,133,.05)"/>
      <circle cx="150" cy="300" r="160" stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
      <circle cx="150" cy="300" r="110" stroke="rgba(255,255,255,.03)" strokeWidth="1"/>
      <line x1="0" y1="200" x2="300" y2="200" stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
      <line x1="0" y1="380" x2="300" y2="380" stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
      <line x1="80"  y1="0" x2="80"  y2="580" stroke="rgba(255,255,255,.03)" strokeWidth="1"/>
      <line x1="220" y1="0" x2="220" y2="580" stroke="rgba(255,255,255,.03)" strokeWidth="1"/>
      <polygon
        points="150,30 158,50 180,50 163,62 170,84 150,70 130,84 137,62 120,50 142,50"
        fill="rgba(251,191,36,.18)" stroke="rgba(251,191,36,.4)" strokeWidth="1"
      />
    </svg>

    {/* Contenido principal */}
    <div style={{ position: 'relative', zIndex: 2 }}>
      
        

      {/* Título */}
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '32px', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '8px',
      }}>
        Restaurante<br/>
        <em style={{ fontStyle: 'italic', color: '#fb923c' }}>ICE</em>
      </h1>

      {/* Divider ámbar */}
      <div style={{
        width: '36px', height: '3px', borderRadius: '2px',
        background: 'linear-gradient(to right,#f59e0b,#fb923c)',
        margin: '14px 0 16px',
      }}/>

      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', lineHeight: 1.65, marginBottom: '28px' }}>
        Gestiona tu restaurante con elegancia y precisión desde un solo lugar.
      </p>

      {/* Features */}
      {[
        { color: 'rgba(245,158,11,.2)', stroke: '#f59e0b', label: 'Gestión de menú y categorías',
          icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></> },
        { color: 'rgba(251,113,133,.18)', stroke: '#fb7185', label: 'Control de pedidos en tiempo real',
          icon: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></> },
        { color: 'rgba(52,211,153,.15)', stroke: '#34d399', label: 'Reportes y analíticas',
          icon: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></> },
      ].map((f) => (
        <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="2.5" strokeLinecap="round">
              {f.icon}
            </svg>
          </div>
          <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,.75)', fontWeight: 500 }}>{f.label}</span>
        </div>
      ))}
    </div>

    <span style={{ position: 'relative', zIndex: 2, fontSize: '11px', color: 'rgba(255,255,255,.3)', letterSpacing: '.03em' }}>
      © {new Date().getFullYear()} Restaurante ICE
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// VISTA 1 — LOGIN
// ═══════════════════════════════════════════════════════════════════════════
const LoginView = ({ switchTo }) => {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const ring = useFocusRing();

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onTouched' });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login({ email: data.email, password: data.password });
      if (result?.success) {
        toast.success('¡Bienvenido de vuelta!');
        navigate('/');
      } else {
        if (result?.error?.includes('Email not verified')) {
          toast.error('Por favor verifica tu email antes de iniciar sesión.');
        } else {
          toast.error(result?.error ?? 'Credenciales incorrectas. Inténtalo de nuevo.');
        }
      }
    } catch {
      toast.error('Error de conexión. Verifica tu red.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: C.amber, textTransform: 'uppercase', marginBottom: '5px' }}>
        Acceso seguro
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 900, color: C.stone900, marginBottom: '3px' }}>
        Bienvenido de vuelta
      </h2>
      <p style={{ fontSize: '13px', color: C.stone500, marginBottom: '20px' }}>
        Ingresa tus credenciales para continuar
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Correo electrónico" error={errors.email?.message}>
          <InputIcon>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </InputIcon>
          <input
            type="email"
            placeholder="admin@restauranteice.com"
            {...register('email', {
              required: 'El correo es requerido',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
            })}
            {...ring}
            style={inputStyle(!!errors.email)}
          />
        </Field>

        <Field label="Contraseña" error={errors.password?.message}>
          <PasswordInput
            id="login-pw"
            registration={register('password', {
              required: 'La contraseña es requerida',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
            hasError={!!errors.password}
          />
        </Field>

        {/* Recordarme + link */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12.5px', color: C.stone700, cursor: 'pointer', fontWeight: 500, userSelect: 'none',
          }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: C.orange, width: '14px', height: '14px', cursor: 'pointer' }} />
            Recordarme
          </label>
          <button type="button" onClick={() => switchTo('forgot')} style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '12.5px',
            color: C.stone400, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: 'color .15s',
          }}
            onMouseEnter={(e) => (e.target.style.color = C.orange)}
            onMouseLeave={(e) => (e.target.style.color = C.stone400)}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <SubmitBtn loading={loading} label="Iniciar sesión" />
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
        <div style={{ flex: 1, height: '1px', background: C.stone200 }} />
        <span style={{ fontSize: '11.5px', color: C.stone400, fontWeight: 500 }}>o</span>
        <div style={{ flex: 1, height: '1px', background: C.stone200 }} />
      </div>

      <p style={{ textAlign: 'center', fontSize: '13px', color: C.stone500 }}>
        ¿No tienes cuenta?{' '}
        <button type="button" onClick={() => switchTo('register')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.orange, fontWeight: 700, fontSize: 'inherit',
          fontFamily: "'DM Sans', sans-serif", transition: 'color .15s',
        }}
          onMouseEnter={(e) => (e.target.style.color = '#c2410c')}
          onMouseLeave={(e) => (e.target.style.color = C.orange)}
        >
          Crear cuenta gratis
        </button>
      </p>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// VISTA 2 — CREAR CUENTA
// ═══════════════════════════════════════════════════════════════════════════
const RegisterView = ({ switchTo }) => {
  const register = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const ring = useFocusRing();
  const { register: registerForm, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onTouched' });
  const pwd = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await register({
        name: data.name,
        surname: data.surname || '',
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone || '',
      });

      if (result?.success) {
        setRegisteredEmail(data.email);
        setRegistered(true);
        toast.success(result.message || 'Cuenta creada. Verifica tu email.');
      } else {
        toast.error(result?.error ?? 'No se pudo crear la cuenta.');
      }
    } catch {
      toast.error('Error de conexión. Verifica tu red.');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: C.amber, textTransform: 'uppercase', marginBottom: '5px' }}>
          Nuevo usuario
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 900, color: C.stone900, marginBottom: '3px' }}>
          Cuenta creada
        </h2>
        <p style={{ fontSize: '13px', color: C.stone500, marginBottom: '20px' }}>
          Verifica tu email para activar la cuenta
        </p>

        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg,#fef3c7,#fde68a)',
            border: `2px solid ${C.amber}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p style={{ fontSize: '14px', color: C.stone700, lineHeight: 1.65, fontWeight: 500 }}>
            Se ha enviado un email de verificación a{' '}
            <strong style={{ color: C.stone900 }}>{registeredEmail}</strong>.
            <br/>
            <span style={{ fontSize: '13px', color: C.stone500, fontWeight: 400 }}>
              Haz clic en el enlace del email para verificar tu cuenta.
            </span>
          </p>
          <button
            type="button"
            onClick={() => switchTo('verify')}
            style={{
              marginTop: '18px', background: C.submit, color: '#fff',
              border: 'none', borderRadius: '10px', padding: '10px 28px',
              fontWeight: 700, cursor: 'pointer', fontSize: '13.5px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Tengo mi código
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: C.amber, textTransform: 'uppercase', marginBottom: '5px' }}>
        Nuevo usuario
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 900, color: C.stone900, marginBottom: '3px' }}>
        Crear cuenta
      </h2>
      <p style={{ fontSize: '13px', color: C.stone500, marginBottom: '20px' }}>
        Completa el formulario para registrarte
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Nombre completo" error={errors.name?.message}>
          <InputIcon>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </InputIcon>
          <input
            type="text" placeholder="Juan Pérez"
            {...registerForm('name', { required: 'El nombre es requerido', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
            {...ring}
            style={inputStyle(!!errors.name)}
          />
        </Field>

        <Field label="Apellido (opcional)" error={errors.surname?.message}>
          <InputIcon>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </InputIcon>
          <input
            type="text" placeholder="García"
            {...registerForm('surname')}
            {...ring}
            style={inputStyle(!!errors.surname)}
          />
        </Field>

        <Field label="Usuario" error={errors.username?.message}>
          <InputIcon>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </InputIcon>
          <input
            type="text" placeholder="juan.perez"
            {...registerForm('username', { required: 'El usuario es requerido', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
            {...ring}
            style={inputStyle(!!errors.username)}
          />
        </Field>

        <Field label="Correo electrónico" error={errors.email?.message}>
          <InputIcon>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </InputIcon>
          <input
            type="email" placeholder="correo@ejemplo.com"
            {...registerForm('email', {
              required: 'El correo es requerido',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
            })}
            {...ring}
            style={inputStyle(!!errors.email)}
          />
        </Field>

        <Field label="Teléfono (opcional)" error={errors.phone?.message}>
          <InputIcon>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </InputIcon>
          <input
            type="tel" placeholder="+1234567890"
            {...registerForm('phone')}
            {...ring}
            style={inputStyle(!!errors.phone)}
          />
        </Field>

        <Field label="Contraseña" error={errors.password?.message}>
          <PasswordInput
            id="reg-pw1" placeholder="Mínimo 8 caracteres"
            registration={registerForm('password', {
              required: 'La contraseña es requerida',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Debe incluir mayúscula, minúscula y número' },
            })}
            hasError={!!errors.password}
          />
        </Field>

        <Field label="Confirmar contraseña" error={errors.confirm?.message}>
          <PasswordInput
            id="reg-pw2" placeholder="Repite tu contraseña"
            registration={registerForm('confirm', {
              required: 'Confirma tu contraseña',
              validate: (v) => v === pwd || 'Las contraseñas no coinciden',
            })}
            hasError={!!errors.confirm}
          />
        </Field>

        <div style={{ marginTop: '4px' }}>
          <SubmitBtn loading={loading} label="Crear mi cuenta" />
        </div>
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', color: C.stone500, marginTop: '14px' }}>
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={() => switchTo('login')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.orange, fontWeight: 700, fontSize: 'inherit', fontFamily: "'DM Sans', sans-serif",
        }}>
          Iniciar sesión
        </button>
      </p>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// VISTA 3 — VERIFICAR EMAIL
// ═══════════════════════════════════════════════════════════════════════════
const VerifyEmailView = ({ switchTo }) => {
  const verifyEmail = useAuthStore((s) => s.verifyEmail);
  const resendVerification = useAuthStore((s) => s.resendVerification);
  const pendingEmail = useAuthStore((s) => s.pendingVerificationEmail);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const ring = useFocusRing();
  const [searchParams] = useSearchParams();
  
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    mode: 'onTouched',
    defaultValues: {
      token: searchParams.get('token') || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await verifyEmail(data.token);
      if (result?.success) {
        setVerified(true);
        toast.success('¡Email verificado! Ahora puedes iniciar sesión.');
        setTimeout(() => switchTo('login'), 2000);
      } else {
        toast.error(result?.error ?? 'Token inválido o expirado');
      }
    } catch {
      toast.error('Error de conexión. Verifica tu red.');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (!pendingEmail) {
      toast.error('Email no encontrado');
      return;
    }
    setResending(true);
    try {
      const result = await resendVerification(pendingEmail);
      if (result?.success) {
        toast.success('Email de verificación reenviado');
      } else {
        toast.error(result?.error ?? 'No se pudo reenviar el email');
      }
    } catch {
      toast.error('Error de conexión. Verifica tu red.');
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: C.amber, textTransform: 'uppercase', marginBottom: '5px' }}>
          Verificación completada
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 900, color: C.stone900, marginBottom: '3px' }}>
          ¡Bienvenido!
        </h2>
        <p style={{ fontSize: '13px', color: C.stone500, marginBottom: '20px' }}>
          Tu email ha sido verificado exitosamente
        </p>

        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
            border: `2px solid #10b981`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p style={{ fontSize: '14px', color: C.stone700, lineHeight: 1.65, fontWeight: 500 }}>
            Tu cuenta está lista.
            <br/>
            <span style={{ fontSize: '13px', color: C.stone500, fontWeight: 400 }}>
              Redirigiendo a inicio de sesión...
            </span>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: C.amber, textTransform: 'uppercase', marginBottom: '5px' }}>
        Verificar email
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 900, color: C.stone900, marginBottom: '3px' }}>
        Ingresa tu código
      </h2>
      <p style={{ fontSize: '13px', color: C.stone500, marginBottom: '20px' }}>
        Hemos enviado un código a tu email
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Código de verificación" error={errors.token?.message}>
          <InputIcon>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </InputIcon>
          <input
            type="text" placeholder="Pega el código aquí"
            {...register('token', { required: 'El código es requerido', minLength: { value: 10, message: 'Código inválido' } })}
            {...ring}
            style={inputStyle(!!errors.token)}
          />
        </Field>

        <SubmitBtn loading={loading} label="Verificar email" />
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
        <div style={{ flex: 1, height: '1px', background: C.stone200 }} />
        <span style={{ fontSize: '11.5px', color: C.stone400, fontWeight: 500 }}>o</span>
        <div style={{ flex: 1, height: '1px', background: C.stone200 }} />
      </div>

      <p style={{ textAlign: 'center', fontSize: '13px', color: C.stone500 }}>
        ¿No recibiste el código?{' '}
        <button type="button" onClick={onResend} disabled={resending} style={{
          background: 'none', border: 'none', cursor: resending ? 'not-allowed' : 'pointer',
          color: resending ? C.stone400 : C.orange, fontWeight: 700, fontSize: 'inherit',
          fontFamily: "'DM Sans', sans-serif", transition: 'color .15s',
          opacity: resending ? 0.6 : 1,
        }}>
          {resending ? 'Reenviando...' : 'Reenviar código'}
        </button>
      </p>

      <p style={{ textAlign: 'center', marginTop: '14px' }}>
        <button type="button" onClick={() => switchTo('login')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '13px', color: C.stone400, fontFamily: "'DM Sans', sans-serif",
          transition: 'color .15s',
        }}
          onMouseEnter={(e) => (e.target.style.color = C.orange)}
          onMouseLeave={(e) => (e.target.style.color = C.stone400)}
        >
          ← Volver a iniciar sesión
        </button>
      </p>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// VISTA 4 — RESTABLECER CONTRASEÑA
// ═══════════════════════════════════════════════════════════════════════════
const ForgotView = ({ switchTo }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const ring = useFocusRing();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode: 'onTouched' });

  const onSubmit = async () => {
    setLoading(true);
    try {
      // TODO: await axiosAuth.post('/auth/forgot-password', { email: getValues('email') })
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
      toast.success('Revisa tu bandeja de entrada.');
    } catch {
      toast.error('No se pudo enviar el correo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', color: C.amber, textTransform: 'uppercase', marginBottom: '5px' }}>
        Recuperar acceso
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 900, color: C.stone900, marginBottom: '3px' }}>
        ¿Olvidaste tu contraseña?
      </h2>
      <p style={{ fontSize: '13px', color: C.stone500, marginBottom: '20px' }}>
        Ingresa tu correo y te enviamos un enlace de recuperación
      </p>

      {sent ? (
        /* ── Estado: enviado ── */
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg,#fef3c7,#fde68a)',
            border: `2px solid ${C.amber}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p style={{ fontSize: '14px', color: C.stone700, lineHeight: 1.65, fontWeight: 500 }}>
            Enlace enviado a{' '}
            <strong style={{ color: C.stone900 }}>{getValues('email')}</strong>.
            <br/>
            <span style={{ fontSize: '13px', color: C.stone500, fontWeight: 400 }}>
              Revisa también tu carpeta de spam.
            </span>
          </p>
          <button
            type="button"
            onClick={() => switchTo('login')}
            style={{
              marginTop: '18px', background: C.submit, color: '#fff',
              border: 'none', borderRadius: '10px', padding: '10px 28px',
              fontWeight: 700, cursor: 'pointer', fontSize: '13.5px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Volver al inicio
          </button>
        </div>
      ) : (
        /* ── Formulario ── */
        <>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field label="Correo electrónico" error={errors.email?.message}>
              <InputIcon>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </InputIcon>
              <input
                type="email" placeholder="correo@ejemplo.com"
                {...register('email', {
                  required: 'El correo es requerido',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
                })}
                {...ring}
                style={{ ...inputStyle(!!errors.email), marginBottom: '4px' }}
              />
            </Field>
            <div style={{ marginTop: '4px' }}>
              <SubmitBtn loading={loading} label="Enviar enlace de recuperación" />
            </div>
          </form>
          <p style={{ textAlign: 'center', marginTop: '14px' }}>
            <button type="button" onClick={() => switchTo('login')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '13px', color: C.stone400, fontFamily: "'DM Sans', sans-serif",
              transition: 'color .15s',
            }}
              onMouseEnter={(e) => (e.target.style.color = C.orange)}
              onMouseLeave={(e) => (e.target.style.color = C.stone400)}
            >
              ← Volver a iniciar sesión
            </button>
          </p>
        </>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL — LoginPage
// ═══════════════════════════════════════════════════════════════════════════
export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState(searchParams.get('token') ? 'verify' : 'login');

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      {/* Keyframes globales */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes iceCardIn  { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes iceSpinAnim{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes icePanelIn { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        .ice-panel { animation: icePanelIn .22s ease both; }

        /* Oculta el panel de marca en pantallas muy pequeñas */
        @media (max-width: 640px) {
          .ice-brand-panel { display: none !important; }
          .ice-form-side   { border-radius: 20px !important; }
        }
      `}</style>

      {/* Tarjeta principal */}
      <div style={{
        display: 'flex', width: '100%', maxWidth: '820px',
        borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,.1), 0 24px 56px rgba(0,0,0,.18), 0 0 0 1px rgba(15,23,42,.04)',
        animation: 'iceCardIn .4s cubic-bezier(.22,1,.36,1) both',
        zIndex: 1, position: 'relative',
      }}>
        {/* Panel izquierdo (marca) */}
        <div
          className="ice-brand-panel"
          style={{ flex: '0 0 42%', maxWidth: '42%', display: 'flex' }}
        >
          <BrandPanel />
        </div>

        {/* Panel derecho (formulario) */}
        <div
          className="ice-form-side"
          style={{
            flex: 1, background: C.cream,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '36px 32px', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Acentos de fondo */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '240px', height: '240px', borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(251,146,60,.12) 0%,transparent 65%)',
            pointerEvents: 'none',
          }}/>
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: '-60px', left: '-40px',
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(245,158,11,.09) 0%,transparent 65%)',
            pointerEvents: 'none',
          }}/>

          {/* Vistas con animación */}
          <div key={view} className="ice-panel" style={{ position: 'relative', zIndex: 2 }}>
            {view === 'login'    && <LoginView    switchTo={setView} />}
            {view === 'register' && <RegisterView switchTo={setView} />}
            {view === 'verify'   && <VerifyEmailView switchTo={setView} />}
            {view === 'forgot'   && <ForgotView   switchTo={setView} />}
          </div>

          {/* Footer */}
          <p style={{
            position: 'relative', zIndex: 2, textAlign: 'center',
            fontSize: '11px', color: '#c4b5a0',
            borderTop: `1px solid ${C.stone100}`, paddingTop: '14px', marginTop: '18px',
          }}>
            Acceso protegido con cifrado SSL
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
