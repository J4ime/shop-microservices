# Agent Guide — Shop Microservices

This document contains the context, conventions, and workflows that AI agents (and human developers) need to work effectively in this codebase.

---

## Project Overview

A full e-commerce platform with microservices architecture:

| Component | Tech Stack | Port |
|-----------|-----------|------|
| `shop-api` | .NET 10 (ASP.NET Core, EF Core, PostgreSQL) | `5000` |
| `auth-api` | .NET 10 (JWT, BCrypt, EF Core, PostgreSQL) | `6001` |
| `shop-store` | React 19 + Vite 6 + Tailwind CSS 4 | `3000` |
| `shop-backoffice` | React 19 + Vite 6 + Tailwind CSS 4 | `4000` |
| `seq` | Structured log dashboard (Serilog sink target) | `8081` |

---

## Repository Structure

```
shop-microservices/
├── shop-api/                 # Shop microservice (.NET 10)
│   ├── Shop.Domain/          # Entities, Enums, Value Objects, Interfaces
│   ├── Shop.Application/     # CQRS (MediatR), FluentValidation, AutoMapper, DTOs
│   ├── Shop.Infrastructure/  # EF Core + PostgreSQL, Repositories, Soft delete
│   ├── Shop.Api/             # Controllers, Middleware, Program.cs
│   └── Shop.UnitTests/       # xUnit + Moq + FluentAssertions
├── shop-auth/                # Auth microservice (.NET 10)
│   ├── Auth.Domain/          # User entity, UserRole enum
│   ├── Auth.Infrastructure/  # EF Core + PostgreSQL, BCrypt, JWT, Refresh tokens
│   ├── Auth.Api/             # Controllers, Middleware, Program.cs
│   └── Auth.UnitTests/       # xUnit + Moq + FluentAssertions
├── shop-store/               # Customer-facing storefront (React 19)
├── shop-backoffice/          # Admin panel (React 19)
├── sql/                      # DDL scripts + seed data
├── postman/                  # Postman collections
├── jmeter/                   # JMeter regression test plan
├── .github/workflows/        # GitHub Actions CI/CD
└── docker-compose.yml        # Docker orchestration
```

---

## Build & Test Commands

### Backend

```bash
# Shop API
cd shop-api
dotnet restore Shop.sln
dotnet test Shop.UnitTests/Shop.UnitTests.csproj

# Auth API
cd shop-auth
dotnet restore Shop.Auth.sln
dotnet test Auth.UnitTests/Auth.UnitTests.csproj
```

### Frontend

```bash
# Store
cd shop-store
npm install --legacy-peer-deps
npm run dev      # dev server on :3000
npm run build    # tsc -b && vite build
npm test         # vitest run

# Backoffice
cd shop-backoffice
npm install --legacy-peer-deps
npm run dev      # dev server on :4000
npm run build
npm test
```

### Docker (full stack)

```bash
# Start everything
docker compose up -d

# Rebuild a specific service
docker compose build shop-api
docker compose up -d shop-api

# View logs
docker logs -f shop-api
docker logs -f auth-api
docker logs -f seq
```

---

## Coding Conventions

### .NET Backend

- **Target framework:** `net10.0`
- **Nullable:** enabled
- **Implicit usings:** enabled
- **Architecture:** Clean Architecture (Domain -> Application -> Infrastructure -> Api)
- **CQRS:** Commands and Queries in separate folders under `Application/`
- **DTOs:** One file per DTO, named `{Entity}{Action}Request/Response`
- **Validation:** FluentValidation rules in `Application/Validators/`
- **Soft delete:** Global query filter `IsDeleted == false` on all EF entities
- **API responses:** Always return `{ success: bool, data: T }` wrapper

### React Frontend

- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **No tailwind.config.js** — uses CSS-only configuration via `@import "tailwindcss"`
- **Icons:** Lucide React (`lucide-react`)
- **Components:** Functional components, hooks in `src/hooks/`, contexts in `src/context/`
- **API calls:** Axios instances in `src/services/api.ts`
- **Logging:** Custom batching logger in `src/services/logger.ts` (sends to Seq)
- **i18n:** Custom i18n shim (`src/i18n.ts`) with `react-i18next` + browser detector
  - Translation keys use snake_case with double underscores: `nav__store`, `login__title`
  - Languages: ES, EN, PT, FR

### Commit Messages

Follow conventional commits:

```
feat: add product search by SKU
fix: resolve JWT validation timeout
style: update dark mode toggle colors
refactor: extract order status logic to hook
test: add cart context edge cases
docs: update API endpoint table
```

---

## Logging & Observability

### Seq Structured Logging

All services send logs to Seq (`http://localhost:8081`).

