# Demo data via HTTP (live deploy)

Base URL: `https://ice-server-admin.onrender.com/RestauranteICE/v1`  
Auth service: `https://ice-auth-service.onrender.com/api/v1`  
Swagger (local pattern): `/RestauranteICE/v1/api-docs`

All examples below were verified against the live API. Soft-delete is always `isActive: false` via `PATCH .../delete/:id` (except where noted). List endpoints usually return only `isActive: true` unless you pass `?isActive=false`.

---

## 0. JWT from auth

```bash
curl -sS -X POST https://ice-auth-service.onrender.com/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"emailOrUsername":"ksadmin@local.com","password":"Kinal2026!"}'
```

Successful body includes `token` (and `userDetails`). Seeded admin: `ksadmin@local.com` / `Kinal2026!`.

Send the JWT as either:

- `Authorization: Bearer <token>`, or  
- `x-token: <token>`

(`middleware/validate-JWT.js`)

**JWT required on create:** category, product, menu, event, promotion, inscription, reservation.  
**JWT not required on create:** restaurant, table, order (and most soft-delete/restore routes).

---

## Entity reference

### 1. Restaurant

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/restaurant` |
| **JWT** | No |
| **Content-Type** | `multipart/form-data` (multer field `image`, optional) |

**Required form fields** (`restaurant-validator.js` + model):

| Field | Rules |
|---|---|
| `name` | string, required, max **100** |
| `address` | string, required, max **500** |
| `phone` | string, required, max **8** (no hyphens; e.g. `22334455`) |
| `openingHours` | string, required, max **100** |
| `description` | optional string, max **500** |
| `image` | optional file: jpeg/png/jpg/webp, max 10MB |

```bash
curl -X POST https://ice-server-admin.onrender.com/RestauranteICE/v1/restaurant \
  -F 'name=ICE Demo Centro' \
  -F 'address=Zona 10 Ciudad de Guatemala' \
  -F 'phone=22334455' \
  -F 'openingHours=Lun-Dom 08:00-22:00' \
  -F 'description=Sucursal demo'
```

**Soft-delete:** `PATCH /restaurant/delete/:id` → `isActive: false`. Restore: `PATCH /restaurant/restore/:id`.  
**Lists:** `GET /restaurant?isActive=true` (default). Default photo if no file: `restaurants/default_restaurant_image`.  
**Relationships:** none required. Tables/reservations can reference its `_id`.

---

### 2. Category

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/category` |
| **JWT** | Yes |
| **Content-Type** | `application/json` |

| Field | Rules |
|---|---|
| `categoryName` | required, length **2–100** |
| `type` | required enum: `"Bebidas Frias"` \| `"Platillos"` \| `"Bebidas Calientes"` \| `"Sopas"` |
| `description` | required, max **500** |

```json
{
  "categoryName": "Platillos Demo",
  "type": "Platillos",
  "description": "Categoria demo de platillos"
}
```

**Soft-delete:** `PATCH /category/delete/:id`. Restore: `PATCH /category/restore/:id`.  
**Lists:** `isActive !== 'false'` → active only.  
**Relationships:** products store `category` → Category `_id`.

---

### 3. Product

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/product` |
| **JWT** | Yes |
| **Content-Type** | `multipart/form-data` (field `image`, optional) |

**Validator fields:** `saucer`, `description`, `price`.  
**Model also requires:** `category` (Mongo ObjectId) — not in express-validator, but Mongoose rejects without it.

| Field | Rules |
|---|---|
| `saucer` | required, **2–100** chars |
| `description` | required, max **500** |
| `price` | required; validator uses `isLength({ max: 10 })` → send as **string** in form, e.g. `"45.50"` |
| `category` | ObjectId of Category (required by model) |
| `image` | optional image file |

```bash
curl -X POST https://ice-server-admin.onrender.com/RestauranteICE/v1/product \
  -H "Authorization: Bearer $TOKEN" \
  -F 'saucer=Tacos Demo' \
  -F 'description=Tacos al pastor demo' \
  -F 'price=45.50' \
  -F 'category=<CATEGORY_ID>'
