import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { createTicket } from '../api/tickets';
import { listUsers } from '../api/users';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import TicketForm from '../components/TicketForm';
import { mapApiFieldErrors, validateCreateTicket } from '../utils/validation';

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setLoadError(null);

    try {
      const data = await listUsers();
      setUsers(data.users);
    } catch (err) {
      setLoadError(err.message || 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function handleCancel() {
    navigate('/');
  }

  async function handleSubmit(values) {
    const clientErrors = validateCreateTicket(values);
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
      createdBy: Number(values.createdBy),
    };

    if (values.assignedTo) {
      payload.assignedTo = Number(values.assignedTo);
    }

    try {
      const ticket = await createTicket(payload);
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.details?.length) {
        setFieldErrors(mapApiFieldErrors(err.details));
      }

      setFormError(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingUsers) {
    return (
      <div className="ticket-form-page">
        <header className="page-header">
          <div>
            <h1>Create Ticket</h1>
            <p className="page-header__subtitle">Add a new support ticket</p>
          </div>
        </header>
        <p className="loading-state">
          <LoadingSpinner /> Loading form…
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="ticket-form-page">
        <header className="page-header">
          <div>
            <h1>Create Ticket</h1>
            <p className="page-header__subtitle">Add a new support ticket</p>
          </div>
        </header>
        <ErrorBanner message={loadError} onRetry={loadUsers} />
        <Link to="/" className="button button--secondary">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="ticket-form-page">
      <header className="page-header">
        <div>
          <h1>Create Ticket</h1>
          <p className="page-header__subtitle">Add a new support ticket</p>
        </div>
        <Link to="/" className="button button--secondary">
          Back to list
        </Link>
      </header>

      <section className="form-card">
        <TicketForm
          mode="create"
          users={users}
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
