# Parentive

Parentive is a local household and parents' helper service. This repository is
the launch-site foundation for the early-access website.

Built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, and
**Supabase**.

## Getting started

Requirements: Node.js `>= 18.18`.

```bash
npm ci        # install dependencies (uses package-lock.json)
npm run dev   # start the dev server on http://localhost:3000
```

Then open http://localhost:3000. The dev server binds `0.0.0.0:3000` so Cloud
Agent browser preview (and other port-forwards) can reach it, not only loopback.

The early-access waitlist lives at `/early-access`. Founding Helper applications
live at `/helpers`. Persisting either flow requires these environment variable
names (copy `.env.example`; do not commit secrets):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Apply the Supabase migrations under `supabase/migrations/`, including the
early-access table and the helper-applications table plus private
`helper-application-documents` storage bucket. Helper uploads use the same
service-role credentials; there is no public or anon write path.

## Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the Next.js dev server (port 3000)     |
| `npm run build` | Production build                             |
| `npm start`     | Run the production build                     |
| `npm run lint`  | Lint with ESLint / `eslint-config-next`      |
| `npm test`      | Run unit tests                               |

## Project structure

```
app/
  page.tsx                Placeholder home
  layout.tsx              Root layout
  globals.css             Brand styles
components/
  brand-lockup.tsx        Approved lockup
  form.tsx                Shared form primitives
lib/
  catalogue/              Service catalogue (partial)
  supabase/               Client and types
.cursor/environment.json  Cloud Agent dev environment config
```

## Cloud Agent environment

This repository is configured for Cursor Cloud Agents via
`.cursor/environment.json`: dependencies are installed with `npm ci`. On boot,
`scripts/ensure-dev-server.sh` starts Next.js on `0.0.0.0:3000` (required for
browser preview; Chrome `-102` / `ERR_CONNECTION_REFUSED` means nothing was
listening). The `dev` terminal follows that server's logs.
