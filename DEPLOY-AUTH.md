# Despliegue gratis del Auth Service (< 2 horas)

Guía para desplegar **solo** el microservicio de autenticación de Restaurante_ICE, sin levantar el stack completo de Docker (MongoDB, server-admin, clients, etc.).

---

## 1. Qué se despliega y qué no

| Componente | ¿Desplegar? | Dónde (gratis) |
|---|---|---|
| **Auth Service** (.NET 8) | **Sí** | [Render](https://render.com) — Web Service Free (Docker) |
| **PostgreSQL** | **Sí** (externo) | [Neon](https://neon.tech) — Postgres Free |
| MongoDB | No | — |
| server-admin | No | — |
| client-admin / client-customer / client-user | No | — |
| postgres_dbRE (Docker local) | No en la nube | Solo para pruebas locales |
| docker-compose.yml completo | **No usar** | Pesado; incluye hot-reload y servicios innecesarios |

**Stack mínimo en la nube:** Neon (DB) + Render (API Auth).

Cloudinary y Gmail SMTP ya están configurados en el código; no necesitas levantar contenedores para eso.

---

## 2. Cronograma sugerido (~90–110 min)

| Bloque | Tiempo | Acción |
|---|---|---|
| A | 10 min | Cuentas GitHub + Neon + Render |
| B | 15 min | Crear Postgres en Neon y copiar connection string |
| C | 15 min | Verificar que el repo tiene el Dockerfile de producción |
| D | 30–40 min | Crear Web Service en Render y primer deploy |
| E | 15–20 min | Variables de entorno + redeploy |
| F | 10–15 min | Probar `/health`, login y register |

---

## 3. Cuentas gratuitas (crear primero)

1. **GitHub** — el código debe estar en un repo al que Render pueda acceder.
2. **Neon** — https://neon.tech → Sign up (gratis, sin tarjeta para el plan free).
3. **Render** — https://render.com → Sign up with GitHub.

> Evita añadir tarjeta en Render si quieres quedarte 100 % en free. El Web Service Free se duerme tras ~15 min sin tráfico (el primer request tarda ~30–60 s en despertar).

---

## 4. Paso A — Postgres gratis en Neon

1. En Neon: **New Project**.
2. Nombre sugerido: `restaurant-ice-auth`.
3. Región: la más cercana a ti (idealmente la misma zona que elijas en Render, p. ej. Oregon / Frankfurt).
4. Cuando el proyecto esté listo:
   - Abre **Connection Details**.
   - Activa / usa la conexión **Pooled** (el host debe contener `-pooler`).
   - Copia usuario, password, host y database.

5. Arma la connection string en formato **Npgsql** (no uses solo la URI `postgresql://` sin convertir):

```text
Host=ep-XXXX-pooler.REGION.aws.neon.tech;Port=5432;Database=neondb;Username=TU_USER;Password=TU_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
```

Guárdala: la pegarás en Render como `ConnectionStrings__DefaultConnection`.

> El valor por defecto del repo (`Host=localhost;Port=5437`) **no sirve** en la nube. Tampoco uses el Postgres de `postgres_dbRE` en producción.

---

## 5. Paso B — Dockerfile correcto (producción)

**Usa este archivo (ya incluido en el repo):**

`authentication-service/auth-service/Dockerfile`

Ese Dockerfile:

- es multi-stage (imagen final liviana `aspnet:8.0`);
- **no** usa `dotnet watch` (el de `dockerfiles/Dockerfile.auth-service` es solo para desarrollo local);
- respeta la variable `PORT` que inyecta Render (`docker-entrypoint.sh`).

**No despliegues** con el `docker-compose.yml` raíz: arranca Mongo, fronts y hot-reload; es pesado e innecesario para auth.

---

## 6. Paso C — Crear el Web Service en Render (gratis)

1. Render Dashboard → **New +** → **Web Service**.
2. Conecta el repositorio de GitHub del proyecto.
3. Configuración:

| Campo | Valor |
|---|---|
| **Name** | `ice-auth-service` |
| **Region** | Misma zona aproximada que Neon |
| **Root Directory** | `authentication-service/auth-service` |
| **Runtime** | **Docker** |
| **Dockerfile Path** | `Dockerfile` (relativo al Root Directory) |
| **Instance type** | **Free** |
| **Branch** | `main` (o la rama que contenga este Dockerfile) |

4. **Aún no** pulses Deploy final hasta pegar las variables de entorno (siguiente sección). Si Render ya desplegó y falló por DB, es normal: añade env vars y **Manual Deploy → Deploy latest commit**.

---

## 7. Paso D — Variables de entorno en Render

En el servicio → **Environment** → añade:

### Obligatorias

```bash
ConnectionStrings__DefaultConnection=Host=ep-XXXX-pooler.REGION.aws.neon.tech;Port=5432;Database=neondb;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true

JwtSettings__SecretKey=cambia-esto-por-un-secreto-largo-aleatorio-32+
JwtSettings__Issuer=AuthService
JwtSettings__Audience=AuthServiceUsers
JwtSettings__ExpiryInMinutes=60

AppSettings__BackendUrl=https://TU-SERVICIO.onrender.com
AppSettings__FrontendUrl=https://TU-FRONTEND-O-PLACEHOLDER.com

ASPNETCORE_ENVIRONMENT=Production
```

> Tras el primer deploy, Render te da la URL pública (`https://ice-auth-service.onrender.com`). Actualiza `AppSettings__BackendUrl` con esa URL exacta (sin `/` final) y vuelve a desplegar. Los links de verificación de email usan ese valor.

### Recomendadas (si quieres emails / avatares)

Puedes reutilizar las del proyecto o poner las tuyas:

```bash
CloudinarySettings__Cloudname=...
CloudinarySettings__ApiKey=...
CloudinarySettings__ApiSecret=...
CloudinarySettings__BaseUrl=...
CloudinarySettings__Folder=auth_ks_in6av/profiles
CloudinarySettings__DefaultAvatarPath=avatarDefault-1749508519496.png

SmtpSettings__Host=smtp.gmail.com
SmtpSettings__Port=587
SmtpSettings__EnableSsl=true
SmtpSettings__UserName=tu-correo@gmail.com
SmtpSettings__Password=tu-app-password
SmtpSettings__FromEmail=tu-correo@gmail.com
SmtpSettings__Enabled=true
```

Para probar **sin** enviar correos:

```bash
SmtpSettings__Enabled=false
```

### Opcional — Swagger en la nube (solo pruebas)

```bash
ASPNETCORE_ENVIRONMENT=Development
```

Swagger queda en `https://TU-SERVICIO.onrender.com/swagger`.  
En producción real déjalo en `Production` (Swagger desactivado).

---

## 8. Paso E — Verificar que está vivo

Espera a que el deploy diga **Live**. Luego:

### 1) Health

```bash
curl -s https://TU-SERVICIO.onrender.com/health
```

Respuesta esperada (JSON con status saludable).

También: `GET /api/v1/health`

> Si el servicio estaba dormido (Free), el primer `curl` puede tardar ~1 minuto. Reintenta.

### 2) Login del admin sembrado

Al arrancar, la API ejecuta `EnsureCreated` + seed. Credenciales reales del seeder:

| Campo | Valor |
|---|---|
| Email | `ksadmin@local.com` |
| Password | `Kinal2026!` |

```bash
curl -s -X POST https://TU-SERVICIO.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ksadmin@local.com","password":"Kinal2026!"}'
```

Debes recibir un JWT.

> `EDNPOINTS.md` menciona `admin@restaurante.com` / `123456` — **no coinciden** con el seeder.

### 3) Registro (opcional)

```bash
curl -s -X POST https://TU-SERVICIO.onrender.com/api/v1/auth/register \
  -F "name=Juan" \
  -F "surname=Perez" \
  -F "username=juanperez" \
  -F "email=juan@email.com" \
  -F "password=123456" \
  -F "phone=55512345"
```

---

## 9. Endpoints útiles del Auth Service

Base: `https://TU-SERVICIO.onrender.com`

| Método | Ruta | Auth |
|---|---|---|
| GET | `/health` | No |
| GET | `/api/v1/health` | No |
| POST | `/api/v1/auth/login` | No |
| POST | `/api/v1/auth/register` | No (multipart) |
| POST | `/api/v1/auth/verify-email` | No |
| GET | `/api/v1/auth/verify-email?token=...` | No (redirige al frontend) |
| GET | `/api/v1/users/me` | JWT |
| … | `/api/v1/users/...` | JWT (admin / usuario) |

Documentación de ejemplo: `EDNPOINTS.md` (corrige credenciales como arriba).

---

## 10. Prueba local rápida (opcional, antes de la nube)

Si quieres validar en tu máquina **sin** todo el compose:

```bash
# Solo Postgres local
cd postgres_dbRE
docker compose up -d

# Auth con .NET (puerto 5227)
cd ../authentication-service/auth-service
dotnet restore auth-service.sln
dotnet run --project src/AuthService.Api
```

O imagen de producción local:

```bash
cd authentication-service/auth-service
docker build -t ice-auth .
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e ConnectionStrings__DefaultConnection="Host=host.docker.internal;Database=restaurant_ice;Username=ICE;Password=restaICE1@;Port=5437" \
  -e AppSettings__BackendUrl="http://localhost:8080" \
  -e AppSettings__FrontendUrl="http://localhost:5174" \
  ice-auth
```

En Linux, si `host.docker.internal` no existe, usa la IP del host o levanta Postgres en la misma red Docker.

---

## 11. Gotchas críticos (léelos)

1. **No uses `docker-compose.yml` del root para la nube** — trae Mongo + fronts + `dotnet watch` + volúmenes de desarrollo.
2. **Connection string `localhost:5437` falla dentro de contenedores/PaaS** — apunta a Neon con SSL.
3. **Puertos históricos del repo:** CLI local = `5227`, Docker viejo = `5296`, Render = `$PORT`. Los clients (`VITE_AUTH_URL`) siguen apuntando a `5227` local; cuando conectes un frontend, cámbialo a la URL de Render + `/api/v1`.
4. **Si la DB no responde al boot, la app se cae** (`EnsureCreated` + `throw`). Revisa logs de Render → Neon.
5. **Rate limit de auth:** ~5 requests/minuto por IP. No spamees login en pruebas.
6. **Secrets en git:** JWT, SMTP y Cloudinary están commiteados en `appsettings.json` / `.env.docker`. Rótalos para cualquier demo pública.
7. **Postgres Free de Render expira a los 30 días** — por eso esta guía usa **Neon**, no Render Postgres.
8. **Cold start Free:** primer hit lento; no asumas que falló al primer timeout corto.
9. **CORS** en runtime está abierto (`AllowAnyOrigin`); no bloquea frontends externos en esta versión.

---

## 12. Checklist final

- [ ] Proyecto Neon creado + connection string con `-pooler` y `SSL Mode=Require`
- [ ] Web Service Free en Render con Root Directory `authentication-service/auth-service`
- [ ] Dockerfile de producción (no el de `dockerfiles/` con watch)
- [ ] Env vars de DB, JWT y `AppSettings__BackendUrl`
- [ ] `GET /health` responde
- [ ] Login con `ksadmin@local.com` / `Kinal2026!` devuelve token
- [ ] (Opcional) Register + correo si SMTP está enabled

Con eso tienes el Auth Service desplegado en internet, gratis, sin el resto de contenedores pesados.
