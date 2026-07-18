export default function UserSelect({
  id,
  label,
  value,
  onChange,
  users,
  disabled = false,
  required = false,
  allowEmpty = false,
  emptyLabel = 'Unassigned',
  error,
}) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
        {required && <span className="form-field__required"> *</span>}
      </label>
      <select
        id={id}
        className={`form-field__input${error ? ' form-field__input--error' : ''}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        required={required}
      >
        {allowEmpty && <option value="">{emptyLabel}</option>}
        {!allowEmpty && <option value="">Select user</option>}
        {users.map((user) => (
          <option key={user.id} value={String(user.id)}>
            {user.name}
          </option>
        ))}
      </select>
      {error && <p className="form-field__error">{error}</p>}
    </div>
  );
}
