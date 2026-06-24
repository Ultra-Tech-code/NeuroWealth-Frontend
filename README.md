NeuroWealth — Frontend
=================================

This repository contains the Next.js frontend for NeuroWealth. It's a demo-ready frontend with mock authentication, UI components, and client-side adapters that let the app run without a backend.

Quick start
-----------

Requirements: Node.js 20+, Yarn (Corepack supported)

Install and run:

```bash
yarn install
yarn dev
```

Run tests:

```bash
yarn test
```

What this repo contains
-----------------------
- Next.js 14 app under `src/app`
- Client-side mock auth (`src/lib/mock-auth.ts`) that persists an in-browser session in `localStorage` and mirrors it to a non-httpOnly cookie so `middleware.ts` can perform edge-side redirects.
- Edge middleware (`middleware.ts`) that protects routes under `/dashboard`, `/profile`, and `/settings` and redirects unauthenticated users to `/login?from=...`.
- Tests using the Node test runner (match: `src/**/*.test.ts`).

Folder structure
----------------

```
src/
├── app/                   # Next.js App Router — routes and layouts
│   ├── (auth)/            # Auth-gated route group (login, onboarding)
│   ├── (errors)/          # Standalone error pages (401 unauthorized, 403 forbidden)
│   ├── api/               # Route handlers
│   ├── dashboard/         # Protected dashboard shell and sub-routes
│   │   ├── dev-errors/    # Dev-only error trigger routes (hidden in production)
│   │   ├── portfolio/
│   │   ├── activity/
│   │   ├── strategy/
│   │   └── settings/
│   ├── not-found.tsx      # Global 404 page
│   └── error.tsx          # Global 500 / uncaught error boundary
├── components/            # Shared UI components (ui/, dashboard/, auth/, layout/)
├── features/              # Feature-scoped logic co-located with its UI
├── hooks/                 # Reusable React hooks
├── lib/                   # Pure utilities, constants, and adapters
│   ├── mock-auth.ts       # Client-side mock auth session
│   ├── auth-constants.ts  # Canonical storage/cookie key names
│   └── …
└── types/                 # Shared TypeScript types and interfaces
```

TypeScript strict mode is enabled (`tsconfig.json` → `"strict": true`).
Lint runs via `yarn lint` (ESLint + `eslint-config-next`).

Environment variables
---------------------
See `docs/env.md` for the full variable reference, including the public/server-only split,
Edge middleware constraints, and runtime validation notes.

Auth syncing note
-----------------
The mock auth flow stores the session in `localStorage` using `SESSION_STORAGE_KEY` and mirrors it into a cookie named `SESSION_COOKIE_NAME`. This allows the browser UI and Next.js middleware to agree on authentication state in demo setups. See `src/lib/auth-constants.ts` for the canonical values.

Contributing
------------
- Follow existing patterns for components and hooks.
- Tests live next to logic under `src/` and run via `yarn test`.

License
-------
Internal/demo project — see repository owner for license details.
