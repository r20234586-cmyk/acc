const AppError = require('./AppError');

/**
 * Validation error for invalid input
 * Includes field-level error messages
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', fields = {}) {
    super(message, 400, 'VALIDATION_ERROR');
    this.fields = fields; // { email: 'Invalid email', password: 'Too short' }
  }

  toJSON() {
    return {
      error: {
        code: this.errorCode,
        message: this.message,
        fields: this.fields,
        timestamp: this.timestamp,
      },
    };
  }
}

module.exports = ValidationError;
