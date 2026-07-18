import { useState } from 'react';
import PrioritySelect from './PrioritySelect';
import UserSelect from './UserSelect';
import LoadingSpinner from './LoadingSpinner';

const emptyValues = {
  title: '',
  description: '',
  priority: '',
  createdBy: '',
  assignedTo: '',
};

export default function TicketForm({
  mode = 'create',
  users,
  initialValues = emptyValues,
  fieldErrors = {},
  formError,
  submitting = false,
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState({ ...emptyValues, ...initialValues });

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(values);
  }

  const isDisabled = submitting;

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="error-banner error-banner--inline" role="alert">
          <p className="error-banner__message">{formError}</p>
        </div>
      )}

      <div className="form-field">
        <label className="form-field__label" htmlFor="title">
          Title <span className="form-field__required">*</span>
        </label>
        <input
          id="title"
          type="text"
          className={`form-field__input${fieldErrors.title ? ' form-field__input--error' : ''}`}
          value={values.title}
          onChange={(event) => updateField('title', event.target.value)}
          disabled={isDisabled}
          required
        />
        {fieldErrors.title && <p className="form-field__error">{fieldErrors.title}</p>}
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor="description">
          Description <span className="form-field__required">*</span>
        </label>
        <textarea
          id="description"
          className={`form-field__input form-field__textarea${fieldErrors.description ? ' form-field__input--error' : ''}`}
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
          disabled={isDisabled}
          rows={5}
          required
        />
        {fieldErrors.description && <p className="form-field__error">{fieldErrors.description}</p>}
      </div>

      <PrioritySelect
        value={values.priority}
        onChange={(value) => updateField('priority', value)}
        disabled={isDisabled}
        error={fieldErrors.priority}
      />

      {mode === 'create' && (
        <UserSelect
          id="createdBy"
          label="Created By"
          value={values.createdBy}
          onChange={(value) => updateField('createdBy', value)}
          users={users}
          disabled={isDisabled}
          required
          error={fieldErrors.createdBy}
        />
      )}

      <UserSelect
        id="assignedTo"
        label="Assigned To"
        value={values.assignedTo}
        onChange={(value) => updateField('assignedTo', value)}
        users={users}
        disabled={isDisabled}
        allowEmpty
        error={fieldErrors.assignedTo}
      />

      <div className="form-actions">
        <button type="button" className="button button--secondary" onClick={onCancel} disabled={isDisabled}>
          Cancel
        </button>
        <button type="submit" className="button button--primary" disabled={isDisabled}>
          {submitting ? (
            <>
              <LoadingSpinner /> Creating…
            </>
          ) : (
            'Create Ticket'
          )}
        </button>
      </div>
    </form>
  );
}
