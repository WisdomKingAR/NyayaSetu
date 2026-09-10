# NyayaSetu — Agent Instructions

## Project Overview
Legal document intelligence platform: upload Indian court documents → OCR (Sarvam) → structured extraction + translation (Gemini + Sarvam) → chat Q&A.
- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript → Vercel
- **Backend**: Express.js + TypeScript → Render (Free Web Service)
- **Database/Storage**: Supabase Postgres + Storage
- **Keep-alive**: UptimeRobot pings `/health` every 5 min to prevent Render 15-min spin-down

## Repository Structure
```
HACKOPS/
├── backend/          # Express API server
│   ├── src/
│   │   ├── server.ts          # Entry point (imports createApp from app.ts)
│   │   ├── app.ts             # Express factory: CORS, helmet, rate-limit, routes
│   │   ├── config.ts          # Validated env config (throws on missing required vars)
│   │   ├── features/          # Feature modules: health, auth, documents, ocr, ai, translation
│   │   ├── lib/supabaseAdmin.ts  # Server-only Supabase client (service role key)
│   │   └── middleware/        # errorHandler, rateLimiter, requestLogger, authMiddleware, fileValidator
│   ├── test/                  # Node test runner (*.test.mjs)
│   ├── dist/                  # Compiled output (gitignored)
│   ├── package.json
│   ├── tsconfig.json
│   └── render.yaml
├── frontend/         # Next.js client
│   ├── src/
│   │   ├── app/               # App Router pages: /, /dashboard, /documents/[id], /auth/*
│   │   ├── components/        # Shared: Providers, NavBar, LanguageToggle
│   │   ├── features/          # Feature modules: documents, chat, auth
│   │   ├── lib/               # apiClient (axios), types, stores (Zustand)
│   │   └── globals.css
│   ├── package.json
│   └── tsconfig.json
└── DOCUMENTATION/    # PRD, TECH_STACK, BACKEND_ARCHITECTURE, IMPLEMENTATION_PLAN
```

## Developer Commands

### Backend (run from `backend/`)
| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with ts-node-dev (hot reload) |
| `npm run build` | `tsc` → compiles to `dist/` |
| `npm run start` | Runs `node dist/server.js` (production) |
| `npm run type-check` | `tsc --noEmit` (type check only) |
| `npm test` | Build + run Node test runner on `test/*.test.mjs` |

### Frontend (run from `frontend/`)
| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Next.js production build |
| `npm run start` | Next.js production server |
| `npm run lint` | `next lint` |
| `npm run type-check` | `tsc --noEmit` |

## Critical Environment Variables (Backend)
Set in Render dashboard (never commit `.env`):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server-only, validated in config.ts)
- `SUPABASE_ANON_KEY` (optional, for client if needed)
- `GEMINI_API_KEY`, `GEMINI_MODEL` (default: `gemini-3.6-flash`)
- `SARVAM_API_KEY`, `SARVAM_BASE_URL` (default: `https://api.sarvam.ai`)
- `FRONTEND_URL` — **must match Vercel URL exactly (no trailing slash)**. CORS fails silently if mismatched.
- `PORT` — Render injects this; default 10000 locally.

### Supabase Connection (CRITICAL)
- Render runs IPv4; direct Postgres (port 5432) is IPv6 → **will fail with ECONNREFUSED**.
- **Must use Supavisor Transaction Pooler on port 6543** (IPv4 compatible).
- Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

## Key Architectural Facts
- **Route → Service pattern**: Route handlers call service functions. No direct Supabase/Gemini calls in routes.
- **Health endpoint**: `/health` and `/api/health` mounted **before** rate limiter. No auth. Returns `{ status, database, timestamp }`. UptimeRobot depends on this.
- **CORS**: Dynamic validator in `app.ts` normalizes trailing slashes + allows `*.vercel.app` previews. `FRONTEND_URL` must be exact.
- **File uploads**: Multer 10MB limit, validates MIME type (PDF, JPEG, PNG, WEBP). Stored in Supabase Storage bucket `legal-documents` (public).
- **Auth**: Supabase Auth (email/password). JWT verified via `authMiddleware.ts` on protected routes.
- **Rate limiting**: Applied to `/api/*` routes (not `/health`).

## Database Schema (Supabase)
```sql
documents: id, filename, file_path, file_url, doc_type, is_handwritten, case_number, parties[], court_name, next_hearing_date, summary_en, *_mr, ocr_text, status (pending/processing/complete/error), error_message, upload_date, created_at, updated_at
chat_messages: id, document_id (FK), role (user/assistant), content, created_at
```
Indexes on `case_number`, `status`, `upload_date DESC`, `chat_messages.document_id`.

## Testing
- Backend: `npm test` runs Node test runner on `test/*.test.mjs` against compiled `dist/`. Requires `npm run build` first.
- Tests set dummy env vars at top of file for config validation.
- No frontend test setup yet.

## Deployment
| Target | Command | Notes |
|--------|---------|-------|
| **Backend (Render)** | Push to GitHub → Render auto-deploys from `backend/` | Build: `npm install && npm run build`, Start: `npm start`, Health: `/health` |
| **Frontend (Vercel)** | Connect repo → Vercel detects Next.js | Env: `NEXT_PUBLIC_API_URL=https://<render-url>` |
| **Keep-alive** | UptimeRobot monitor → `https://<render-url>/health` every 5 min | **Must run ≥20 min before demo** to prevent cold start |

## Common Gotchas
1. **CORS errors** → `FRONTEND_URL` in Render env vars doesn't match Vercel URL exactly (protocol, no trailing slash).
2. **Supabase connection fails on Render** → Using direct port 5432 instead of Supavisor pooler (port 6543).
3. **Service role key is anon key** → Config throws at startup: "SUPABASE_SERVICE_ROLE_KEY is set to the public anon key".
4. **Render cold start mid-demo** → UptimeRobot monitor not started early enough.
5. **Gemini model string stale** → Verify `gemini-3.6-flash` (or current) in Google AI Studio before demo.
6. **Sarvam endpoint/response fields** → Check Sarvam docs; assumed paths in `ocr.service.ts` / `translation.service.ts` may differ.

## Key Files to Reference
- `backend/src/app.ts` — Express wiring, CORS, rate limit, route mounting order
- `backend/src/config.ts` — All env validation, CORS origins, Supabase key validation
- `backend/src/features/documents/documents.router.ts` — Full pipeline: upload → process (OCR → Gemini → Translate) → chat
- `frontend/src/lib/apiClient.ts` — Axios instance with `NEXT_PUBLIC_API_URL` base
- `DOCUMENTATION/TECH_STACK.md` — Complete stack versions, Render/UptimeRobot details
- `DOCUMENTATION/BACKEND_ARCHITECTURE.md` — Route map, service code, deployment steps
- `DOCUMENTATION/IMPLEMENTATION_PLAN.md` — Hour-by-hour build plan with fallback protocols