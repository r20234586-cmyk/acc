const User = require('../../models/User');
const AuthError = require('../../utils/errors/AuthError');
const ValidationError = require('../../utils/errors/ValidationError');

/**
 * User service for user operations
 * Handles user CRUD operations independently of HTTP
 * Can be tested without Express
 */
class UserService {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} User object or null
   */
  static async findByEmail(email) {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    return user;
  }

  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<User|null>} User object or null
   */
  static async findById(userId) {
    const user = await User.findByPk(userId);
    return user;
  }

  /**
   * Create new user
   * @param {object} userData - { name, email, password, location, interests, timePreferences }
   * @returns {Promise<User>} Created user object
   * @throws {ValidationError} If email already exists
   */
  static async create(userData) {
    // Check if email already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ValidationError('Validation failed', {
        email: 'Email already in use',
      });
    }

    // Create user (password will be hashed by beforeCreate hook)
    const user = await User.create({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      location: userData.location,
      interests: userData.interests || [],
      timePreferences: userData.timePreferences || [],
      email_verified: false,
    });

    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {object} updates - Fields to update
   * @returns {Promise<User>} Updated user object
   */
  static async update(userId, updates) {
    const user = await this.findById(userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    // Update allowed fields only
    const allowedFields = [
      'name',
      'bio',
      'location',
      'interests',
      'timePreferences',
      'profilePicture',
      'media',
    ];

    const updateData = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    await user.update(updateData);
    return user;
  }

  /**
   * Update last login time
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async updateLastLogin(userId) {
    await User.update(
      { last_login: new Date() },
      { where: { id: userId } }
    );
  }

  /**
   * Verify user email
   * @param {string} userId - User ID
   * @returns {Promise<User>} Updated user
   */
  static async verifyEmail(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    await user.update({
      email_verified: true,
      email_verified_at: new Date(),
      email_verified_token: null,
      email_verified_token_expires_at: null,
    });

    return user;
  }

  /**
   * Set password reset token
   * @param {string} userId - User ID
   * @param {string} hashedToken - Bcrypt hashed token
   * @returns {Promise<void>}
   */
  static async setPasswordResetToken(userId, hashedToken) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await User.update(
      {
        password_reset_token: hashedToken,
        password_reset_token_expires_at: expiresAt,
      },
      { where: { id: userId } }
    );
  }

  /**
   * Clear password reset token
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  static async clearPasswordResetToken(userId) {
    await User.update(
      {
        password_reset_token: null,
        password_reset_token_expires_at: null,
      },
      { where: { id: userId } }
    );
  }

  /**
   * Update password
   * @param {string} userId - User ID
   * @param {string} newPassword - New password (will be hashed by beforeUpdate hook)
   * @returns {Promise<void>}
   */
  static async updatePassword(userId, newPassword) {
    // Must use instance.save() so the beforeUpdate bcrypt hook fires.
    // User.update() bypasses hooks and would store the password in plain text.
    const user = await User.findByPk(userId);
    if (!user) throw new AuthError('User not found');
    user.password = newPassword;
    await user.save();
  }

  /**
   * Get public user profile
   * Returns safe fields that can be shared publicly
   * @param {string} userId - User ID
   * @returns {Promise<object>} Public user data
   */
  static async getPublicProfile(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      bio: user.bio,
      location: user.location,
      profilePicture: user.profilePicture,
      interests: user.interests,
      rating: user.rating,
      media: user.media,
      last_login: user.last_login,
    };
  }

  /**
   * Get private user profile (full profile)
   * Only return to the user themselves
   * @param {string} userId - User ID
   * @returns {Promise<object>} Full user data
   */
  static async getPrivateProfile(userId) {
    const user = await this.findById(userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    // Return full user data (minus sensitive fields like password)
    return user.toJSON();
  }
}

module.exports = UserService;
