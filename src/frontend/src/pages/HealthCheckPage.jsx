import { useEffect, useState } from 'react';
import { getHealth } from '../api/health';
import { API_BASE_URL } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HealthCheckPage() {
  const [status, setStatus] = useState('loading');
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      setStatus('loading');
      setError(null);

      try {
        const data = await getHealth();
        if (!cancelled) {
          setHealth(data);
          setStatus('ok');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to reach backend');
          setStatus('error');
        }
      }
    }

    checkHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="health-card">
      <h2>Backend connection</h2>

      {status === 'loading' && (
        <p>
          <LoadingSpinner /> Checking API at <code>{API_BASE_URL}/health</code>…
        </p>
      )}

      {status === 'ok' && health && (
        <>
          <p className="health-status health-status--ok">Connected — API status: {health.status}</p>
          <p className="health-meta">
            Server timestamp: <code>{health.timestamp}</code>
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <p className="health-status health-status--error">Connection failed</p>
          <p className="health-meta">{error}</p>
          <p className="health-meta">
            Expected API at <code>{API_BASE_URL}/health</code>. Ensure the backend is running.
          </p>
        </>
      )}
    </section>
  );
}
