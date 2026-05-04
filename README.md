# 🛍️ Shop Microservices

> Plataforma de e-commerce completa con arquitectura de microservicios, Clean Architecture, **.NET 10**, PostgreSQL, React 19 + Tailwind CSS 4, Docker y CI/CD.

---

## 📋 Tabla de contenidos

- [Arquitectura](#-arquitectura)
- [Microservicios Backend](#-microservicios-backend)
- [Frontends](#-frontends)
- [Multi-idioma](#-multi-idioma)
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
├── shop-api/          🖥️  Microservicio Shop (.NET 10 - Clean Architecture)
├── shop-auth/         🔐  Microservicio Auth (.NET 10 - JWT + BCrypt)
├── shop-store/        🛒  Tienda online (React 19 + Vite + Tailwind)
├── shop-backoffice/   ⚙️  Panel de administración (React 19 + Vite + Tailwind)
├── sql/               🗄️  Scripts DDL + seed data
├── postman/           📮  Colecciones Postman
├── jmeter/            📈  Plan de regresión JMeter
├── .github/           🔄  CI/CD GitHub Actions
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
| **API** | Register, Login, Refresh, Validate, Revoke, Me, Seed-Admin |

### Características de IA utilizadas 🤖
| Funcionalidad | Descripción |
|---------------|-------------|
| **Validación inteligente** | FluentValidation con reglas contextuales (costo ≤ precio, tallas no duplicadas, formato email/teléfono) |
| **Auto-creación de esquema** | `EnsureCreated()` + `ALTER TABLE IF NOT EXISTS` al iniciar |
| **Soft delete** | Filtro global `IsDeleted` en todas las consultas EF Core |
| **Token validation** | JWT con validación local de clave compartida entre servicios |
| **Logging estructurado** | Serilog con salida a consola y Seq (dashboard de logs) |
| **Imágenes auto-generadas** | Fallback a picsum.photos con seed por categoría de producto |
| **Detección de idioma** | i18next con detector de navegador y persistencia en localStorage |

---

## 🛒 Frontends

### Tienda (`http://localhost:3000`)
| Página | Funcionalidad |
|--------|---------------|
| **Home** | Grid de productos con imágenes reales, filtro por categoría, buscador textual |
| **Producto** | Imagen grande, selector de talla, cantidad, carrito |
| **Carrito** | +/-, eliminar, subtotal, checkout |
| **Checkout** | Formulario de envío, creación automática de cliente |
| **Pedidos** | Lista con estados (Pending → Confirmed → Shipped → Delivered) |
| **Login/Register** | Autenticación con Auth API, dark/light mode, multi-idioma |

### Backoffice (`http://localhost:4000`)
| Página | Funcionalidad |
|--------|---------------|
| **Dashboard** | KPIs (productos, pedidos, clientes, stock bajo), gráfico circular |
| **Productos** | CRUD con modal, tallas dinámicas, campo ImageUrl, buscador |
| **Categorías** | CRUD con tarjetas, conteo de productos |
| **Clientes** | Tarjetas con datos de contacto y pedidos |
| **Pedidos** | Acordeón expandible, cambio de estado (Confirmar → Enviar → Entregar → Cancelar) |

### Logging & Monitoreo

| Herramienta | Descripción |
|-------------|-------------|
| **Seq** | Dashboard centralizado de logs estructurados en `http://localhost:8081` |
| **Serilog** | Logging estructurado en APIs .NET (consola + HTTP a Seq) |
| **Frontend Logger** | Logs del navegador enviados a Seq vía HTTP (batching cada 2s) |

Todos los logs — APIs, base de datos (EF Core SQL), y frontend — se consolidan en Seq con búsqueda y filtros en tiempo real.

---

## 🌐 Multi-idioma

| Web | 🇪🇸 ES | 🇬🇧 EN | 🇧🇷 PT | 🇫🇷 FR |
|-----|--------|--------|--------|--------|
| **Store** | ✅ | ✅ | ✅ | ✅ |
| **Backoffice** | ✅ | ✅ | ✅ | ✅ |

Framework: `react-i18next` + `i18next-browser-languagedetector`. El idioma se detecta del navegador y persiste en `localStorage`. Selector de idioma 🌐 en Navbar (Store) y Sidebar (Backoffice).

---

## 🐳 Infraestructura

| Servicio | Tecnología | Puerto |
|----------|-----------|--------|
| `shop-api` | .NET 10 ASP.NET Core | `5000` |
| `auth-api` | .NET 10 ASP.NET Core | `6001` |
| `shop-postgres` | PostgreSQL 16 Alpine | `5432` |
| `auth-postgres` | PostgreSQL 16 Alpine | `5433` |
| `seq` | Seq (log dashboard) | `8081` |

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
# Backend (.NET 10)
cd shop-api && dotnet test Shop.UnitTests/Shop.UnitTests.csproj
cd shop-auth && dotnet test Auth.UnitTests/Auth.UnitTests.csproj

# Frontend (instalar deps primero)
cd shop-store && npm install --legacy-peer-deps && npm test
cd shop-backoffice && npm install --legacy-peer-deps && npm test

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
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Registro de usuario |
| `POST` | `/api/auth/login` | ❌ | Login (access + refresh token) |
| `POST` | `/api/auth/refresh` | ❌ | Renovar access token |
| `GET` | `/api/auth/validate` | 🔑 | Validar token (Shop API) |
| `GET` | `/api/auth/me` | 🔑 | Perfil del usuario |
| `POST` | `/api/auth/revoke` | 🔑 | Revocar refresh token |
| `POST` | `/api/auth/seed-admin` | ❌ | Crear/regenerar admin |

### Shop API
| Método | Ruta | Auth |
|--------|------|------|
| `GET` | `/api/products?page=&pageSize=&categoryId=` | ❌ |
| `GET` | `/api/products/{id}` | ❌ |
| `GET` | `/api/products/low-stock?threshold=` | 🔑 |
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

# 2. Levantar infraestructura (PostgreSQL se auto-puebla con EnsureCreated)
docker compose up -d

# 3. Seed del admin (primera vez)
curl -X POST http://localhost:6001/api/auth/seed-admin

# 4. Frontends (desarrollo)
cd shop-store && npm install --legacy-peer-deps && npm run dev
cd shop-backoffice && npm install --legacy-peer-deps && npm run dev

# 5. Acceder
# 🛒 Tienda:      http://localhost:3000
# ⚙️ Backoffice:  http://localhost:4000  (admin@shop.com / Test1234!)
# 📊 Seq Logs:    http://localhost:8081
# 📖 Swagger Shop: http://localhost:5000/swagger
# 🔐 Swagger Auth: http://localhost:6001/swagger
```

---

## 🛠️ Tecnologías

| Categoría | Tecnología |
|-----------|-----------|
| **Backend** | .NET 10, ASP.NET Core, Entity Framework Core, MediatR, FluentValidation, AutoMapper, Serilog |
| **Base de datos** | PostgreSQL 16, Npgsql |
| **Auth** | JWT (Bearer), BCrypt.Net-Next, Refresh Tokens |
| **Frontend** | React 19, Vite 6, Tailwind CSS 4, React Router 7, Axios, Lucide Icons, Recharts, react-hot-toast |
| **i18n** | react-i18next, i18next-browser-languagedetector |
| **Testing** | xUnit, Moq, FluentAssertions, Vitest, Testing Library, JMeter |
| **Infraestructura** | Docker, Docker Compose, GitHub Actions |
| **Logs** | Serilog, Seq |

---

<div align="center">
  <sub>Built with ❤️ using .NET 10 & React 19</sub>
</div>
