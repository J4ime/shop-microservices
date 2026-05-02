# 🛍️ Shop Microservices

> Plataforma de e-commerce completa con arquitectura de microservicios, Clean Architecture, .NET 9, PostgreSQL, React + Tailwind CSS, Docker y CI/CD.

---

## 📋 Tabla de contenidos

- [Arquitectura](#-arquitectura)
- [Microservicios Backend](#-microservicios-backend)
- [Frontends](#-frontends)
- [Infraestructura](#-infraestructura)
- [Tests](#-tests)
- [CI/CD](#-cicd)
- [Endpoints API](#-endpoints-api)
- [Instalación](#-instalación)
- [Tecnologías](#-tecnologías)

---

## 🏗️ Arquitectura

```
shop-microservices/
├── shop-api/          🖥️  Microservicio Shop (.NET 9 - Clean Architecture)
├── shop-auth/         🔐  Microservicio Auth (.NET 9 - JWT + BCrypt)
├── shop-store/        🛒  Tienda online (React + Vite + Tailwind CSS)
├── shop-backoffice/   ⚙️  Panel de administración (React + Vite + Tailwind)
├── shop-logs/         📊  Portal de logs en tiempo real (Express + WebSocket)
├── sql/               🗄️  Scripts DDL + seed data
├── postman/           📮  Colecciones Postman
├── jmeter/            📈  Plan de regresión JMeter
└── docker-compose.yml 🐳  Orquestación de contenedores
```

---

## 🖥️ Microservicios Backend

### Shop API (`:5000`)
| Capa | Descripción |
|------|-------------|
| **Domain** | Entidades (Product, Category, Customer, Order, OrderItem, ProductSize), Enums, Value Objects, Interfaces |
| **Application** | CQRS con MediatR, FluentValidation, AutoMapper, DTOs separados por archivo |
| **Infrastructure** | EF Core + PostgreSQL, repositorios genéricos, soft delete, token validation |
| **API** | Controllers REST, global error handling, CORS, Swagger, autenticación JWT |

### Auth API (`:6001`)
| Capa | Descripción |
|------|-------------|
| **Domain** | User entity, UserRole enum, excepciones de autenticación |
| **Infrastructure** | EF Core + PostgreSQL, BCrypt hashing, JWT generation/validation, refresh tokens |
| **API** | Register, Login, Refresh, Validate, Revoke, Me, seed-admin |

### Características de IA utilizadas 🤖
| Funcionalidad | Descripción |
|---------------|-------------|
| **Validación inteligente** | FluentValidation con reglas contextuales (costo ≤ precio, tallas no duplicadas) |
| **Auto-creación de esquema** | `EnsureCreated()` + migraciones automáticas al iniciar |
| **Soft delete** | Filtro global `IsDeleted` en todas las consultas |
| **Token validation** | JWT con validación local de clave compartida entre servicios |
| **Logging estructurado** | Serilog con salida a consola con timestamp y nivel |

---

## 🛒 Frontends

### Tienda (`http://localhost:3000`)
| Página | Funcionalidad |
|--------|---------------|
| **Home** | Grid de productos con imágenes, filtro por categoría, buscador |
| **Producto** | Imagen grande, selector de talla, cantidad, carrito |
| **Carrito** | +/-, eliminar, subtotal, checkout |
| **Checkout** | Formulario de envío, creación automática de cliente |
| **Pedidos** | Lista con estados (Pendiente → Entregado) |
| **Login/Register** | Autenticación con Auth API, dark/light mode |

### Backoffice (`http://localhost:4000`)
| Página | Funcionalidad |
|--------|---------------|
| **Dashboard** | KPIs (productos, pedidos, clientes, stock bajo), gráfico circular |
| **Productos** | CRUD con modal, tallas dinámicas, campo ImageUrl, buscador |
| **Categorías** | CRUD con tarjetas, conteo de productos |
| **Clientes** | Tarjetas con datos de contacto y pedidos |
| **Pedidos** | Acordeón expandible, cambio de estado (Confirmar → Enviar → Entregar → Cancelar) |

### Portal de Logs (`http://localhost:7000`)
| Funcionalidad | Descripción |
|---------------|-------------|
| **Streaming live** | WebSocket con Docker socket para logs en tiempo real |
| **Filtro por nivel** | ERROR, WARN, INFO, HTTP, SQL, DEBUG |
| **Buscador** | Filtra líneas por contenido textual |
| **Selector de servicio** | Shop API, Auth API, Shop DB, Auth DB |
| **Badges** | Colores por nivel de log |

---

## 🐳 Infraestructura

| Servicio | Tecnología | Puerto |
|----------|-----------|--------|
| `shop-api` | .NET 9 ASP.NET Core | `5000` |
| `auth-api` | .NET 9 ASP.NET Core | `6001` |
| `shop-postgres` | PostgreSQL 16 | `5432` |
| `auth-postgres` | PostgreSQL 16 | `5433` |
| `shop-logs` | Node.js + Express + WebSocket | `7000` |

---

## 🧪 Tests

| Tipo | Framework | Tests | Cobertura |
|------|-----------|-------|-----------|
| **Unit Tests Shop** | xUnit + Moq + FluentAssertions | 108 | Domain, Application, Infrastructure, API |
| **Unit Tests Auth** | xUnit + Moq + FluentAssertions | 33 | Domain, Infrastructure, API |
| **Store Frontend** | Vitest + Testing Library | Componentes, CartContext, búsqueda |
| **Backoffice Frontend** | Vitest + Testing Library | Componentes, filtros, estadísticas |
| **Regresión** | JMeter | 5 grupos de hilos, assertions HTTP |

### Ejecutar tests

```bash
# Backend
cd shop-api && dotnet test Shop.UnitTests/Shop.UnitTests.csproj
cd shop-auth && dotnet test Auth.UnitTests/Auth.UnitTests.csproj

# Frontend
cd shop-store && npm test
cd shop-backoffice && npm test

# Regresión (requiere JMeter)
jmeter -n -t jmeter/shop-regression-test.jmx -l results.jtl
```

---

## 🔄 CI/CD

GitHub Actions ejecuta automáticamente en cada push/PR a `main`:

| Job | Descripción |
|-----|-------------|
| `backend-tests` | Ejecuta tests xUnit de Shop y Auth |
| `frontend-store-tests` | Ejecuta Vitest del Store |
| `frontend-backoffice-tests` | Ejecuta Vitest del Backoffice |
| `frontend-builds` | Verifica que ambos frontends compilan |

---

## 📡 Endpoints API

### Auth API
| Método | Ruta | Auth |
|--------|------|------|
| `POST` | `/api/auth/register` | ❌ |
| `POST` | `/api/auth/login` | ❌ |
| `POST` | `/api/auth/refresh` | ❌ |
| `GET` | `/api/auth/validate` | 🔑 |
| `GET` | `/api/auth/me` | 🔑 |
| `POST` | `/api/auth/revoke` | 🔑 |

### Shop API
| Método | Ruta | Auth |
|--------|------|------|
| `GET` | `/api/products` | ❌ |
| `GET` | `/api/products/{id}` | ❌ |
| `GET` | `/api/products/low-stock` | 🔑 |
| `POST` | `/api/products` | 🔑 |
| `PUT` | `/api/products/{id}` | 🔑 |
| `DELETE` | `/api/products/{id}` | 🔑 |
| `GET/POST/PUT/DELETE` | `/api/categories` | GET ❌, resto 🔑 |
| `GET/POST/PUT/DELETE` | `/api/customers` | POST ❌, resto 🔑 |
| `CRUD` | `/api/orders` | 🔑 |
| `PATCH` | `/api/orders/{id}/status` | 🔑 |
| `POST` | `/api/orders/{id}/cancel` | 🔑 |

---

## 🚀 Instalación

```bash
# 1. Clonar
git clone https://github.com/J4ime/shop-microservices.git
cd shop-microservices

# 2. Levantar infraestructura
docker compose up -d

# 3. Seed de la base de datos (primera vez)
docker exec -i auth-postgres psql -U shopuser -d authdb < sql/01-create-tables.sql
docker exec -i shop-postgres psql -U shopuser -d shopdb < sql/01-create-tables.sql
docker exec -i auth-postgres psql -U shopuser -d authdb < sql/02-seed-data.sql
docker exec -i shop-postgres psql -U shopuser -d shopdb < sql/02-seed-data.sql

# O llamar al endpoint de seed:
curl -X POST http://localhost:6001/api/auth/seed-admin

# 4. Frontends (desarrollo)
cd shop-store && npm install && npm run dev
cd shop-backoffice && npm install && npm run dev

# 5. Acceder
# Tienda:     http://localhost:3000
# Backoffice: http://localhost:4000  (admin@shop.com / Test1234!)
# Logs:       http://localhost:7000
# Swagger:    http://localhost:5000/swagger
# Auth:       http://localhost:6001/swagger
```

---

## 🛠️ Tecnologías

| Categoría | Tecnología |
|-----------|-----------|
| **Backend** | .NET 9, ASP.NET Core, Entity Framework Core, MediatR, FluentValidation, AutoMapper, Serilog |
| **Base de datos** | PostgreSQL 16, Npgsql |
| **Auth** | JWT (Bearer), BCrypt.Net-Next, Refresh Tokens |
| **Frontend** | React 19, Vite 6, Tailwind CSS 4, React Router 7, Axios, Lucide Icons, Recharts, react-hot-toast |
| **Testing** | xUnit, Moq, FluentAssertions, Vitest, Testing Library, JMeter |
| **Infraestructura** | Docker, Docker Compose, GitHub Actions |
| **Logs** | Serilog, Express, WebSocket, Dockerode |

---

<div align="center">
  <sub>Built with ❤️ using .NET 9 & React 19</sub>
</div>
