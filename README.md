# Restaurante_ICE
Restaurante_ICE es un sistema completo para gestionar un restaurante con microservicios en ASP.NET core y base de datos PostgreSQL.

# 📌 Índice
1. 📖 Descripción General
2. 🎯 Objetivos del Proyecto
3. 🛠️ Stack Tecnológico
4. 🔐 Funcionalidades Principales
5. 🧩 Arquitectura del Sistema
6. 🧱 Microservicios Propuestos
7. 🔄 Metodología de Trabajo (SCRUM)
8. 👥 Equipo de Trabajo
9. 📌 Conclusión

# 📖Descripción General
El sistema de gestión de restaurantes, es una plataforma web empresarial diseñada en optimizar y agilizar las operaciones de múltiples restaurantes.

El sistema permite administrar restaurante, menús digitales, mesas, pedidos, reservaciones, eventos y reportes estadísticos, utilizando una arquitectura de microservicios y tecnologías modernas a nivel empresarial.

# 🎯Objetivos del proyecto
* Administrar un restaurante desde sola una plataforma.
* Digitalizar menús, pedidos y reservaciones.
* Optimizar la gestión de mesas y atención al cliente.
* Proporcionar reportes y estadísticas para tomar decisiones a largo plazo.
* Implementar un sistema seguro de autenticación y roles.

# 🛠️ Stack Tecnológico
## Backend
* ASP.NET Core 8.0
* JWT (JSON Web Token)
* Swagger 
* C#
* Node.Js

## Base de Datos
* PostgreSQL
* MongoDB

## Infraestructura
* Docker Desktop
* Docker

## Gestión y Control
* GitHub 
* Trello
* Postman
* pgAdmin 4

# 🔐Funcionalidades Principales
- Auntenticación y Roles
* Registro e inicio de sesión
* Autenticación con JWT
* Gestión de roles:
    - Administrador

- Gestión de Restaurante
* Administración de restaurante
* Información general, ubicación y horarios
* Disponibilidad en tiempo real

- Gestión de Mesas
* Registro de mesas 
* Estados: disponible, ocupada, reservada

- Sistema de pedidos
* Pedidos de comidas
* Seguimiento del pedido

- Reservaciones
* Reservación de mesas
* Ver si hay mesas disponibles
* Confirmación de reservación

- Eventos
* Crear y administrar eventos
* Promociones y actividades especiales

- Reportes y Estadísticas
* Ver las ventas por períodos
* Productos más vendidos
* Ocupación de mesas
* Rendimiento en el restaurante

# 🧩Arquitectura del Sistema
El proyecyo usa una arquitetura de microservicios 
* Domain 
* Application
* Persistence
* API

## Justificación 
* Escabilidad independiente
* Desarrollo paralelo
* Fallas aisladas
* Despliegue independiente
* Responsabilidad por servicio

# 🧱Microservicios Propuestos
** Auth Service ** Usuarios, roles, JWT
** Restaurant Service** CRUD restaurantes, ubicaciones
** Menu Service** Menús, categorías, productos
** Table Service** Gestión de mesas, estados
** Order Service** Pedidos, integración mesas
** Reservation Service** Reservas, confirmaciones
** Event Service** Eventos, inscripciones
** Analitics Service** Reportes, estadísticas

# 🔄Metodología SCRUM
* Duración total: 24 semanas
* Sprints: 8
* Duración por Sprint: 3 semanas
## Ceremonias SCRUM
* Sprint Planning
* Daily Scrum
* Sprint Review
* Sprint Retrospective

# 👥Equipo de Trabajo
## Product Owner
* Carlos López Quino
## Scrum Master
* Carlos Emilio Navarro Sifontes
## Development Team
* Kenet Efrain Kuyuch Joj
* Rigoberto Godinez Fajardo
* Carlos Alejandro Patal Choc

# 📌Conclusión 
Este proyecto representa una implementación completa de un sistema empresarial moderno, aplicando metodología ágil, arquitectura escalable y tecnologías actuales.

El enfoque en microservicios, SCRUM y buenas prácticas garantiza un producto mantenible, extensible y alineado con estándares profesionales.