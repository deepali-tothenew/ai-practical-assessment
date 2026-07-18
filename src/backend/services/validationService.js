const AppError = require('../utils/AppError');
const userRepository = require('../repositories/userRepository');

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled'];

function validationError(message, details) {
  throw new AppError(message, { statusCode: 400, code: 'VALIDATION_ERROR', details });
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validatePriority(priority, field = 'priority') {
  if (!PRIORITIES.includes(priority)) {
    validationError('Invalid priority value', [
      { field, message: `Priority must be one of: ${PRIORITIES.join(', ')}` },
    ]);
  }
}

function validateStatus(status, field = 'status') {
  if (!STATUSES.includes(status)) {
    validationError('Invalid status value', [
      { field, message: `Status must be one of: ${STATUSES.join(', ')}` },
    ]);
  }
}

function validateRequiredNonEmptyString(value, field) {
  if (!isNonEmptyString(value)) {
    validationError('Validation failed', [
      { field, message: `${field} is required and must be non-empty` },
    ]);
  }
}

function validateOptionalNonEmptyString(value, field) {
  if (value !== undefined && !isNonEmptyString(value)) {
    validationError('Validation failed', [
      { field, message: `${field} must be non-empty when provided` },
    ]);
  }
}

async function validateUserExists(userId, field) {
  if (userId === null || userId === undefined) {
    validationError('Validation failed', [
      { field, message: `${field} is required` },
    ]);
  }

  const exists = await userRepository.existsById(userId);
  if (!exists) {
    validationError('Validation failed', [
      { field, message: `User with id ${userId} does not exist` },
    ]);
  }
}

async function validateOptionalAssignee(assignedTo) {
  if (assignedTo === null || assignedTo === undefined) {
    return;
  }

  await validateUserExists(assignedTo, 'assignedTo');
}

function rejectImmutableFields(body, fields) {
  const details = fields
    .filter((field) => body[field] !== undefined)
    .map((field) => ({
      field,
      message: `${field} cannot be modified`,
    }));

  if (details.length > 0) {
    validationError('Validation failed', details);
  }
}

function rejectForbiddenFields(body, fields) {
  const details = fields
    .filter((field) => body[field] !== undefined)
    .map((field) => ({
      field,
      message: `${field} cannot be updated through this endpoint`,
    }));

  if (details.length > 0) {
    validationError('Validation failed', details);
  }
}

module.exports = {
  PRIORITIES,
  STATUSES,
  validatePriority,
  validateStatus,
  validateRequiredNonEmptyString,
  validateOptionalNonEmptyString,
  validateUserExists,
  validateOptionalAssignee,
  rejectImmutableFields,
  rejectForbiddenFields,
};
