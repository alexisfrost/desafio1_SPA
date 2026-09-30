import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScore, getSession, isAuthenticated, logout, type ScoreResponse } from '../api';
import Icon from '../components/Icon';

export default function ScorePage() {
  const navigate = useNavigate();
  const [rut, setRut] = useState('');
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      setResult(await getScore(rut.trim()));
    } catch (err) {
      if (!isAuthenticated()) {
        navigate('/login', { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : 'Error al consultar');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="screen">
      <nav className="navbar">
        <span className="navbar-title">Score</span>
        <div className="navbar-user">
          <span className="chip">
            <Icon name="person" size={16} />
            {getSession()?.username}
          </span>
          <button className="icon-btn" onClick={handleLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
            <Icon name="logout" />
          </button>
        </div>
      </nav>
      <main className="card">
        <div className="card-header">
          <h1>Consulta de score</h1>
          <p className="muted">Ingresa el RUT a consultar</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <Icon name="search" />
            <span className="sr-only">RUT</span>
            <input value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12345678-9" required />
          </label>
          {error && (
            <p className="alert" role="alert">
              <Icon name="error" size={18} />
              {error}
            </p>
          )}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Consultando…' : 'Consultar'}
          </button>
        </form>
        {result && (
          <section className="score" aria-live="polite">
            <span className="score-label">Score</span>
            <span className="score-value">{result.score}</span>
          </section>
        )}
      </main>
    </div>
  );
}