**Backend (.NET):**
- Uses Serilog with a **custom `SeqHttpSink`** defined in `Program.cs`
- **Important:** The sink must use `PostAsync` with `StringContent` + synchronous await (`.GetAwaiter().GetResult()`). Do NOT use `PostAsJsonAsync` inside `Emit()` — it causes 400 Bad Request in .NET 10 preview images due to chunked encoding issues with Seq.
- Environment variable: `SEQ_URL=http://seq:5341`
- Service property is enriched: `"service": "shop-api"` or `"auth-api"`

**Frontend (React):**
- Custom batching logger (`src/services/logger.ts`)
- Batches up to 20 log entries, flushes every 2 seconds
- Sends `POST` to `http://localhost:5341/api/events/raw`
- CORS is enabled by Seq by default

### Checking Logs

```bash
# Seq dashboard
open http://localhost:8081

# Query via API
curl "http://localhost:8081/api/events/signal?filter=service%20%3D%3D%20%27shop-api%27&count=10"
```

---

## Docker & Environment

### Network

Docker Compose creates network `shop_shop-network` (prefixed with project folder name).

### Environment Variables (docker-compose.yml)

| Service | Key | Value |
|---------|-----|-------|
| `shop-api` | `SEQ_URL` | `http://seq:5341` |
| `auth-api` | `SEQ_URL` | `http://seq:5341` |
| `auth-api` | `Jwt__Key` | `AuthDefaultKey1234567890!@#$%^&*()` |
| `shop-api` | `AuthService__ValidationUrl` | `http://auth-api:8080/api/auth/validate` |

### Database Auto-Setup

- **Auth API:** Uses `EnsureCreated()` on startup (creates schema + tables)
- **Shop API:** Uses `Migrate()` on startup (applies EF Core migrations)
- **Seed admin:** `curl -X POST http://localhost:6001/api/auth/seed-admin`
  - Default admin: `admin@shop.com` / `Test1234!`

---

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`):

| Job | Trigger | Working Dir |
|-----|---------|-------------|
| `backend-tests` | Push/PR to `main` | `shop-api`, then `shop-auth` |
| `frontend-store-tests` | Push/PR to `main` | `shop-store` |
| `frontend-backoffice-tests` | Push/PR to `main` | `shop-backoffice` |
| `frontend-builds` | After tests pass | `shop-store`, `shop-backoffice` |

**Notes:**
- .NET version: `10.0.x`
- Node version: `22`
- Install frontend deps with `--legacy-peer-deps`
- Backend paths filter: `shop-api/**`, `shop-auth/**`
- Frontend paths filter: `shop-store/src/**`, `shop-backoffice/src/**`

---

## Common Issues & Fixes

### SeqHttpSink 400 Bad Request
**Symptom:** Logs not appearing in Seq from .NET containers.
**Cause:** `PostAsJsonAsync` in `SeqHttpSink.Emit()` sends chunked JSON that Seq rejects.
**Fix:** Use `StringContent` with `JsonSerializer.Serialize` + synchronous `PostAsync(...).GetAwaiter().GetResult()`.

### Frontend build fails with `tsc -b`
**Symptom:** `error TS2307: Cannot find module ...`
**Cause:** TypeScript project references require building referenced projects first.
**Fix:** Run `tsc -b` (already in `npm run build`).

### React i18n key not found
**Symptom:** Key displayed literally instead of translated text.
**Cause:** Missing key in one of the 4 language objects in `src/i18n.ts`.
**Fix:** Add the key to all 4 language blocks (ES, EN, PT, FR).

### Docker network not found
**Symptom:** `network shop-network not found`
**Cause:** Docker Compose prefixes network with project directory name.
**Fix:** Use `shop_shop-network` when running `docker run --network ...`.

---

## Key Architectural Decisions

1. **No separate API Gateway** — Shop API calls Auth API directly for JWT validation.
2. **Shared JWT secret** — Both APIs use the same `Jwt:Key` (simpler for this scale).
3. **CQRS with MediatR** — All business logic flows through commands/queries.
4. **Custom i18n shim** — Instead of `i18next.init()`, uses a React context + hook pattern for simpler language switching.
5. **Custom SeqHttpSink** — Instead of `Serilog.Sinks.Seq` package, uses a lightweight inline sink to avoid extra dependencies.
6. **No Redux/Zustand** — State managed via React Context + `useState` (Cart, Auth, Theme).
7. **Dark/Light mode** — Tailwind CSS `dark:` variants + `dark` class on root element.

---

## License & Attribution

- Backend: .NET 10 (preview) — some packages reference .NET 9 for compatibility
- Frontend: React 19, Tailwind CSS 4
- Icons: [Lucide](https://lucide.dev)
- Product images: [Picsum Photos](https://picsum.photos) (auto-generated fallback)
