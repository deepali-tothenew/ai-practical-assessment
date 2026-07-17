import HealthCheckPage from './pages/HealthCheckPage';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Support Ticket Management</h1>
        <p>Frontend setup — verifying backend connectivity.</p>
      </header>
      <HealthCheckPage />
    </div>
  );
}
