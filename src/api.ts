const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const SESSION_KEY = 'session';

interface Session {
  username: string;
  token?: string;
}

export function getSession(): Session | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? body.error ?? `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

export async function login(username: string, password: string): Promise<void> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error(await errorMessage(res));

  // If the backend returns a token, keep it to authenticate /score calls.
  const data = await res.json().catch(() => ({}));
  const token: string | undefined = data.token ?? data.accessToken ?? data.access_token;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username, token }));
}

export interface ScoreResponse {
  rut: string;
  score: number;
  fecha: string;
}

export async function getScore(rut: string): Promise<ScoreResponse> {
  const token = getSession()?.token;
  const res = await fetch(`${API_URL}/score/${encodeURIComponent(rut)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 401) {
    logout();
    throw new Error('Sesión expirada, vuelve a iniciar sesión');
  }
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
}
