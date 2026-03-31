const AppError = require('./AppError');

/**
 * Account locked error after failed login attempts
 */
class AccountLockedError extends AppError {
  constructor(lockedUntil) {
    super('Account locked due to too many failed login attempts', 423, 'ACCOUNT_LOCKED');
    this.lockedUntil = lockedUntil;
  }

  toJSON() {
    return {
      error: {
        code: this.errorCode,
        message: this.message,
        lockedUntil: this.lockedUntil,
        timestamp: this.timestamp,
      },
    };
  }
}

module.exports = AccountLockedError;
