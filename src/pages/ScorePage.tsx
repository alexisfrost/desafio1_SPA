import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScore, getSession, isAuthenticated, logout, type ScoreResponse } from '../api';

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
    <main className="card">
      <header>
        <h1>Consulta de score</h1>
        <span>
          {getSession()?.username} · <button className="link" onClick={handleLogout}>Salir</button>
        </span>
      </header>
      <form onSubmit={handleSubmit}>
        <label>
          RUT
          <input value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12345678-9" required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
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
  );
}
