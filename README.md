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

Then open http://localhost:3000.

## Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the Next.js dev server (port 3000)     |
| `npm run build` | Production build                             |
| `npm start`     | Run the production build                     |
| `npm run lint`  | Lint with ESLint / `eslint-config-next`      |
| `npm test`      | Brand-asset source-of-truth checks           |
| `npm run sync:brand-assets` | Import logos from the locked Drive folder |

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
  design-system/        Design-system showcase (`/design-system`)
  page.tsx              Main UI
  layout.tsx            Root layout
  globals.css           Styles
components/
  brand/logo.tsx        Logo mark, wordmark, and lockup (Drive-sourced files)
  ui/                   Design-system primitives
lib/
  brand-assets.ts       Canonical Drive folder + public/brand paths
  db.ts                 JSON-file data access
  types.ts              Shared types
public/brand/           Locked logo mark, wordmark, and lockup copies
.cursor/environment.json  Cloud Agent dev environment config
```

## Brand assets

Logo mark, wordmark, and horizontal lockup are the locked files from Linear 003.

Canonical Drive folder:
https://drive.google.com/drive/folders/1r6GTJERQDf3pFb57RwftqhqY2StSo0yU?usp=drive_link

Local copies live in `public/brand/`. Refresh them with `npm run sync:brand-assets`.
See `public/brand/README.md` and `docs/DESIGN_SYSTEM.md`.

## Cloud Agent environment

This repository is configured for Cursor Cloud Agents via
`.cursor/environment.json`: dependencies are installed with `npm ci` and the dev
server is available as the `dev` terminal.
