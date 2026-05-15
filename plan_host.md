# Hosting Plan — Airsline MVP (Free Tier)

## Context

The app is a fullstack car rental platform with:
- **Frontend**: React 18 + Vite (static build)
- **Backend**: Node.js + Express 5 (needs a persistent server)
- **Database**: PostgreSQL via Prisma
- **Photos**: Already hosted on Cloudinary — no changes needed

---

## Three options, ranked

### Option A — Recommended: Vercel + Railway (best DX, no sleep)

| Layer | Service | Free tier |
|---|---|---|
| Frontend | **Vercel** | Unlimited deploys, custom domain |
| Backend | **Railway** | $5 USD/month free credit |
| Database | **Railway PostgreSQL** | Included in the same $5 credit |

**Why best for client demo:** backend never sleeps, one dashboard for backend + DB, Vercel auto-deploys on `git push`.

### Option B — Fully free forever: Vercel + Render + Neon

| Layer | Service | Notes |
|---|---|---|
| Frontend | **Vercel** | Free forever |
| Backend | **Render** | Free but **sleeps after 15 min** — 30-60s cold start |
| Database | **Neon** | Free serverless PostgreSQL (0.5 GB) |

### Option C — No sleep, more control: Vercel + Fly.io + Neon

| Layer | Service | Notes |
|---|---|---|
| Frontend | **Vercel** | Free forever |
| Backend | **Fly.io** | 3 shared VMs free, no sleep, needs Dockerfile |
| Database | **Neon** | Free serverless PostgreSQL |

---

## Recommendation: Option A (Vercel + Railway)

---

## Deployment steps (Option A)

### 1. Push repo to GitHub (if not already done)

### 2. Deploy frontend on Vercel
- Connect GitHub repo, set root directory to `frontend`
- Build command: `npm run build`
- Output dir: `dist`
- Add env vars:
  ```
  VITE_CLOUDINARY_CLOUD_NAME=djqwzov3l
  VITE_CLOUDINARY_UPLOAD_PRESET=airsline_preset
  VITE_API_URL=https://<your-railway-backend>.railway.app
  ```

### 3. Deploy backend on Railway
- Create new Railway project → "Deploy from GitHub repo"
- Set root directory to `backend`
- Add a PostgreSQL database plugin (Railway auto-sets `DATABASE_URL`)
- Add env vars:
  ```
  DATABASE_URL=<auto-provided by Railway PostgreSQL>
  JWT_SECRET=<generate a strong random string>
  PORT=3000
  ```
- Start command: `npm run start:prod`

### 4. Seed the database
Run once via Railway shell or local CLI pointed at Railway DB:
```bash
cd backend
DATABASE_URL=<railway-url> npm run seed
```

---

## Code changes made

| File | Change |
|---|---|
| `frontend/src/api/axios.ts` | Uses `VITE_API_URL` env var in production, falls back to `/api` in dev |
| `backend/package.json` | Added `start:prod` script that runs migrations then starts server |
| `backend/src/index.ts` | CORS updated to allow the Vercel frontend URL |

---

## Verification checklist

- [ ] Railway backend URL returns a response
- [ ] Vercel frontend loads and shows the login page
- [ ] Login with `admin@airsline.dz` / `admin123` works
- [ ] Cars list loads from Railway DB
- [ ] Create a car with photos — uploads to Cloudinary, saves to Railway DB
- [ ] Create a reservation — appears in admin panel
