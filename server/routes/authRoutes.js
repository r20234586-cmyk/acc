const express = require('express');
const {
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
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  emailVerificationSchema,
  updateProfileSchema,
} = require('../utils/validation/schemas');

const router = express.Router();

// Auth endpoints
router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.post('/google', validateRequest(googleAuthSchema), googleAuth);
router.post('/logout', logout);

// Token refresh
router.post('/refresh', refreshToken);

// Profile endpoints (protected)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validateRequest(updateProfileSchema), updateProfile);
router.get('/stats', auth, getUserStats);

// User endpoints (public)
router.get('/user/:userId', getUserById);
router.get('/user/:userId/stats', getUserStatsById);

// Password reset
router.post('/request-password-reset', validateRequest(passwordResetRequestSchema), requestPasswordReset);
router.post('/reset-password', validateRequest(passwordResetSchema), resetPassword);

// Email verification
router.post('/verify-email', validateRequest(emailVerificationSchema), verifyEmail);
router.post('/resend-verification', validateRequest(passwordResetRequestSchema), resendVerificationEmail);

module.exports = router;

