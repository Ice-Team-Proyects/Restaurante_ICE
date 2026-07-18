# Despliegue gratis del stack Restaurante_ICE (< 2 horas)

Despliega **todos los servicios que hacen funcionar la página**, sin usar el `docker-compose.yml` completo (Mongo + fronts + hot-reload + SDK .NET = demasiado pesado para free tiers).

---

## 1. Qué se despliega (y dónde — 100 % gratis)

| # | Servicio | Tipo | Hosting gratis | Notas |
|---|---|---|---|---|
| 1 | **PostgreSQL** (Auth) | DB | [Neon](https://neon.tech) Free | No uses Render Postgres (expira 30 días) |
| 2 | **MongoDB** (API negocio) | DB | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 Free | Obligatorio para server-admin |
| 3 | **auth-service** | API .NET 8 | [Render](https://render.com) Web Service Free (Docker) | Dockerfile de producción |
| 4 | **server-admin** | API Node/Express | Render Web Service Free (Node) | Sin Docker; `pnpm start` |
| 5 | **client-admin** | SPA React/Vite | Render **Static Site** Free | Panel admin web |
| 6 | **client-customer** | SPA React/Vite | Render **Static Site** Free | Página del cliente web |
| 7 | **client-user** | App Expo/RN | [Expo](https://expo.dev) Free + Expo Go | App móvil (no es SPA Vite) |

**No despliegues con Docker Compose en la nube.** Cada pieza va a su PaaS free. Cloudinary/Gmail SMTP ya están en el código (no son contenedores).

---

## 2. Orden de despliegue (importante)

```
Neon + Atlas  →  auth-service  →  server-admin  →  client-admin + client-customer  →  client-user
```

Los fronts necesitan las URLs públicas de Auth y server-admin **en el build** (`VITE_*` / `EXPO_PUBLIC_*`).

---

## 3. Cronograma (~100–120 min)

| Bloque | Min | Acción |
|---|---|---|
| A | 15 | Cuentas: GitHub, Neon, Atlas, Render, Expo |
| B | 15 | Crear Neon + Atlas y copiar connection strings |
| C | 25 | Deploy auth-service (Render Docker) |
| D | 20 | Deploy server-admin (Render Node) |
| E | 25 | Deploy client-admin + client-customer (Static) |
| F | 15 | Configurar client-user (Expo) y probar flujo |

---

## 4. Cuentas gratis

1. GitHub (repo conectado a Render)
2. Neon → Postgres
3. MongoDB Atlas → cluster M0
4. Render → APIs + static sites
5. Expo → app móvil

> En Render, evita añadir tarjeta si quieres quedarte en free. Los Web Services Free se duermen ~15 min sin tráfico (primer request ~30–60 s).

---

## 5. Bases de datos

### 5.1 Neon (Postgres para Auth)

1. New Project → región cercana (ej. Oregon).
2. Connection Details → host **pooled** (`-pooler`).
3. Connection string Npgsql:

```text
Host=ep-XXXX-pooler.REGION.aws.neon.tech;Port=5432;Database=neondb;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true
```

### 5.2 MongoDB Atlas (para server-admin)

1. Create Project → Build a Database → **M0 Free**.
2. Región cercana a Render.
3. Create database user + password.
4. Network Access → **Allow Access from Anywhere** (`0.0.0.0/0`) — necesario porque Render Free no tiene IP fija.
5. Connect → Drivers → copia URI:

```text
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/restICE?retryWrites=true&w=majority
```

---

## 6. auth-service (Render Docker Free)

1. New → **Web Service** → conecta el repo.
2. Config:

| Campo | Valor |
|---|---|
| Name | `ice-auth-service` |
| Root Directory | `authentication-service/auth-service` |
| Runtime | **Docker** |
| Dockerfile Path | `Dockerfile` |
| Instance | **Free** |

3. Environment:

```bash
ConnectionStrings__DefaultConnection=<string Neon con SSL>
JwtSettings__SecretKey=ThisIsSecretKeyForRestaurant1234
JwtSettings__Issuer=AuthService
JwtSettings__Audience=AuthServiceUsers
JwtSettings__ExpiryInMinutes=60
AppSettings__BackendUrl=https://ice-auth-service.onrender.com
AppSettings__FrontendUrl=https://ice-client-customer.onrender.com
ASPNETCORE_ENVIRONMENT=Production
SmtpSettings__Enabled=false
```

> Tras el primer deploy, sustituye `AppSettings__BackendUrl` / `FrontendUrl` por las URLs reales y redeploy.

4. Prueba:

```bash
curl https://ice-auth-service.onrender.com/health
curl -X POST https://ice-auth-service.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ksadmin@local.com","password":"Kinal2026!"}'
```

Admin sembrado: `ksadmin@local.com` / `Kinal2026!`

---

## 7. server-admin (Render Node Free)

1. New → **Web Service**.
2. Config:

| Campo | Valor |
|---|---|
| Name | `ice-server-admin` |
| Root Directory | `server-admin` |
| Runtime | **Node** |
| Build Command | `corepack enable && pnpm install --frozen-lockfile` |
| Start Command | `pnpm start` |
| Instance | **Free** |

3. Environment:

```bash
PORT=10000
URI_MONGODB=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/restICE?retryWrites=true&w=majority
JWT_SECRET=ThisIsSecretKeyForRestaurant1234
JWT_ISSUER=AuthService
JWT_AUDIENCE=AuthServiceUsers
JWT_EXPIRES_IN=1h
CLOUDINARY_CLOUD_NAME=dss7fs6pl
CLOUDINARY_API_KEY=576915661566217
CLOUDINARY_API_SECRET=d5QSRBAe6VUFv2zb3oTU6NueJ3g
NODE_ENV=production
```

> `JWT_SECRET` **debe ser idéntico** al de Auth (`JwtSettings__SecretKey`). server-admin no llama a Auth por HTTP: solo verifica el JWT.

4. Prueba:

```bash
curl https://ice-server-admin.onrender.com/RestauranteICE/v1/health
```

Swagger: `https://ice-server-admin.onrender.com/RestauranteICE/v1/api-docs`

---

## 8. client-admin (Static Site Free) — panel web

1. New → **Static Site**.
2. Config:

| Campo | Valor |
|---|---|
| Name | `ice-client-admin` |
| Root Directory | `client-admin` |
| Build Command | `corepack enable && pnpm install && pnpm build` |
| Publish Directory | `dist` |

3. Environment (**build-time**):

```bash
VITE_AUTH_URL=https://ice-auth-service.onrender.com/api/v1
VITE_API_URL=https://ice-server-admin.onrender.com/RestauranteICE/v1
VITE_ADMIN_URL=https://ice-server-admin.onrender.com/RestauranteICE/v1
```

4. Redirect SPA (para React Router): en el Static Site → **Redirects/Rewrites**:

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

(También hay `public/_redirects` en el repo para plataformas que lo lean.)

5. Abre `https://ice-client-admin.onrender.com` → login con el admin de Auth.

---

## 9. client-customer (Static Site Free) — página cliente

Igual que admin, cambiando nombres:

| Campo | Valor |
|---|---|
| Name | `ice-client-customer` |
| Root Directory | `client-customer` |
| Build Command | `corepack enable && pnpm install && pnpm build` |
| Publish Directory | `dist` |

Env:

```bash
VITE_AUTH_URL=https://ice-auth-service.onrender.com/api/v1
VITE_API_URL=https://ice-server-admin.onrender.com/RestauranteICE/v1
VITE_ADMIN_URL=https://ice-server-admin.onrender.com/RestauranteICE/v1
```

Rewrite SPA: `/*` → `/index.html`.

Actualiza en Auth:

```bash
AppSettings__FrontendUrl=https://ice-client-customer.onrender.com
```

---

## 10. client-user (Expo Free) — app móvil

No va en Render Static (es React Native / Expo).

### Opción A — Expo Go (más rápido, gratis, < 15 min)

1. Crea cuenta en [expo.dev](https://expo.dev).
2. En tu máquina (o CI):

```bash
cd client-user
cp .env.example .env
```

Edita `.env`:

```bash
EXPO_PUBLIC_AUTH_URL=https://ice-auth-service.onrender.com/api/v1
EXPO_PUBLIC_USER_URL=https://ice-server-admin.onrender.com/RestauranteICE/v1
```

3. Instala y arranca:

```bash
corepack enable
pnpm install
pnpm start
```

4. Escanea el QR con **Expo Go** (Android/iOS).  
   La app habla con Auth + server-admin en la nube.

### Opción B — Build web con Expo (opcional)

Si necesitas una URL web además de móvil:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
npx expo export -p web
```

Luego sube la carpeta de export a un Static Site.  
La experiencia principal de `client-user` está pensada para **móvil**.

---

## 11. Mapa final de URLs

Sustituye por tus URLs reales de Render:

| Pieza | URL ejemplo |
|---|---|
| Auth API | `https://ice-auth-service.onrender.com` |
| Auth base clients | `https://ice-auth-service.onrender.com/api/v1` |
| server-admin | `https://ice-server-admin.onrender.com/RestauranteICE/v1` |
| Admin web | `https://ice-client-admin.onrender.com` |
| Customer web | `https://ice-client-customer.onrender.com` |
| App móvil | Expo Go / EAS |

---

## 12. Checklist de humo (páginas funcionando)

- [ ] `GET` Auth `/health` → OK
- [ ] Login Auth → JWT
- [ ] `GET` server-admin `/RestauranteICE/v1/health` → OK
- [ ] client-customer carga home y lista restaurantes/menús
- [ ] client-admin login + CRUD básico
- [ ] client-user en Expo Go login contra Auth cloud
- [ ] `AppSettings__FrontendUrl` apunta al customer desplegado

---

## 13. Por qué NO usar docker-compose en la nube

El compose del root:

- levanta Mongo + Auth (SDK + `dotnet watch`) + server-admin (nodemon) + 2 Vite HMR;
- monta volúmenes de desarrollo;
- apunta Auth a `Host=localhost;Port=5437` (roto dentro del contenedor);
- supera fácilmente límites de RAM/CPU de free tiers.

En su lugar: **DBs managed free + 2 Web Services + 2 Static Sites + Expo**.

---

## 14. Gotchas

1. **Cold start Free:** Auth y server-admin duermen; el primer click en la web puede tardar ~1 min.
2. **JWT compartido:** `JWT_SECRET` (server-admin) = `JwtSettings__SecretKey` (auth).
3. **Variables `VITE_*`:** solo se leen en **build**. Si cambias la URL de la API, hay que **rebuild** el Static Site.
4. **Atlas Network Access:** sin `0.0.0.0/0`, server-admin no conecta.
5. **Neon SSL:** sin `SSL Mode=Require`, Auth falla al boot.
6. **Puerto histórico 5227 vs 5296:** en la nube ignóralos; usa las URLs `https://…onrender.com`.
7. **Rate limit Auth:** ~5 req/min en login — no spamees pruebas.
8. **Secrets en el repo:** rota JWT/SMTP/Cloudinary si la demo es pública.

---

## 15. Alternativa rápida de fronts (también gratis)

Si prefieres Vercel para las SPAs:

| Proyecto | Root | Build | Output | Env |
|---|---|---|---|---|
| client-admin | `client-admin` | `pnpm install && pnpm build` | `dist` | mismas `VITE_*` |
| client-customer | `client-customer` | `pnpm install && pnpm build` | `dist` | mismas `VITE_*` |

Sigue siendo gratis. Auth + server-admin conviene dejarlos en Render (Docker/Node).
