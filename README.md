# gta-chatgptt-proxy

This repo contains:

- **`chatgpt.js`** + **`vercel.json`** — pre-existing Vercel function that proxies requests to the OpenAI Chat Completions API.
- **`moneyflow/`** — full-stack implementation of the **MoneyFlow** design (Midnight Wealth edition).
- **`trajex/`** — preserved prototype of the **Trajex** fleet-management design (HTML + JSX via Babel-standalone).

Both design directions come from a Claude Design (`claude.ai/design`) handoff bundle. The chat session ended on MoneyFlow, so it is the most fully-realized direction.

---

## MoneyFlow — full-stack app

A revenue tracker for freelancers, content creators, affiliates, coaches and crypto traders. Express + JSON-file backend, vanilla-JS SPA frontend, with a localStorage-backed mock that lets the UI run without a server.

### Run with the backend

```bash
cd moneyflow
npm install
npm run seed   # creates db.json with demo@moneyflow.io / Demo1234
npm run dev    # nodemon backend/server.js  (or: npm start)
```

The Express server serves the API at `http://localhost:3001/api` and the frontend statically. Open <http://localhost:3001/index.html> and log in with the demo credentials.

Configuration (`.env`, copy from `.env.example`):

```
NODE_ENV=development
PORT=3001
JWT_SECRET=change-me-to-a-very-long-random-string
CORS_ORIGIN=http://localhost:5500
```

### Run as a static demo (no backend)

`moneyflow/frontend/index.html` and `app.html` automatically fall back to a localStorage-backed mock when the API is unreachable. Open `index.html` directly in a browser (or any static host) and click **Lancer la démo** — credentials `demo@moneyflow.io` / `Demo1234` are pre-filled.

### Routes (HTTP)

```
POST   /api/auth/register        { email, password, name }   → { token, user }
POST   /api/auth/login           { email, password }         → { token, user }
GET    /api/auth/me                                           → { user }
GET    /api/gains?from&to&source                              → { gains[] }
POST   /api/gains                { source, amount, date, note? }
PUT    /api/gains/:id            { source?, amount?, date?, note? }
DELETE /api/gains/:id
GET    /api/tasks                                             → { tasks[] }
POST   /api/tasks                { title, amount, status, priority, dueDate? }
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/complete                               → completes + adds gain
DELETE /api/tasks/:id
GET    /api/goals                                             → { goals[] }
POST   /api/goals                { title, targetAmount, period, startDate, endDate }
PUT    /api/goals/:id
DELETE /api/goals/:id
GET    /api/stats                                             → totals + breakdowns + streak
GET    /api/health
```

All non-auth routes require `Authorization: Bearer <jwt>`.

### Layout

```
moneyflow/
├── backend/
│   ├── config/constants.js       — env, JWT, rate-limit, enums
│   ├── middleware/               — auth (JWT), validate (schema), errorHandler
│   ├── routes/                   — auth, gains, tasks, goals, stats
│   ├── utils/                    — db (file lock), logger, seed
│   ├── db.json                   — JSON store (seeded)
│   └── server.js                 — Express bootstrap
└── frontend/
    ├── index.html                — landing + login/register
    ├── app.html                  — SPA shell (sidebar / topbar / hash router)
    ├── css/                      — tokens, base, components, landing, dashboard
    ├── js/
    │   ├── api.js                — fetch wrapper with auto mock fallback
    │   ├── auth.js               — login / register / logout / me
    │   ├── mock.js               — full localStorage mock of every route
    │   ├── components/           — sidebar, topbar, toast, modal, charts (Canvas)
    │   ├── utils/                — animate (countUp), format (EUR/dates), storage
    │   └── views/                — dashboard, gains, tasks, goals, stats, settings
    └── assets/favicon.svg
```

---

## Trajex — fleet-management prototype

Design canvas with three artboards (web dashboard 1280×800, mobile manager 390×844, mobile driver 390×844) and a tweaks panel (accent colour, light/dark, density, vehicle type). Built as React + JSX rendered through `@babel/standalone` from a single HTML page.

```bash
cd trajex
python3 -m http.server 8080   # or any static server
# open http://localhost:8080
```

This is intentionally kept as the original prototype: pixel-perfect production reimplementation (in React/Vue/native) was not the requested deliverable — the chat finished by pivoting to MoneyFlow.

---

## ChatGPT proxy

`chatgpt.js` + `vercel.json` are unchanged from the previous state of the repo and unrelated to the designs above. They expose a single endpoint that forwards `{ messages, apiKey }` to OpenAI's `/v1/chat/completions`.
