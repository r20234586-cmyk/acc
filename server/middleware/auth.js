const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/AuthError');

/**
 * Authentication middleware
 * Verifies JWT access token from cookies
 * Sets req.userId if valid
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookie (preferred) or Authorization header
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AuthError('No authentication token provided');
    }

    // Verify token with access secret
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Ensure it's an access token
    if (decoded.type !== 'access') {
      throw new AuthError('Invalid token type');
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    // Pass to error handler
    next(new AuthError(error.message || 'Invalid token'));
  }
};

module.exports = authMiddleware;

