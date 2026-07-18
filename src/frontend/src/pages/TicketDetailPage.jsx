import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTicket } from '../api/tickets';
import CommentList from '../components/CommentList';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import TicketDetailHeader from '../components/TicketDetailHeader';

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const loadTicket = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getTicket(id);
      setTicket(data.ticket);
      setComments(data.comments);
    } catch (err) {
      setTicket(null);
      setComments([]);

      if (err.status === 404) {
        setNotFound(true);
      } else {
        setError(err.message || 'Failed to load ticket');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  if (loading) {
    return (
      <div className="ticket-detail-page">
        <p className="loading-state">
          <LoadingSpinner /> Loading ticket details…
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="ticket-detail-page">
        <header className="page-header">
          <div>
            <h1>Ticket not found</h1>
            <p className="page-header__subtitle">Ticket #{id} does not exist or may have been removed.</p>
          </div>
        </header>
        <Link to="/" className="button button--secondary">
          Back to list
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-detail-page">
        <header className="page-header">
          <div>
            <h1>Ticket Detail</h1>
            <p className="page-header__subtitle">Ticket #{id}</p>
          </div>
        </header>
        <ErrorBanner message={error} onRetry={loadTicket} />
        <Link to="/" className="button button--secondary">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="ticket-detail-page">
      <header className="page-header">
        <div>
          <h1>Ticket #{ticket.id}</h1>
          <p className="page-header__subtitle">Ticket details and comments</p>
        </div>
        <div className="page-header__actions">
          <Link to={`/tickets/${ticket.id}/edit`} className="button button--primary">
            Edit Ticket
          </Link>
          <Link to="/" className="button button--secondary">
            Back to list
          </Link>
        </div>
      </header>

      <TicketDetailHeader ticket={ticket} />

      <section className="detail-section">
        <h2 className="detail-section__title">Comments</h2>
        <CommentList comments={comments} />
      </section>
    </div>
  );
}
