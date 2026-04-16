const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const RefreshToken = require('../../models/RefreshToken');
const AuthError = require('../../utils/errors/AuthError');

/**
 * Token service for JWT management
 * Handles access token generation, refresh token generation,
 * token verification, and token refresh logic
 */
class TokenService {
  /**
   * Generate access token (short-lived)
   * @param {string} userId - User ID
   * @returns {string} JWT access token
   */
  static generateAccessToken(userId) {
    const payload = {
      id: userId,
      type: 'access',
    };

    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    });

    return token;
  }

  /**
   * Generate verification token
   * @returns {string} Random token
   */
  static generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Verify access token
   * @param {string} token - JWT token
   * @returns {object} Decoded token payload
   * @throws {AuthError} If token invalid or expired
   */
  static verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (decoded.type !== 'access') {
        throw new AuthError('Invalid token type');
      }
      return decoded;
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError(err.message || 'Invalid token');
    }
  }

  /**
   * Refresh access token using refresh token
   * Validates refresh token from database
   * @param {string} refreshToken - Refresh token from cookie/request
   * @returns {Promise<string>} New access token
   * @throws {AuthError} If refresh token invalid or expired
   */
  static async refreshAccessToken(refreshToken) {
    // Find refresh token in database
    const storedToken = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        revoked_at: null, // Not revoked
      },
    });

    if (!storedToken) {
      throw new AuthError('Invalid refresh token');
    }

    // Check if expired
    if (new Date() > storedToken.expires_at) {
      throw new AuthError('Refresh token expired');
    }

    // Generate new access token
    const newAccessToken = this.generateAccessToken(storedToken.user_id);
    return newAccessToken;
  }

  /**
   * Revoke a single refresh token (logout)
   * @param {string} refreshToken - Token to revoke
   * @returns {Promise<void>}
   */
  static async revokeRefreshToken(refreshToken) {
    await RefreshToken.update(
      { revoked_at: new Date() },
      { where: { token: refreshToken } }
    );
  }

  /**
   * Revoke all refresh tokens for a user
   * Useful for password change or security breach
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async revokeAllUserTokens(userId) {
    await RefreshToken.update(
      { revoked_at: new Date() },
      {
        where: {
          user_id: userId,
          revoked_at: null,
        },
      }
    );
  }

  /**
   * Clean up expired refresh tokens (runs periodically)
   * @returns {Promise<number>} Number of deleted tokens
   */
  static async cleanupExpiredTokens() {
    const result = await RefreshToken.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date(),
        },
      },
    });
    return result;
  }
}

module.exports = TokenService;
