const AppError = require('../utils/AppError');

function parseId(value, field = 'id') {
  const id = Number.parseInt(value, 10);

  if (Number.isNaN(id) || id <= 0) {
    throw new AppError(`Invalid ${field}`, {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: [{ field, message: `${field} must be a positive integer` }],
    });
  }

  return id;
}

module.exports = {
  parseId,
};
