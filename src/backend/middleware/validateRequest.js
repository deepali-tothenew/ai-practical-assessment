const AppError = require('../utils/AppError');

function validationError(details, message = 'Validation failed') {
  throw new AppError(message, { statusCode: 400, code: 'VALIDATION_ERROR', details });
}

function assertObject(value, label = 'body') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    validationError([{ field: label, message: `${label} must be a JSON object` }]);
  }
}

function collectTypeError(details, field, message) {
  details.push({ field, message });
}

function assertString(value, field, { required = false } = {}, details = null) {
  const errors = details || [];

  if (value === undefined || value === null) {
    if (required) {
      collectTypeError(errors, field, `${field} is required`);
    }
    return errors;
  }

  if (typeof value !== 'string') {
    collectTypeError(errors, field, `${field} must be a string`);
  }

  return errors;
}

function assertInteger(value, field, { required = false, nullable = false } = {}, details = null) {
  const errors = details || [];

  if (value === undefined) {
    if (required) {
      collectTypeError(errors, field, `${field} is required`);
    }
    return errors;
  }

  if (value === null) {
    if (!nullable) {
      collectTypeError(errors, field, `${field} must be an integer`);
    }
    return errors;
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    collectTypeError(errors, field, `${field} must be an integer`);
  } else if (value <= 0) {
    collectTypeError(errors, field, `${field} must be a positive integer`);
  }

  return errors;
}

function parsePositiveIntegerParam(value, field) {
  const id = Number.parseInt(value, 10);

  if (Number.isNaN(id) || id <= 0) {
    validationError([{ field, message: `${field} must be a positive integer` }]);
  }

  return id;
}

function finalize(details) {
  if (details.length > 0) {
    validationError(details);
  }
}

module.exports = {
  validationError,
  assertObject,
  collectTypeError,
  assertString,
  assertInteger,
  parsePositiveIntegerParam,
  finalize,
};
