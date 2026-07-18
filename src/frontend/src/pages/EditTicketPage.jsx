import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../api/client';
import { getTicket, updateTicket } from '../api/tickets';
import { listUsers } from '../api/users';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import TicketForm from '../components/TicketForm';
import { mapApiFieldErrors, validateUpdateTicket } from '../utils/validation';

function toFormValues(ticket) {
  return {
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    assignedTo: ticket.assignedTo ? String(ticket.assignedTo) : '',
  };
}

export default function EditTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const loadPageData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setNotFound(false);

    try {
      const [ticketData, usersData] = await Promise.all([
        getTicket(id),
        listUsers(),
      ]);

      setTicket(ticketData.ticket);
      setUsers(usersData.users);
    } catch (err) {
      setTicket(null);
      setUsers([]);

      if (err.status === 404) {
        setNotFound(true);
      } else {
        setLoadError(err.message || 'Failed to load ticket');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  function handleCancel() {
    navigate(`/tickets/${id}`);
  }

  async function handleSubmit(values) {
    const clientErrors = validateUpdateTicket(values);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setFormError(null);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      assignedTo: values.assignedTo ? Number(values.assignedTo) : null,
    };

    try {
      await updateTicket(id, payload);
      navigate(`/tickets/${id}`);
    } catch (err) {
      if (err instanceof ApiError && err.details?.length) {
        setFieldErrors(mapApiFieldErrors(err.details));
      }

      setFormError(err.message || 'Failed to update ticket');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="ticket-form-page">
        <header className="page-header">
          <div>
            <h1>Edit Ticket</h1>
            <p className="page-header__subtitle">Ticket #{id}</p>
          </div>
        </header>
        <p className="loading-state">
          <LoadingSpinner /> Loading ticket…
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="ticket-form-page">
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

  if (loadError) {
    return (
      <div className="ticket-form-page">
        <header className="page-header">
          <div>
            <h1>Edit Ticket</h1>
            <p className="page-header__subtitle">Ticket #{id}</p>
          </div>
        </header>
        <ErrorBanner message={loadError} onRetry={loadPageData} />
        <Link to={`/tickets/${id}`} className="button button--secondary">
          Back to detail
        </Link>
      </div>
    );
  }

  return (
    <div className="ticket-form-page">
      <header className="page-header">
        <div>
          <h1>Edit Ticket</h1>
          <p className="page-header__subtitle">Ticket #{ticket.id}</p>
        </div>
        <Link to={`/tickets/${ticket.id}`} className="button button--secondary">
          Cancel
        </Link>
      </header>

      <section className="form-card">
        <TicketForm
          key={ticket.id}
          mode="edit"
          users={users}
          initialValues={toFormValues(ticket)}
          createdByName={ticket.createdByUser?.name}
          fieldErrors={fieldErrors}
          formError={formError}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </section>
    </div>
  );
}
