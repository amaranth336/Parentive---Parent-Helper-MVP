# Parentive — Parent Helper MVP

Parentive is a lightweight parent-helper web app for tracking your children's
daily routines. Add a child, build their daily activity checklist, and check off
each item as the day progresses.

Built with **Next.js 14 (App Router)**, **React 18**, and **TypeScript**. Data is
persisted to a local JSON file (`data/db.json`), so there are no external
services or databases to configure for local development.

## Features

- Add children with a name and age
- Add timed activities to each child's routine
- Toggle activities done/undone and watch the daily progress bar update
- Remove activities
- Data persists across restarts via a local JSON store

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

| Method   | Route                                          | Description            |
| -------- | ---------------------------------------------- | ---------------------- |
| `GET`    | `/api/children`                                | List children          |
| `POST`   | `/api/children`                                | Create a child         |
| `POST`   | `/api/children/:id/activities`                 | Add an activity        |
| `PATCH`  | `/api/children/:id/activities/:activityId`     | Toggle activity done   |
| `DELETE` | `/api/children/:id/activities/:activityId`     | Remove an activity     |

## Project structure

```
app/
  api/children/...      Route handlers (REST API)
  page.tsx              Main UI
  layout.tsx            Root layout
  globals.css           Styles
lib/
  db.ts                 JSON-file data access
  types.ts              Shared types
.cursor/environment.json  Cloud Agent dev environment config
```

## Cloud Agent environment

This repository is configured for Cursor Cloud Agents via
`.cursor/environment.json`: dependencies are installed with `npm ci`. On boot,
`scripts/ensure-dev-server.sh` starts Next.js on `0.0.0.0:3000` (required for
browser preview; Chrome `-102` / `ERR_CONNECTION_REFUSED` means nothing was
listening). The `dev` terminal follows that server's logs.
