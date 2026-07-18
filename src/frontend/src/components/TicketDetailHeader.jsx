import { formatDate, statusClass } from '../utils/format';

export default function TicketDetailHeader({ ticket }) {
  return (
    <section className="detail-card">
      <div className="detail-card__header">
        <h1 className="detail-card__title">{ticket.title}</h1>
        <span className={`ticket-card__status ticket-card__status--${statusClass(ticket.status)}`}>
          {ticket.status}
        </span>
      </div>

      <p className="detail-card__description">{ticket.description}</p>

      <dl className="detail-card__meta">
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
          <dt>Created</dt>
          <dd>{formatDate(ticket.createdAt)}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{formatDate(ticket.updatedAt)}</dd>
        </div>
      </dl>
    </section>
  );
}
