# Airsline — CLAUDE.md

Car rental booking platform for the Algerian diaspora. Allows travellers returning to Algeria to pre-book a car at one of 7 airports before landing. Admin-only panel in v1 — no client-facing auth, no payment integration yet.

---

## How to start

From the **root** `aireline/` folder:

```bash
npm run dev
```

This starts both servers via `concurrently`:
- **API** → `http://localhost:3000`
- **Frontend** → `http://localhost:5173`

Admin login: `admin@airsline.dz` / `admin123`

---

## Project structure

```
aireline/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # DB models
│   │   ├── seed.ts              # Admin user + 7 airports
│   │   └── migrations/
│   ├── src/
│   │   ├── index.ts             # Express entry point
│   │   ├── lib/prisma.ts        # Prisma client singleton
│   │   ├── middleware/auth.ts   # JWT guard (requireAuth)
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── controllers/         # Route handlers
│   │   └── routes/              # Express routers
│   ├── .env                     # DATABASE_URL, JWT_SECRET, PORT
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── main.tsx             # QueryClientProvider entry
    │   ├── App.tsx              # Router + AdminLayout + ProtectedRoute
    │   ├── index.css            # Tailwind v4 + shadcn theme
    │   ├── api/                 # Axios instance + API functions
    │   ├── store/               # Zustand stores
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── cars/
    │   │   │   ├── CarsPage.tsx   # Table + delete dialog
    │   │   │   └── CarForm.tsx    # Create/edit modal
    │   │   └── reservations/
    │   │       └── ReservationsPage.tsx  # Table + status management
    │   └── components/ui/       # shadcn components
    ├── vite.config.ts           # Tailwind plugin + /api proxy to :3000
    └── tsconfig.app.json        # Includes @/* path alias
```

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS v4, shadcn/ui |
| State | Zustand (auth), TanStack Query (server state) |
| HTTP | Axios with JWT interceptor (`src/api/axios.ts`) |
| Routing | React Router v6 |
| Backend | Node.js + Express 5 + TypeScript |
| Validation | Zod |
| ORM | Prisma |
| Database | PostgreSQL (local, no password) |
| Auth | JWT (7d expiry), bcryptjs for password hashing |

---

## Database

Local PostgreSQL — no password.

```
DATABASE_URL="postgresql://postgres@localhost:5432/airsline?schema=public"
```

### Schema

```
User       — id, email, password, role (ADMIN)
Airport    — id, name, city, code (IATA)
Car        — id, brand, model, year, pricePerDay, transmission, fuel,
             seats, photos[], isAvailable, airportId
Reservation — id, clientName, clientEmail, clientPhone, carId,
              startDate, endDate, totalPrice, protection, status, createdAt
```

**Enums:**
- `Transmission`: MANUAL | AUTOMATIC
- `Fuel`: ESSENCE | DIESEL | ELECTRIQUE
- `Protection`: BASIC | NONE
- `ReservationStatus`: PENDING | CONFIRMED | RETURNED | CANCELLED

**Seeded airports (7):** ALG, CZL, ORN, AAE, BJA, BUJ, TEE

To reset and reseed:
```bash
cd backend
npx prisma migrate dev --name <name>
npm run seed
```

---

## API routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Returns JWT token |
| GET | `/api/airports` | — | List all airports |
| GET | `/api/cars` | — | List cars (optional `?airportId=`) |
| GET | `/api/cars/:id` | — | Car detail |
| POST | `/api/cars` | JWT | Create car |
| PUT | `/api/cars/:id` | JWT | Update car |
| DELETE | `/api/cars/:id` | JWT | Delete car |
| GET | `/api/reservations` | JWT | List reservations (optional `?status=`) |
| GET | `/api/reservations/:id` | JWT | Reservation detail |
| POST | `/api/reservations` | — | Create reservation (public, for clients) |
| PATCH | `/api/reservations/:id/status` | JWT | Update status |

**Price formula:** `days × pricePerDay + (protection === BASIC ? days × 500 : 0)` DZD

**Double-booking protection:** `createReservation` checks for overlapping PENDING/CONFIRMED reservations before inserting.

---

## What's built

- [x] JWT login page (shadcn Card/Input/Button)
- [x] Protected admin layout with sidebar navigation
- [x] Car management — CRUD table, create/edit modal, delete confirmation
- [x] Reservation management — status tabs, table, detail dialog, status lifecycle actions
- [x] Airport dropdown populated from DB in car form

---

## What's next (scope backlog)

- [ ] F04/F05 — Car availability search (filter by airport + date range, exclude booked cars)
- [ ] F06 — Public car detail page
- [ ] Notifications (email/SMS) on reservation create/confirm
- [ ] Dashboard with stats (total cars, pending reservations, revenue)

---

## Key decisions & gotchas

- **Tailwind v4 + unlayered CSS**: Never add `* { margin: 0; padding: 0 }` outside a `@layer` — unlayered styles override all Tailwind utilities. shadcn's `@layer base` handles resets.
- **Prisma client regeneration**: If the backend is running during `prisma migrate dev`, kill all node processes first (`taskkill //F //IM node.exe`) then run `npx prisma generate`.
- **Stale node processes**: Multiple `&`-spawned servers accumulate silently. Always kill before starting fresh: `taskkill //F //IM node.exe`.
- **Express 5**: Installed (`express@^5`). Async route handlers work without `try/catch` wrappers in Express 5.
- **shadcn init**: Use `npx shadcn@4.6.0` — the latest version had a workspace config bug at time of setup.
- **Path alias `@/`**: Configured in both `tsconfig.json` (root, for shadcn) and `tsconfig.app.json` (for Vite).
