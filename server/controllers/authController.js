const { AuthService } = require('../services/auth');
const { UserService } = require('../services/user');
const TokenService = require('../services/auth/TokenService');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

/**
 * Register a new user
 * Validates input and creates account
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, location, interests, timePreferences } = req.body;

    // Debug logging
    console.log('Registration attempt:', { name, email, location, interests, timePreferences });

    const result = await AuthService.register({
      name,
      email,
      password,
      location,
      interests,
      timePreferences,
    });

    console.log('Registration successful:', result.user.id);
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      fields: error.fields,
      statusCode: error.statusCode,
    });
    next(error);
  }
};

/**
 * Login with email and password
 * Returns access and refresh tokens
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Get IP and user agent for token metadata
    const metadata = {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    const result = await AuthService.login(email, password, metadata);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token as httpOnly cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Google OAuth authentication
 * Validates Google token and creates/updates user
 */
const googleAuth = async (req, res, next) => {
  try {
    const { access_token } = req.body;

    const metadata = {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    const result = await AuthService.googleAuth(access_token, metadata);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Set access token as httpOnly cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Google authentication successful',
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * Requires authentication
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await UserService.getPrivateProfile(req.userId);

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * Requires authentication
 */
const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;

    const user = await UserService.update(req.userId, updates);

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get public user profile by ID
 * No authentication required
 */
const getUserById = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const user = await UserService.getPublicProfile(userId);

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user statistics
 * Requires authentication
 */
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Get user
    const user = await UserService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Calculate stats
    const userActivities = await Activity.findAll({
      where: { joined: { [Op.contains]: [userId] } },
    });

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activitiesThisWeek = userActivities.filter(
      a => new Date(a.time) >= oneWeekAgo
    ).length;

    // Calculate day streak (deduplicate dates first)
    const activityDates = [...new Set(userActivities
      .map(a => new Date(a.time).toDateString()))]
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date();
    for (const date of activityDates) {
      if (new Date(date).toDateString() === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }

    // People met (unique users from joined activities)
    const peopleMet = new Set();
    userActivities.forEach(activity => {
      activity.joined.forEach(id => {
        if (id !== userId) peopleMet.add(id);
      });
    });

    res.status(200).json({
      stats: {
        hosted: user.hostedActivities?.length || 0,
        joined: userActivities.length,
        people: peopleMet.size,
        rating: user.rating.toFixed(1),
        activitiesThisWeek,
        dayStreak: streak,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user stats by ID (public)
 * No authentication required
 */
const getUserStatsById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await UserService.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get activities
    const hostedActivities = await Activity.findAll({
      where: { hostId: userId },
    });

    const joinedActivities = await Activity.findAll({
      where: { joined: { [Op.contains]: [userId] } },
    });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        location: user.location,
        interests: user.interests,
        rating: user.rating,
        media: user.media,
      },
      stats: {
        hosted: hostedActivities.length,
        joined: joinedActivities.length,
        rating: user.rating.toFixed(1),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * Uses refresh token from cookie
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        error: {
          code: 'NO_TOKEN',
          message: 'Refresh token required',
        },
      });
    }

    const accessToken = await AuthService.refreshToken(token);

    // Set new access token cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout
 * Clears refresh token cookie
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset
 * Sends reset email
 */
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await AuthService.requestPasswordReset(email);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const result = await AuthService.resetPassword(token, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email with token
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const result = await AuthService.verifyEmail(token);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Resend verification email
 */
const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await AuthService.resendVerificationEmail(email);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  getProfile,
  updateProfile,
  getUserById,
  getUserStats,
  getUserStatsById,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};
