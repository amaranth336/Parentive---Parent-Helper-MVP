# Parentive — Parentive V2 (Pre-launch / Pilot)

Parentive is a local flexible household and family support service preparing
for pilot launch.

Households can submit early-access requests for practical help, including:
home & laundry, kitchen & food, parent-home child support, and flexible support
requests.

Parentive is not yet accepting confirmed bookings.

Built with **Next.js 14 (App Router)**, **React 18**, and **TypeScript**.
Support requests and helper applications are persisted via Supabase when
configured, falling back to file-based storage for local development.

## Features

- Browse the pilot service catalogue and select one or more services
- Share timing and household details needed to understand the request
- Submit an early-access support request (not a confirmed booking)
- Apply to join the Hive as a Founding Helper (pilot recruitment)
- Persistence for support requests + helper applications

## Getting started

Requirements: Node.js `>= 18.18`.

```bash
npm ci        # install dependencies (uses package-lock.json)
npm run dev   # start the dev server on http://localhost:3000
```

Then open http://localhost:3000. The dev server binds `0.0.0.0:3000` so Cloud
Agent browser preview (and other port-forwards) can reach it, not only loopback.

## Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the Next.js dev server (port 3000)     |
| `npm run build` | Production build                             |
| `npm start`     | Run the production build                     |
| `npm run lint`  | Lint with ESLint / `eslint-config-next`      |

## API

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/support-requests` | Submit an early-access support request (includes file upload when provided) |
| `POST` | `/api/helper-applications` | Submit a Helper recruitment application |

## Project structure

```
app/
  api/support-requests/...   Support request submission
  api/helper-applications/... Helper recruitment submission
  page.tsx                    Customer UI routes
  layout.tsx                  Root layout
  globals.css                 Styles
lib/
  catalogue/*                Pilot service catalogue + slugs
  content/site.ts            Shared Parentive V2 copy + nav
  support-requests.ts       Request persistence (Supabase + file fallback)
  helper-applications.ts    Recruitment persistence (Supabase + file fallback)
.cursor/environment.json      Cloud Agent dev environment config
```

## Cloud Agent environment

This repository is configured for Cursor Cloud Agents via
`.cursor/environment.json`: dependencies are installed with `npm ci`. On boot,
`scripts/ensure-dev-server.sh` starts Next.js on `0.0.0.0:3000` (required for
browser preview; Chrome `-102` / `ERR_CONNECTION_REFUSED` means nothing was
listening). The `dev` terminal follows that server's logs.