```

**Soft-delete:** `PATCH /product/delete/:id`. Restore: `PATCH /product/restore/:id`.  
**Default photo:** `Products/default_product_image.png`.  
**Relationships:** needs active Category `_id` in `category`. Used by menu `products[]` and order `items[].productId`.

---

### 4. Menu

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/menu` |
| **JWT** | Yes (route-level `validateJWT` only; no express-validator) |
| **Content-Type** | `application/json` |

| Field | Rules |
|---|---|
| `name` | required by model, max **100** |
| `description` | optional, max **500**, default `""` |
| `products` | optional array of Product ObjectIds (default `[]`) |

```json
{
  "name": "Menu Demo",
  "description": "Menu principal demo",
  "products": ["<PRODUCT_ID>"]
}
```

**Soft-delete:** `PATCH /menu/delete/:id`. Restore: `PATCH /menu/restore/:id`.  
**Relationships:** `products` → Product `_id`s (response populates category). Create category → product before menu.

---

### 5. Table

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/table` |
| **JWT** | No |
| **Content-Type** | `application/json` |

| Field | Rules |
|---|---|
| `number` | required int ≥ 1, **unique** |
| `capacity` | required int ≥ 1 |
| `status` | optional: `"disponible"` \| `"ocupada"` \| `"reservada"` (default `disponible`) |
| `restaurant` | optional MongoId |

```json
{
  "number": 8801,
  "capacity": 4,
  "status": "disponible",
  "restaurant": "<RESTAURANT_ID>"
}
```

**Soft-delete:** `PATCH /table/delete/:id`. Restore: `PATCH /table/restore/:id`.  
**List quirk:** `GET /table` does **not** filter by `isActive` unless you pass `?isActive=true|false`.  
**Relationships:** optional `restaurant`. Orders need `tableId`; reservations require `table` + `restaurant`. Creating an order requires the table to be `isActive: true`.

---

### 6. Order

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/order` |
| **JWT** | No |
| **Content-Type** | `application/json` |

| Field | Rules |
|---|---|
| `tableId` | required (active Table `_id`) |
| `items` | array min 1 |
| `items.*.productId` | required (stored as string) |
| `items.*.quantity` | optional int ≥ 1 (model default **1**) |
| `items.*.price` | required numeric |
| `status` | optional enum: `PENDING` \| `PREPARING` \| `READY` \| `DELIVERED` \| `CANCELLED` (default `PENDING`) |
| `totalAmount` | optional; **recomputed** as `sum(quantity * price)` |

```json
{
  "tableId": "<TABLE_ID>",
  "items": [
    { "productId": "<PRODUCT_ID>", "quantity": 2, "price": 45.5 }
  ]
}
```

**Soft-delete:** `PATCH /order/delete/:id` → `isActive: false`. **No restore route.**  
**Relationships:** active `tableId`; product IDs in items (not FK-validated beyond presence in body).

---

### 7. Event

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/event/events` |
| **JWT** | Yes |
| **Content-Type** | `application/json` |

| Field | Rules |
|---|---|
| `name_event` | required, **2–150** |
| `description` | required, **2–500** |
| `date_event` | required ISO8601 → Date |
| `capacity` | required int **1–500** |
| `location` | required, **2–200** |
| `price` | required float ≥ 0 |

```json
{
  "name_event": "Noche Demo",
  "description": "Cena especial demo",
  "date_event": "2026-09-20T20:00:00.000Z",
  "capacity": 30,
  "location": "Salon principal",
  "price": 75
}
```

**Soft-delete:** `PATCH /event/events/delete/:id`. Restore: `PATCH /event/events/restore/:id`.  
**Relationships:** inscriptions reference `id_event`. Capacity checked against active non-`cancelada` inscriptions.

---

### 8. Promotion

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/event/promotions` |
| **JWT** | Yes |
| **Content-Type** | `application/json` |

| Field | Rules |
|---|---|
| `name_promotion` | required, **2–150** |
| `description` | required, **2–500** |
| `discount_percentage` | required int **1–100** |
| `date_start` | required ISO8601 |
| `date_end` | required ISO8601; must be **after** `date_start` (service check) |
| `min_people` | required int ≥ 1 |

