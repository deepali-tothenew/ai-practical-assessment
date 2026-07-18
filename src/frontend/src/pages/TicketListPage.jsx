import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTickets } from '../api/tickets';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import TicketList from '../components/TicketList';
import TicketSearchBar from '../components/TicketSearchBar';
import TicketStatusFilter from '../components/TicketStatusFilter';
import useDebounce from '../hooks/useDebounce';

export default function TicketListPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const debouncedKeyword = useDebounce(keyword, 300);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      const trimmedKeyword = debouncedKeyword.trim();

      if (trimmedKeyword) {
        params.q = trimmedKeyword;
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const data = await listTickets(params);
      setTickets(data.tickets);
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, statusFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const hasActiveFilters = debouncedKeyword.trim() !== '' || statusFilter !== '';
  const showEmptyState = !loading && !error && tickets.length === 0;
  const emptyMessage = hasActiveFilters
    ? 'No matching search results'
    : 'No tickets available';

  return (
    <div className="ticket-list-page">
      <header className="page-header">
        <div>
          <h1>Tickets</h1>
          <p className="page-header__subtitle">Search and filter support tickets</p>
        </div>
        <Link to="/tickets/new" className="button button--primary">
          Create Ticket
        </Link>
      </header>

      <section className="list-toolbar" aria-label="Search and filter tickets">
        <TicketSearchBar value={keyword} onChange={setKeyword} disabled={loading && tickets.length === 0} />
        <TicketStatusFilter value={statusFilter} onChange={setStatusFilter} disabled={loading && tickets.length === 0} />
      </section>

      {error && <ErrorBanner message={error} onRetry={loadTickets} />}

      {loading && (
        <p className="loading-state">
          <LoadingSpinner /> Loading tickets…
        </p>
      )}

      {!loading && !error && tickets.length > 0 && <TicketList tickets={tickets} />}

      {showEmptyState && <EmptyState message={emptyMessage} />}
    </div>
  );
}
