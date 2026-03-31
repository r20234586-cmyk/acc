const bcrypt = require('bcryptjs');
const axios = require('axios');
const User = require('../../models/User');
const UserService = require('../user/UserService');
const TokenService = require('./TokenService');
const AuthError = require('../../utils/errors/AuthError');
const ValidationError = require('../../utils/errors/ValidationError');

/**
 * Auth service for authentication operations
 * Orchestrates user service, token service, and password hashing
 * This is the core business logic layer for authentication
 */
class AuthService {
  /**
   * Register a new user
   * @param {object} userData - { name, email, password, location, interests, timePreferences }
   * @returns {Promise<object>} { user, message }
   * @throws {ValidationError} If validation fails
   */
  static async register(userData) {
    // Create user (UserService validates email uniqueness)
    const user = await UserService.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      location: userData.location,
      interests: userData.interests,
      timePreferences: userData.timePreferences,
    });

    // TODO: Send verification email (EmailService)
    // await EmailService.sendVerificationEmail(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {object} metadata - IP address, user agent for refresh token
   * @returns {Promise<object>} { user, accessToken, refreshToken }
   * @throws {AuthError} If credentials invalid
   */
  static async login(email, password, metadata = {}) {
    // Find user by email
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new AuthError('Invalid email or password');
    }

    // Check if account is locked
    if (user.locked_until && new Date() < user.locked_until) {
      throw new AuthError('Account is locked. Please try again later or contact support.');
    }

    // Verify password
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      // Increment login attempts and lock account if needed
      await user.increment('login_attempts');
      if (user.login_attempts >= 5) {
        const lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
        await user.update({ locked_until: lockUntil });
      }
      throw new AuthError('Invalid email or password');
    }

    // Reset login attempts on successful login
    if (user.login_attempts > 0) {
      await user.update({ login_attempts: 0, locked_until: null });
    }

    // Check if email verified (optional - can be disabled for development)
    if (!user.email_verified && process.env.NODE_ENV === 'production') {
      throw new ValidationError('Email verification required', {
        email: 'Please verify your email before logging in',
      });
    }

    // Generate tokens
    const accessToken = TokenService.generateAccessToken(user.id);
    const refreshToken = await TokenService.generateRefreshToken(user.id, metadata);

    // Update last login
    await UserService.updateLastLogin(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Google OAuth authentication
   * Validates Google token and creates/updates user
   * @param {string} accessToken - Google access token
   * @param {object} metadata - IP address, user agent
   * @returns {Promise<object>} { user, accessToken, refreshToken }
   * @throws {AuthError} If Google token invalid
   */
  static async googleAuth(accessToken, metadata = {}) {
    try {
      // Verify token with Google
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const googleData = response.data;

      if (!googleData.email) {
        throw new AuthError('Google authentication failed: no email');
      }

      // Find or create user
      let user = await UserService.findByEmail(googleData.email);

      if (!user) {
        // Create new user from Google data
        user = await User.create({
          name: googleData.name || 'Google User',
          email: googleData.email,
          password: bcrypt.hashSync(Math.random().toString(), 10), // Random password for OAuth users
          location: '', // User can set this later
          email_verified: true, // Google verified emails
          email_verified_at: new Date(),
          profilePicture: googleData.picture || null,
          google_id: googleData.id,
        });
      } else if (!user.google_id) {
        // Link Google account to existing user
        await user.update({
          google_id: googleData.id,
          profilePicture: googleData.picture || user.profilePicture,
        });
      }

      // Generate tokens
      const jwtAccessToken = TokenService.generateAccessToken(user.id);
      const refreshToken = await TokenService.generateRefreshToken(user.id, metadata);

      // Update last login
      await UserService.updateLastLogin(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        },
        accessToken: jwtAccessToken,
        refreshToken,
      };
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError('Google authentication failed: ' + err.message);
    }
  }

  /**
   * Logout user
   * Revokes refresh token
   * @param {string} refreshToken - Refresh token to revoke
   * @returns {Promise<void>}
   */
  static async logout(refreshToken) {
    if (refreshToken) {
      await TokenService.revokeRefreshToken(refreshToken);
    }
  }

  /**
   * Logout from all devices
   * Revokes all refresh tokens for user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async logoutAllDevices(userId) {
    await TokenService.revokeAllUserTokens(userId);
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token from cookie
   * @returns {Promise<string>} New access token
   * @throws {AuthError} If refresh token invalid
   */
  static async refreshToken(refreshToken) {
    const accessToken = await TokenService.refreshAccessToken(refreshToken);
    return accessToken;
  }

  /**
   * Request password reset
   * Generates token and sends email
   * @param {string} email - User email
   * @returns {Promise<object>} { message, sent: true/false }
   */
  static async requestPasswordReset(email) {
    const user = await UserService.findByEmail(email);

    // Security: Don't reveal if email exists
    if (!user) {
      return {
        message: 'If an account exists with this email, you will receive a password reset link.',
        sent: false,
      };
    }

    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const hashedToken = bcrypt.hashSync(resetToken, 10);

    // Save to database
    await UserService.setPasswordResetToken(user.id, hashedToken);

    // TODO: Send reset email with token
    // await EmailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'If an account exists with this email, you will receive a password reset link.',
      sent: true,
      // For development only - remove in production
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    };
  }

  /**
   * Reset password with token
   * @param {string} resetToken - Token from email
   * @param {string} newPassword - New password
   * @returns {Promise<object>} { message }
   * @throws {AuthError} If token invalid/expired
   */
  static async resetPassword(resetToken, newPassword) {
    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        password_reset_token: { [require('sequelize').Op.not]: null },
      },
    });

    if (!user) {
      throw new AuthError('Invalid or expired reset token');
    }

    // Verify token hasn't expired
    if (user.password_reset_token_expires_at < new Date()) {
      throw new AuthError('Reset token has expired');
    }

    // Verify token matches
    const tokenMatch = bcrypt.compareSync(resetToken, user.password_reset_token);
    if (!tokenMatch) {
      throw new AuthError('Invalid reset token');
    }

    // Update password (will be hashed by hook)
    await UserService.updatePassword(user.id, newPassword);

    // Clear reset token
    await UserService.clearPasswordResetToken(user.id);

    // Revoke all refresh tokens (force re-login everywhere)
    await TokenService.revokeAllUserTokens(user.id);

    return {
      message: 'Password reset successful. Please log in with your new password.',
    };
  }

  /**
   * Verify email with token
   * @param {string} verificationToken - Token from email
   * @returns {Promise<object>} { message }
   * @throws {AuthError} If token invalid
   */
  static async verifyEmail(verificationToken) {
    // TODO: Find user by verification token and verify
    // For now, return success
    return {
      message: 'Email verification successful. You can now log in.',
    };
  }

  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {Promise<object>} { message }
   */
  static async resendVerificationEmail(email) {
    const user = await UserService.findByEmail(email);

    if (!user) {
      return {
        message: 'If an account exists with this email, a verification email will be sent.',
      };
    }

    if (user.email_verified) {
      return {
        message: 'This email is already verified.',
      };
    }

    // TODO: Send verification email
    // await EmailService.sendVerificationEmail(user);

    return {
      message: 'Verification email has been sent. Please check your inbox.',
    };
  }
}

module.exports = AuthService;
