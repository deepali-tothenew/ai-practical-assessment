import { TICKET_STATUSES } from '../utils/constants';

export default function TicketStatusFilter({ value, onChange, disabled = false }) {
  return (
    <label className="status-filter">
      <span className="status-filter__label">Status</span>
      <select
        className="status-filter__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-label="Filter tickets by status"
      >
        <option value="">All</option>
        {TICKET_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}
