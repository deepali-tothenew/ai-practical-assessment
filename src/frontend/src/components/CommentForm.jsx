import { useState } from 'react';
import UserSelect from './UserSelect';
import LoadingSpinner from './LoadingSpinner';

const emptyValues = {
  message: '',
  createdBy: '',
};

export default function CommentForm({
  users,
  fieldErrors = {},
  formError,
  submitting = false,
  onSubmit,
}) {
  const [values, setValues] = useState(emptyValues);

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      <h3 className="comment-form__title">Add Comment</h3>

      {formError && (
        <div className="error-banner error-banner--inline" role="alert">
          <p className="error-banner__message">{formError}</p>
        </div>
      )}

      <div className="form-field">
        <label className="form-field__label" htmlFor="comment-message">
          Message <span className="form-field__required">*</span>
        </label>
        <textarea
          id="comment-message"
          className={`form-field__input form-field__textarea${fieldErrors.message ? ' form-field__input--error' : ''}`}
          value={values.message}
          onChange={(event) => updateField('message', event.target.value)}
          disabled={submitting}
          rows={4}
          required
        />
        {fieldErrors.message && <p className="form-field__error">{fieldErrors.message}</p>}
      </div>

      <UserSelect
        id="comment-createdBy"
        label="Created By"
        value={values.createdBy}
        onChange={(value) => updateField('createdBy', value)}
        users={users}
        disabled={submitting}
        required
        error={fieldErrors.createdBy}
      />

      <div className="form-actions">
        <button type="submit" className="button button--primary" disabled={submitting}>
          {submitting ? (
            <>
              <LoadingSpinner /> Adding…
            </>
          ) : (
            'Add Comment'
          )}
        </button>
      </div>
    </form>
  );
}
