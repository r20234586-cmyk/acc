const AppError = require('./AppError');

/**
 * Rate limit error when too many requests
 */
class RateLimitError extends AppError {
  constructor(retryAfter = 60) {
    super('Too many requests. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED');
    this.retryAfter = retryAfter; // seconds until retry
  }

  toJSON() {
    return {
      error: {
        code: this.errorCode,
        message: this.message,
        retryAfter: this.retryAfter,
        timestamp: this.timestamp,
      },
    };
  }
}

module.exports = RateLimitError;
