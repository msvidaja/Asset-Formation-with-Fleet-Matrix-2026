# AssetFlow — Fleet Matrix 2026

**Enterprise Asset & Resource Management System.** AssetFlow gives you every asset,
every depot, on one screen — a live operations dashboard for deploying fleet units,
tracking maintenance, and monitoring utilization across your organization.

The project is a full-stack application: a **Spring Boot** REST API backed by
**PostgreSQL**, and a **Next.js** dashboard that renders it.

---

## Architecture

```
┌─────────────────────────┐        ┌──────────────────────────┐        ┌──────────────┐
│  assetflow-frontend      │  BFF   │  backend (Spring Boot)    │  JPA   │  PostgreSQL  │
│  Next.js 16 · React 19   │ ─────► │  REST + JWT auth          │ ─────► │  assetflow   │
│  Server Components (BFF) │  HTTP  │  Fleet CRUD · Dashboard   │        │              │
└─────────────────────────┘        └──────────────────────────┘        └──────────────┘
```

The frontend talks to the backend server-side (a backend-for-frontend pattern), so API
credentials never reach the browser. If the backend is unreachable, the dashboard falls
back to static demo data and shows a "demo data" banner — so the UI always renders.

---

## Backend (`backend/`)

Spring Boot 3.5 / Java 17, layered into `controller`, `service`, `repository`, `model`,
`dto`, `config`, and `security` packages under `com.example.asset`.

### Features

- **Authentication (JWT, stateless).** `POST /api/auth/register` and `POST /api/auth/login`
  return `{ token, username, name, role }`. Passwords are BCrypt-hashed. Backed by
  `JwtAuthenticationFilter` + `JwtService` (JJWT 0.12.x). Roles: `USER`, `ADMIN`.
- **Fleet CRUD.** `/api/fleet` — `GET` is open to any authenticated user; `POST`/`PUT`/`DELETE`
  require `ROLE_ADMIN` (enforced via `@PreAuthorize`). A `FleetUnit` has
  `code`, `name`, `depot`, `category`, `status`, and `utilization`.
- **Dashboard.** `GET /api/dashboard/summary` (public) derives KPIs and per-category counts
  from fleet data.
- **User management.** `/api/users/**` is ADMIN-only; accounts are created only via register.
- **Seeding.** On first run against empty tables, `DataSeeder` creates an admin account
  (`admin` / `admin123`) and 6 demo fleet units.

### Configuration

Configured via environment variables (see `backend/src/main/resources/application.properties`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `assetflow` | Database name |
| `DB_USER` | `postgres` | DB username |
| `DB_PASSWORD` | `postgres` | DB password |
| `SERVER_PORT` | `8080` | API port |
| `JWT_SECRET` | *(dev placeholder)* | **Override in production** with a long random value |
| `JWT_EXPIRATION_MS` | `86400000` | Token lifetime (24h) |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed frontend origin |

### Running

Requires **JDK 17** and a running **PostgreSQL** instance with a database named `assetflow`.

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

Build a jar:

```bash
./mvnw clean package
java -jar target/asset-0.0.1-SNAPSHOT.jar
```

Tests run against an in-memory **H2** database (no live Postgres needed):

```bash
./mvnw test
```

---

## Frontend (`assetflow-frontend/`)

Next.js 16 (App Router) with React 19 and Tailwind CSS v4. The dashboard page is an async
Server Component that pulls live data through `app/lib/api.ts`.

### Dashboard

- Hero + KPI stat tiles (`StatTile`)
- Fleet uptime chart (`UptimeChart`)
- Assets-by-category bars (`CategoryBars`)
- Active fleet table (`FleetTable`)
- Automatic "demo data" banner when the backend is down

### Configuration

Copy `.env.example` to `.env.local`. All values are server-only (no `NEXT_PUBLIC_`), so
credentials never ship to the browser:

| Variable | Default | Purpose |
| --- | --- | --- |
| `API_BASE_URL` | `http://localhost:8080` | Backend API base URL |
| `ASSETFLOW_API_USER` | `admin` | Account used server-side to read `/api/fleet` |
| `ASSETFLOW_API_PASSWORD` | `admin123` | Password for that account |

### Running

Requires **Node.js 20+**.

```bash
cd assetflow-frontend
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

---

## Quick start

1. Start PostgreSQL and create a database named `assetflow`.
2. Start the backend: `cd backend && ./mvnw spring-boot:run` (seeds `admin` / `admin123`).
3. Start the frontend: `cd assetflow-frontend && npm install && npm run dev`.
4. Open <http://localhost:3000>.

> Don't have Postgres yet? Start just the frontend — it renders with demo data and a banner
> until the backend comes online.

---

## Repository helper scripts

Two PowerShell scripts commit and sync work to the remote at regular intervals:

- `Master.ps1` — add, commit, pull, and push against `main`.
- `CarbonCopy.ps1` — the same flow against the `CarbonCopy` branch.

```powershell
powershell -ExecutionPolicy Bypass -File Master.ps1
```

---

## License

See [LICENSE](LICENSE).
