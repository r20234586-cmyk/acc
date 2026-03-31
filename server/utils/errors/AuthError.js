const AppError = require('./AppError');

/**
 * Authentication error for login/auth failures
 */
class AuthError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

module.exports = AuthError;
