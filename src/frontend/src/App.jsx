import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import CreateTicketPage from './pages/CreateTicketPage';
import EditTicketPage from './pages/EditTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import TicketListPage from './pages/TicketListPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <Link to="/" className="app-header__brand">
            Support Tickets
          </Link>
        </header>
        <main className="app">
          <Routes>
            <Route path="/" element={<TicketListPage />} />
            <Route path="/tickets/new" element={<CreateTicketPage />} />
            <Route path="/tickets/:id/edit" element={<EditTicketPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
