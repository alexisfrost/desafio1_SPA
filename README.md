# desafio1_SPA

Single-Page Application built with **React 19 + TypeScript + Vite** that lets a user log in
and look up a person's credit score by RUT. The UI follows the look of
Material Kit React Native (purple accents, white cards) on a dark background, and adapts to
phone screens.

## Features

- **Login page (`/login`)** – username/password form. Calls `POST /api/login` and keeps the
  returned token for the current browser tab.
- **Score page (`/score`)** – protected; only reachable after logging in. Calls
  `GET /api/score/<rut>` with the token and shows the score.
- Opening the app (or any unknown URL) always lands on the login page, and visiting the login
  page ends the current session.
- If the API answers `401` (expired or invalid token), the user is sent back to the login page.
- API errors (wrong credentials, RUT not found, …) are shown inside the form.

## Prerequisites

- **Node.js 20.19+ or 22.12+** (required by Vite 7) and npm.
- The **backend API running on `http://localhost:3000`**, exposing the endpoints described in
  [API](#api). Start it before the app.

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

Test credentials: **`admin` / `admin123`**. Example RUTs: `12345678-9`, `11111111-1`
(`12.345.678-9` with dots also works).

## Scripts

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `npm run dev`     | Starts the dev server with hot reload at `http://localhost:5173`.   |
| `npm run build`   | Type-checks with `tsc` and builds the production bundle to `dist/`. |
| `npm run preview` | Serves the built `dist/` locally (also proxies `/api`).             |

## Configuration

No configuration is needed if the API runs on `localhost:3000`. To change it, copy
`.env.example` to `.env` (`copy .env.example .env` on Windows cmd) and edit:

| Variable       | Default                 | Purpose                                                                                            |
| -------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| `BACKEND_URL`  | `http://localhost:3000` | Where the Vite dev/preview server forwards `/api/*` requests.                                      |
| `VITE_API_URL` | `/api`                  | Base URL the app calls. Keep `/api` to go through the proxy, or set a full URL such as `http://localhost:3000/api` to call the API directly (the API must then allow CORS). |

Restart `npm run dev` after changing `.env`.

## API

The app expects these endpoints on the backend:

**`POST /api/login`**

```json
// request
{ "username": "admin", "password": "admin123" }

// 200
{ "token": "<jwt>", "tokenType": "Bearer", "expiresIn": "1h" }

// 401
{ "error": "Invalid credentials" }
```

**`GET /api/score/:rut`** — header `Authorization: Bearer <token>`

```json
// 200
{ "rut": "12.345.678-9", "score": 73, "fecha": "2025-06-27T14:35:00Z" }

// 401
{ "error": "Invalid token" }

// 404
{ "error": "Score not found for the given rut" }
```

Only `score` is shown on screen.

## Project structure

```
src/
├── main.tsx             # Entry point, mounts the router
├── App.tsx              # Routes and the login guard for /score
├── api.ts               # API calls and session handling (sessionStorage)
├── index.css            # Global styles and theme colors
├── components/
│   └── Icon.tsx         # Inline Material Design icons
└── pages/
    ├── LoginPage.tsx
    └── ScorePage.tsx
vite.config.ts           # Dev server proxy for /api
```

## Deploying

`npm run build` produces static files in `dist/`. When hosting them:

- Serve `index.html` for every route (SPA fallback), so reloading `/score` works.
- Make `/api/*` reach the backend, either with a reverse proxy on the same domain or by
  building with `VITE_API_URL` set to the API's full URL (which then needs CORS enabled).

## AI assistance

This project was developed with the help of **Claude** (Anthropic's AI assistant, via Claude Code).

- **Author's role:** defined the requirements (login and RUT score lookup), decided how the project should be built, reviewed and adjusted the generated code, and approved each commit.

- **Claude's role:**
  - Scaffolded the React + TypeScript + Vite project and wrote the pages, API layer and routing.
  - Configured the dev proxy and matched the app to the real API endpoints by testing against them.
  - Built the responsive Material Kit–inspired styling.

All code was reviewed by the author before being merged.
