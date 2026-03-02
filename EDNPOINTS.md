## 🔐 Autenticación

### Iniciar Sesión

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| POST | `/api/v1/auth/login` | Iniciar sesión | `{ email, password }` |

{\
  "email": "admin@restaurante.com",\
  "password": "123456"\
}

### Registrarse

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| POST | `/api/v1/auth/register` | Registrar usuario | `{ name, Surname, Username, Email, Password, Phone, ProfilePicture }` |

{\
  "name": "Juan",\
  "surname": "Pérez",\
  "username": "juanperez",\
  "email": "juan@email.com",\
  "password": "123456",\
  "phone": "55512345",\
  "profilePicture": "https://imagen.com/perfil.jpg"\
}

### Verificar usuario
| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| POST | `/api/v1/auth/verify-email` | Vefiricar usuario | `{ id, { isActive: true }` |

{\
  "token":"El token que se recibio"\
}

## 📊Análisis

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/analytics` | Lista los análisis | `{ metricName, value, type, description, isActive, timestamps }` |
| POST | `/RestauranteICE/v1/analytics` | Crear un análisis | `{ metricName, value, type, description, isActive, timestamps }` |

{\
  "metricName": "Clientes Atendidos",\
  "value": 45,\
  "type": "OPERATIVO",\
  "description": "Clientes del día",\
}

| PUT | `/RestauranteICE/v1/analytics/:id` | Actualizar análisis | `{ metricName, value, type, description, isActive, timestamps }` |

{\
  "metricName": "Ventas Mensuales",\
  "value": 25000,\
  "type": "FINANCIERO",\
  "description": "Ventas del mes",\
}

| PATCH | `/RestauranteICE/v1/analytics/delete/:id` | Hacer un softdelete | `id, { isActive: false }, { new: true }` |

| PATCH | `/RestauranteICE/v1/analytics/restore/:id` | Restaurar el análisis | `id, { isActive: true }, { new: true }` |

## 🗂️Categorias

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/category` | Lista categorias | `{ categoryName, type, description, isActive }` |
| POST | `/RestauranteICE/v1/category` | Crear categoria | `{ categoryName, type, description, isActive }` |

{\
  "categoryName": "Bebidas",\
  "type": "PRODUCTO",\
  "description": "Bebidas frías y calientes",\
}

| PATCH | `/RestauranteICE/v1/category/delete/:id` | Hacer un softdelete | `{ id, { isActive: false }, { new: true } }` |

| PATCH | `/RestauranteICE/v1/category/restore/:id` | Restaurar la categoria | `{ id, { isActive: true }, { new: true } }` |


