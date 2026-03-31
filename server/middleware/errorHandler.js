const AppError = require('../utils/errors/AppError');

/**
 * Global error handler middleware
 * Must be the last middleware in the stack
 * Catches all errors and returns consistent JSON responses
 */
const errorHandler = (err, req, res, next) => {
  // Default error
  let error = err;

  // Handle non-AppError exceptions
  if (!(err instanceof AppError)) {
    const message = err.message || 'Internal server error';
    const statusCode = err.statusCode || 500;
    error = new AppError(message, statusCode);
  }

  const statusCode = error.statusCode || 500;

  const response = {
    error: {
      code: error.errorCode,
      message: error.message,
      timestamp: error.timestamp,
    },
  };

  // Include field errors for validation errors
  if (error.fields) {
    response.error.fields = error.fields;
  }

  // Include locked until time for account locked errors
  if (error.lockedUntil) {
    response.error.lockedUntil = error.lockedUntil;
  }

  // Only include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  // Log error for monitoring
  if (statusCode >= 500) {
    console.error(`[ERROR] ${error.errorCode}:`, error.message, '\n', err.stack);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
