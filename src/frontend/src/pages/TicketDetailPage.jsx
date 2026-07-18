import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError } from '../api/client';
import { createComment } from '../api/comments';
import { getTicket } from '../api/tickets';
import { listUsers } from '../api/users';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusAction from '../components/StatusAction';
import TicketDetailHeader from '../components/TicketDetailHeader';
import { sortCommentsByCreatedAt } from '../utils/format';
import { mapApiFieldErrors, validateCreateComment } from '../utils/validation';

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentFieldErrors, setCommentFieldErrors] = useState({});
  const [commentFormError, setCommentFormError] = useState(null);

  const loadTicket = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const [ticketData, usersData] = await Promise.all([
        getTicket(id),
        listUsers(),
      ]);

      setTicket(ticketData.ticket);
      setComments(sortCommentsByCreatedAt(ticketData.comments));
      setUsers(usersData.users);
    } catch (err) {
      setTicket(null);
      setComments([]);
      setUsers([]);

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

  async function handleAddComment(values) {
    const clientErrors = validateCreateComment(values);
    if (Object.keys(clientErrors).length > 0) {
      setCommentFieldErrors(clientErrors);
      setCommentFormError(null);
      return;
    }

    setSubmittingComment(true);
    setCommentFieldErrors({});
    setCommentFormError(null);

    try {
      const { comment } = await createComment(ticket.id, {
        message: values.message.trim(),
        createdBy: Number(values.createdBy),
      });

      setComments((current) => sortCommentsByCreatedAt([...current, comment]));
    } catch (err) {
      if (err instanceof ApiError && err.details?.length) {
        setCommentFieldErrors(mapApiFieldErrors(err.details));
      }

      setCommentFormError(err.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  }

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

      <StatusAction
        ticketId={ticket.id}
        currentStatus={ticket.status}
        onStatusUpdated={(updatedTicket) => setTicket(updatedTicket)}
      />

      <section className="detail-section">
        <h2 className="detail-section__title">Comments</h2>
        <CommentList comments={comments} />
        <CommentForm
          users={users}
          fieldErrors={commentFieldErrors}
          formError={commentFormError}
          submitting={submittingComment}
          onSubmit={handleAddComment}
        />
      </section>
    </div>
  );
}
