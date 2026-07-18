import { useState } from 'react';
import { transitionTicketStatus } from '../api/tickets';
import { getValidNextStatuses } from '../utils/constants';
import { statusClass } from '../utils/format';
import LoadingSpinner from './LoadingSpinner';

export default function StatusAction({ ticketId, currentStatus, onStatusUpdated }) {
  const [transitioningTo, setTransitioningTo] = useState(null);
  const [error, setError] = useState(null);

  const nextStatuses = getValidNextStatuses(currentStatus);
  const isTerminal = nextStatuses.length === 0;

  async function handleTransition(targetStatus) {
    setTransitioningTo(targetStatus);
    setError(null);

    try {
      const updatedTicket = await transitionTicketStatus(ticketId, targetStatus);
      onStatusUpdated(updatedTicket);
    } catch (err) {
      setError(err.message || 'Failed to update ticket status');
    } finally {
      setTransitioningTo(null);
    }
  }

  return (
    <section className="status-action detail-card" aria-label="Ticket status actions">
      <div className="status-action__header">
        <h2 className="detail-section__title">Status</h2>
        <span className={`ticket-card__status ticket-card__status--${statusClass(currentStatus)}`}>
          {currentStatus}
        </span>
      </div>

      {error && (
        <p className="status-action__error" role="alert">
          {error}
        </p>
      )}

      {isTerminal ? (
        <p className="status-action__message">No further status changes are available.</p>
      ) : (
        <div className="status-action__buttons">
          {nextStatuses.map((status) => (
            <button
              key={status}
              type="button"
              className="button button--secondary"
              onClick={() => handleTransition(status)}
              disabled={transitioningTo !== null}
            >
              {transitioningTo === status ? (
                <>
                  <LoadingSpinner /> Updating…
                </>
              ) : (
                `Move to ${status}`
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