## 🎉Eventos

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/event/events` | Listar eventos| `{ name_event, description, date_event,capacity, location, price, isActive, timestamps }` |
| POST | `/RestauranteICE/v1/event/events` | Crear eventos | `{ name_event, description, date_event,capacity, location, price, isActive, timestamps }` |

{\
  "name_event": "Noche Italiana",\
  "description": "Cena temática",\
  "date_event": "2026-05-10",\
  "capacity": 50,\
  "location": "Restaurante Central",\
  "price": 120,\
}

| PATCH | `/RestauranteICE/v1/event/events/delete/:id` | Hacer softdelete al evento | `{ id, { isActive: false }` |

| PATCH | `/RestauranteICE/v1/event/events/restore/:id` | Restaurar el evento | `{ id, { isActive: true }` |

### 📝Inscripciones
| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/event/inscriptions` | Listar las incripciones | `{  name_customer, email_customer, phone_customer, id_event, number_people, id_promotion, total_price, status, isActive, timestamps }` |
| POST | `/RestauranteICE/v1/event/inscriptions` | Crear una inscripción | `{ nombre, email, password, rol }` |

{\
  "name_customer": "María López",\
  "email_customer": "maria@email.com",\
  "phone_customer": "55512345",\
  "id_event": "event123",\
  "number_people": 4,\
  "total_price": 480,\
  "status": "confirmada",\
}

| PATCH | `/RestauranteICE/v1/event/inscriptions/delete/:id` | Hacer un softdelete a la inscripción | `{ id, { isActive: false }` |

| PATCH | `/RestauranteICE/v1/event/inscriptions/restore/:id` | Restaurar la inscipción | `{ id, { isActive: true }` |

### 🎁Promociones
| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/event/promotions` | Listas las promociones | `{ name_promotion, description, discount_percentage, date_start, date_end, min_people, isActive, timestamps }` |
| POST | `/RestauranteICE/v1/event/promotions` | Crear promociones | `{ name_promotion, description, discount_percentage, date_start, date_end, min_people, isActive, timestamps }` |

{\
  "name_promotion": "Descuento Familiar",\
  "description": "10% para grupos",\
  "discount_percentage": 10,\
  "date_start": "2026-05-01",\
  "date_end": "2026-05-31",\
  "min_people": 4,\
}

| PATCH | `/RestauranteICE/v1/event/promotions/delete/:id` | Hacer softdelete a la promoción | `{ id, { isActive: false }` |

| PATCH | `/RestauranteICE/v1/event/promotions/restore/:id` | Restaurar la promoción | `{ id, { isActive: true }` |

## 🛒Ordenes

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/order` | Listar las ordenes | `{ tableId, items, totalAmount, status, isActive, timestamps }` |
| POST | `/RestauranteICE/v1/order` | Crear una nueva orden | `{ tableId, items, totalAmount, status, isActive, timestamps }` |

{\
  "tableId": "mesa12",\
  "items": [
    {\
      "productId": "prod01",\
      "quantity": 2\
    }
  ],
  "totalAmount": 120,\
}

| PUT | `/RestauranteICE/v1/order/:id` | Actualizar la orden | `{ tableId, items, totalAmount, status, isActive, timestamps }` |

{\
  "status": "PAGADA"\
}

| DELETE | `/RestauranteICE/v1/order/:id` | Hacer un softdelete de la orden | `{ id, { isActive: false }` |

## 📦Productos

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/product` | Listar los productos | `{ saucer, description, price, photo,  }` |

| POST | `/RestauranteICE/v1/product` | Crear un producto | `{ nombre, email, password, rol }` |

{\
  "saucer": "Pizza Pepperoni",\
  "description": "Pizza con pepperoni y queso mozzarella",\
  "price": 60,\
  "photo": ""\
}

| PATCH | `/RestauranteICE/v1/product/delete/:id` | Hacer un softdelete al producto | `{ id, { isActive: false }` |

| PATCH | `/RestauranteICE/v1/product/restore/:id` | Restaurar el producto | `{ id, { isActive: true }` |

## 📅Reservaciones

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/reservations` | Listar reservaciones | `{ name_customer, number_people,  number_people, isActive, timestamps }` |

| POST | `/RestauranteICE/v1/reservations` | Crear una reservación | `{ name_customer, number_people,  number_people, isActive, timestamps }` |

{\
  "name_customer": "Carlos Gómez",\
  "number_people": 5,\
}

| PATCH | `/RestauranteICE/v1/reservations/delete/:id` | Hacer softdelete a la reservación | `{ id, { isActive: false }` |

| PATCH | `/RestauranteICE/v1/reservations/restore/:id` | Restaurar la reservación | `{ id, { isActive: true }` |

## 🏬Restaurantes

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/restaurant` | Listar los restaurantes | `{ name, address, phone, openingHours, description, photo, isActive, timestamps }` |

| POST | `/RestauranteICE/v1/restaurant` | Crear un restaurante | `{ name, address, phone, openingHours, description, photo, isActive, timestamps }` |

{\
  "name": "Restaurante ICE Central",\
  "address": "Zona 1",\
  "phone": "55567890",\
  "openingHours": "8:00 - 22:00",\
  "description": "Sucursal principal",\
}

| PUT | `/RestauranteICE/v1/restaurant/:id` | Actualizar datos del restaurante | `{ name, address, phone, openingHours, description, photo }` |

| DELETE | `/RestauranteICE/v1/restaurant/:id` | Hacer softdelete del restaurante | `{ id, { isActive: false }` |

## 🪑Mesas

| Método | Endpoint | Descripción | Body |
|------|---------|------------|------|
| GET | `/RestauranteICE/v1/table` | Listar las mesas | `{ number, capacity, isActive, status, timestamps }` |

| GET | `/RestauranteICE/v1/table/:id` | Buscar mesa por id | `{ number, capacity, isActive, status, timestamps }` |
| POST | `/RestauranteICE/v1/table` | Crear mesa | `{ id, { number, capacity, isActive, status, timestamps }` |

{\
  "number": 10,\
  "capacity": 4,\
}

| PUT | `/RestauranteICE/v1/table/:id` | Actualizar mesa | `{ number, capacity, isActive, status, timestamps }` |

{\
  "capacity": 6,\
  "status": "ocupada"\
}

| DELETE | `/RestauranteICE/v1/table/:id` | Hacer softdelete de la mesa | `{ id, { isActive: false }` |

| PATCH | `/RestauranteICE/v1/table/:id` | Restaurar la mesa | `{ id, { isActive: true }` |