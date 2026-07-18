import { TICKET_PRIORITIES } from '../utils/constants';

export default function PrioritySelect({
  id = 'priority',
  value,
  onChange,
  disabled = false,
  error,
}) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        Priority <span className="form-field__required">*</span>
      </label>
      <select
        id={id}
        className={`form-field__input${error ? ' form-field__input--error' : ''}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        required
      >
        <option value="">Select priority</option>
        {TICKET_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>
      {error && <p className="form-field__error">{error}</p>}
    </div>
  );
}
