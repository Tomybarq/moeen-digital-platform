# منصة مُعين — Mo'een Digital Platform

A role-based digital platform for Saudi non-profit organizations (NGOs) to register,
manage, and support beneficiary cases — built with React, Tailwind CSS, and a
fully decoupled data-service layer ready for any backend.

**Built by [Mohamed Munibari](https://tomybarq.com) / Tomybarq**

---

## ✨ Features

- **Beneficiary case management** — full registration wizard, documents, financial assessment
- **NGO onboarding & management** — organizations, marketers, researchers
- **Role-based dashboards** — KPIs, growth charts, priority distribution, live activity feed
- **Strict form validation** — Zod schemas with Arabic error messages (Saudi phone / national ID formats)
- **RTL-first design** — Arabic typography (Tajawal / IBM Plex Sans Arabic), dark mode, glassmorphism UI

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

> **Dev-only:** a Technical Overview page for engineers is available at `/dev/overview`
> (rendered only in development mode).

## 👥 The 5 User Roles (RBAC)

| Role | Key | Access |
|------|-----|--------|
| مدير المنصة | `platform_admin` | Full access to all data and settings |
| مدير منظمة | `ngo_manager` | Manage his NGO's beneficiaries, marketers, and reports |
| باحث ميداني | `researcher` | Register and edit the cases he created |
| مسوّق | `marketer` | View his NGO's shareable cases for campaigns |
| مسؤول حماية البيانات | `pdo` | Read-only audit and compliance access |

- Permission matrix: `src/lib/rbac.js`
- Declarative UI guard: `<Can role="ADMIN" / permission="beneficiaries:edit">…</Can>` (`src/components/auth/Can.jsx`)
- Active role source: global `AuthContext` (`src/lib/AuthContext.jsx`) — swap the user
  source here to migrate to Firebase Auth without touching any guard.

## 🗂 Project Structure

```
src/
├── pages/          # One file per route (registered in App.jsx)
├── components/     # Reusable components, grouped by domain (auth/, dashboard/, …)
├── services/       # Domain services (NGOService, BeneficiaryService, etc.) + apiService.js
├── adapters/       # Backend adapters — Base44Adapter.js (swap point for Supabase/Firebase/API)
├── config.js       # DATA_PROVIDER setting + simulated latency
├── types/          # JSDoc type definitions
├── hooks/          # Custom React hooks
└── lib/            # rbac.js · schemas.js (Zod) · AuthContext · validation
```

### Data Flow

```
Page / Component → Domain Service → apiService.js → Adapter → Backend SDK
```

- **`apiService.js` is the ONLY file that imports `Base44Adapter`.**
- Domain services (`NGOService`, `BeneficiaryService`, etc.) import from `apiService.js`.
- Only three files touch the SDK: `adapters/Base44Adapter.js`, `services/apiService.js`, and `lib/AuthContext.jsx` (platform-managed).
- **Zero frontend components** (pages, modals, hooks) call the adapter or SDK directly.
- To swap backends, replace only `Base44Adapter.js` with another adapter (e.g. `SupabaseAdapter`) — the entire platform stays identical.

## 🔌 Architecture — Backend-Agnostic Data Layer

All UI data access flows through `src/services/` → `src/adapters/` → backend.
To swap backends, replace only the adapter — services and pages stay untouched.

```
Page → Service → Adapter → Backend
```

- `src/config.js` — set `DATA_PROVIDER` (`base44` | `supabase` | `firebase` | `api`)
- `src/adapters/` — one adapter per backend provider
- `src/services/` — domain services (NGOService, BeneficiaryService, etc.)

**Validation:** frontend rules in `src/lib/schemas.js` (Saudi phone `^05\d{8}$`,
national ID `^[12]\d{9}$`) — mirror them server-side.

**Access control:** per-NGO data isolation and role permissions
(`src/lib/rbac.js`) should be re-implemented server-side; the frontend checks are UX-only.

## 🛠 Tech Stack

React 18 · Vite · Tailwind CSS · shadcn/ui (Radix) · Framer Motion · Recharts ·
TanStack Query · Zod · React Router v6