```json
{
  "name_promotion": "Promo Demo 10",
  "description": "10 por ciento demo",
  "discount_percentage": 10,
  "date_start": "2026-07-01T00:00:00.000Z",
  "date_end": "2026-12-31T23:59:59.000Z",
  "min_people": 1
}
```

**Soft-delete:** `PATCH /event/promotions/delete/:id`. Restore: `PATCH /event/promotions/restore/:id`.  
**Relationships:** optional on inscription as `id_promotion`. For discount to apply: promotion `isActive`, **now** between `date_start` and `date_end`, and `number_people >= min_people`.

---

### 9. Reservation

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/reservation` |
| **JWT** | Yes |
| **Content-Type** | `application/json` |

| Field | Rules |
|---|---|
| `name_customer` | required, **2–150** |
| `number_people` | required int **1–500** |
| `time_reservation` | required ISO8601 → Date |
| `table` | required MongoId (Table) |
| `restaurant` | required MongoId (Restaurant) |

```json
{
  "name_customer": "Ana Demo",
  "number_people": 2,
  "time_reservation": "2026-08-15T19:00:00.000Z",
  "table": "<TABLE_ID>",
  "restaurant": "<RESTAURANT_ID>"
}
```

**Soft-delete:** `PATCH /reservation/delete/:id`. Restore: `PATCH /reservation/restore/:id`.  
**Side effects:** on create/restore, sets table `status` to `ocupada` if reservation is **today**, else `reservada`. On soft-delete, if no other active reservation for that table → `disponible`.  
**Relationships:** needs existing `table` + `restaurant` (prefer table.restaurant matching).

---

### 10. Inscription (optional seed)

| | |
|---|---|
| **Route** | `POST /RestauranteICE/v1/event/inscriptions` |
| **JWT** | Yes |
| **Content-Type** | `application/json` |

| Field | Rules |
|---|---|
| `name_customer` | required, **2–150** |
| `email_customer` | required email, max **150** (normalized) |
| `phone_customer` | required, length **7–20** |
| `id_event` | required Event MongoId |
| `number_people` | required int **1–20** |
| `id_promotion` | optional MongoId (or null) |
| `total_price` | **not sent** — computed as `event.price * number_people` (− discount if promo valid) |
| `status` | default `"pendiente"` (`pendiente` \| `confirmada` \| `cancelada`) |

```json
{
  "name_customer": "Luis Demo",
  "email_customer": "luis.demo@email.com",
  "phone_customer": "55512345",
  "id_event": "<EVENT_ID>",
  "number_people": 2,
  "id_promotion": "<PROMOTION_ID>"
}
```

**Soft-delete quirk:** `PATCH /event/inscriptions/delete/:id` sets `isActive: false` **and** `status: "cancelada"`. Restore sets `isActive: true` and `status: "pendiente"`.  
**Relationships:** active event; optional active/in-window promotion; capacity sum must fit event.

---

## Length / phone constraints (quick)

| Field | Limit |
|---|---|
| Restaurant `phone` | max **8** chars |
| Inscription `phone_customer` | **7–20** chars |
| Category / product names | product `saucer` 2–100; category `categoryName` 2–100 |
| Most descriptions | max **500** |
| Event `name_event` / promotion `name_promotion` / reservation `name_customer` | max **150** |
| Event `location` | max **200** |
| Table `number` | unique integer |

---

## Minimal ordered seed plan

Create in this order. Replace IDs from each response’s `data._id`.

```bash
export BASE=https://ice-server-admin.onrender.com/RestauranteICE/v1
export AUTH=https://ice-auth-service.onrender.com/api/v1

# A. Auth
export TOKEN=$(curl -sS -X POST "$AUTH/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"emailOrUsername":"ksadmin@local.com","password":"Kinal2026!"}' \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["token"])')

# B. Restaurant (no JWT)
curl -sS -X POST "$BASE/restaurant" \
  -F 'name=ICE Demo Centro' \
  -F 'address=Zona 10 Ciudad de Guatemala' \
  -F 'phone=22334455' \
  -F 'openingHours=Lun-Dom 08:00-22:00' \
  -F 'description=Sucursal demo'
# → RESTAURANT_ID

# C. Category (JWT)
curl -sS -X POST "$BASE/category" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"categoryName":"Platillos Demo","type":"Platillos","description":"Categoria demo de platillos"}'
# → CATEGORY_ID

