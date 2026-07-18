import { Link, useParams } from 'react-router-dom';

export default function TicketDetailPage() {
  const { id } = useParams();

  return (
    <div className="placeholder-page">
      <h1>Ticket Detail</h1>
      <p>Ticket #{id} — this view will be implemented in a later phase.</p>
      <Link to="/" className="button button--secondary">
        Back to list
      </Link>
    </div>
  );
}
