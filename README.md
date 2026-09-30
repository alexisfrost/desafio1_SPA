# desafio1_SPA

Single-Page Application (React + TypeScript + Vite) with two pages:

- **/login** – username/password form. Sends `POST /api/login` with `{ "username": "...", "password": "..." }`.
- **/score** – protected page. Sends `GET /api/score/<rut>` (Bearer token) and shows the response.

## Run

```bash
npm install
cp .env.example .env   # set BACKEND_URL to your API
npm run dev
```

In development, the app calls `/api/login` and `/api/score`, which Vite proxies to
`BACKEND_URL` (default `http://localhost:3000`) to avoid CORS. To call the API directly
instead, set `VITE_API_URL` to e.g. `http://localhost:3000/api`.

If `/login` returns a `token` (or `accessToken` / `access_token`), it is sent as
`Authorization: Bearer <token>` on `/score` requests.