# D. Product (JWT, multipart) — needs CATEGORY_ID
curl -sS -X POST "$BASE/product" \
  -H "Authorization: Bearer $TOKEN" \
  -F 'saucer=Tacos Demo' \
  -F 'description=Tacos al pastor demo' \
  -F 'price=45.50' \
  -F "category=$CATEGORY_ID"
# → PRODUCT_ID

# E. Menu (JWT) — needs PRODUCT_ID
curl -sS -X POST "$BASE/menu" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"name\":\"Menu Demo\",\"description\":\"Menu principal demo\",\"products\":[\"$PRODUCT_ID\"]}"

# F. Table (no JWT) — ideally RESTAURANT_ID; use a unique number
curl -sS -X POST "$BASE/table" -H 'Content-Type: application/json' \
  -d "{\"number\":8801,\"capacity\":4,\"status\":\"disponible\",\"restaurant\":\"$RESTAURANT_ID\"}"
# → TABLE_ID

# G. Order (no JWT) — needs TABLE_ID + PRODUCT_ID
curl -sS -X POST "$BASE/order" -H 'Content-Type: application/json' \
  -d "{\"tableId\":\"$TABLE_ID\",\"items\":[{\"productId\":\"$PRODUCT_ID\",\"quantity\":2,\"price\":45.5}]}"

# H. Reservation (JWT) — needs TABLE_ID + RESTAURANT_ID
curl -sS -X POST "$BASE/reservation" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"name_customer\":\"Ana Demo\",\"number_people\":2,\"time_reservation\":\"2026-08-15T19:00:00.000Z\",\"table\":\"$TABLE_ID\",\"restaurant\":\"$RESTAURANT_ID\"}"

# I. Event (JWT)
curl -sS -X POST "$BASE/event/events" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name_event":"Noche Demo","description":"Cena especial demo","date_event":"2026-09-20T20:00:00.000Z","capacity":30,"location":"Salon principal","price":75}'
# → EVENT_ID

# J. Promotion (JWT) — date window must include “now” if used on inscription
curl -sS -X POST "$BASE/event/promotions" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"name_promotion":"Promo Demo 10","description":"10 por ciento demo","discount_percentage":10,"date_start":"2026-07-01T00:00:00.000Z","date_end":"2026-12-31T23:59:59.000Z","min_people":1}'
# → PROMOTION_ID

# K. Inscription (JWT) — needs EVENT_ID; optional PROMOTION_ID
curl -sS -X POST "$BASE/event/inscriptions" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"name_customer\":\"Luis Demo\",\"email_customer\":\"luis.demo@email.com\",\"phone_customer\":\"55512345\",\"id_event\":\"$EVENT_ID\",\"number_people\":2,\"id_promotion\":\"$PROMOTION_ID\"}"
```

### Dependency graph

```
Restaurant ──┬──► Table ──┬──► Order (also needs Product)
             │            └──► Reservation
             └──► Reservation (restaurant field)

Category ──► Product ──┬──► Menu
                       └──► Order items

Event ──► Inscription ◄── Promotion (optional)
```

---

## Soft-delete / `isActive` summary

| Resource | Soft-delete | Restore | List default |
|---|---|---|---|
| restaurant | `PATCH .../delete/:id` | yes | active only |
| category | same | yes | active only (`isActive=false` to see deleted) |
| product | same | yes | active only |
| menu | same | yes | active only |
| table | same | yes | **no filter** unless query set |
| order | same | **no** | active only |
| reservation | same (+ table status side effect) | yes | active only |
| event / promotion | under `/event/.../delete/:id` | yes | `isActive=true` string check |
| inscription | delete also sets `status: cancelada` | restore → `pendiente` | same |

Health check: `GET https://ice-server-admin.onrender.com/RestauranteICE/v1/health`
