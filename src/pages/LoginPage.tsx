import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '../api';
import Icon from '../components/Icon';

export default function LoginPage() {
  const navigate = useNavigate();

  // Landing on the login page always starts a fresh session, so the score
  // page can only be reached by logging in again.
  useEffect(() => {
    logout();
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate('/score', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <main className="card">
        <div className="card-header">
          <div className="avatar">
            <Icon name="person" size={32} />
          </div>
          <h1>Iniciar sesión</h1>
          <p className="muted">Ingresa tus credenciales para continuar</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <Icon name="person" />
            <span className="sr-only">Usuario</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              autoComplete="username"
              required
            />
          </label>
          <label className="field">
            <Icon name="lock" />
            <span className="sr-only">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoComplete="current-password"
              required
            />
          </label>
          {error && (
            <p className="alert" role="alert">
              <Icon name="error" size={18} />
              {error}
            </p>
          )}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </main>
    </div>
  );
}
