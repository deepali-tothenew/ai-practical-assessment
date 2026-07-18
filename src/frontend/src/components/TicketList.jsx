import { Link } from 'react-router-dom';
import { formatDate, statusClass } from '../utils/format';

export default function TicketList({ tickets }) {
  return (
    <ul className="ticket-list">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <Link to={`/tickets/${ticket.id}`} className="ticket-card">
            <div className="ticket-card__header">
              <h2 className="ticket-card__title">{ticket.title}</h2>
              <span className={`ticket-card__status ticket-card__status--${statusClass(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <dl className="ticket-card__meta">
              <div>
                <dt>Priority</dt>
                <dd>{ticket.priority}</dd>
              </div>
              <div>
                <dt>Assignee</dt>
                <dd>{ticket.assignedToUser?.name || 'Unassigned'}</dd>
              </div>
              <div>
                <dt>Created by</dt>
                <dd>{ticket.createdByUser?.name || '—'}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{formatDate(ticket.updatedAt)}</dd>
              </div>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
