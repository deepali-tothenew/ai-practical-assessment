const config = require('../config/env');

function errorHandler(err, req, res, _next) {
  if (res.headersSent) {
    return;
  }

  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode === 500 ? 'INTERNAL_ERROR' : 'VALIDATION_ERROR');

  if (statusCode >= 500) {
    console.error('[error]', {
      message: err.message,
      stack: config.isProduction ? undefined : err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  }

  const response = {
    error: {
      code,
      message: statusCode === 500 && config.isProduction
        ? 'An unexpected error occurred'
        : err.message || 'An unexpected error occurred',
    },
  };

  if (err.details) {
    response.error.details = err.details;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
