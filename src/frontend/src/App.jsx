import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TicketListPage from './pages/TicketListPage';
import CreateTicketPage, { TicketDetailPage } from './pages/PlaceholderPages';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<TicketListPage />} />
          <Route path="/tickets/new" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
