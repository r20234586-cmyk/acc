/**
 * Base error class for application errors
 * All custom errors inherit from this
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      error: {
        code: this.errorCode,
        message: this.message,
        timestamp: this.timestamp,
      },
    };
  }
}

module.exports = AppError;
