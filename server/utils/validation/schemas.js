const joi = require('joi');

/**
 * Validation schemas using Joi
 * Used in validateRequest middleware
 */

const registerSchema = joi.object({
  name: joi
    .string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 100 characters',
    }),

  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'email.base': 'Please enter a valid email address',
      'string.empty': 'Email is required',
    }),

  password: joi
    .string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w])/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and a special character',
      'string.min': 'Password must be at least 8 characters',
      'string.empty': 'Password is required',
    }),

  location: joi
    .string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Location is required',
    }),

  interests: joi
    .array()
    .items(joi.string().trim())
    .default([])
    .messages({
      'array.base': 'Interests must be an array',
    }),

  timePreferences: joi
    .array()
    .items(joi.string().trim())
    .default([])
    .messages({
      'array.base': 'Time preferences must be an array',
    }),
});

const loginSchema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'email.base': 'Please enter a valid email address',
      'string.empty': 'Email is required',
    }),

  password: joi
    .string()
    .required()
    .messages({
      'string.empty': 'Password is required',
    }),
});

const googleAuthSchema = joi.object({
  access_token: joi
    .string()
    .required()
    .messages({
      'string.empty': 'Access token is required',
    }),
});

const passwordResetRequestSchema = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      'email.base': 'Please enter a valid email address',
      'string.empty': 'Email is required',
    }),
});

const passwordResetSchema = joi.object({
  token: joi
    .string()
    .required()
    .messages({
      'string.empty': 'Reset token is required',
    }),

  password: joi
    .string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w])/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and a special character',
      'string.min': 'Password must be at least 8 characters',
      'string.empty': 'Password is required',
    }),
});

const emailVerificationSchema = joi.object({
  token: joi
    .string()
    .required()
    .messages({
      'string.empty': 'Verification token is required',
    }),
});

const updateProfileSchema = joi.object({
  name: joi
    .string()
    .min(2)
    .max(100)
    .trim(),

  bio: joi
    .string()
    .max(500)
    .trim()
    .allow(''),

  location: joi
    .string()
    .trim(),

  interests: joi
    .array()
    .items(joi.string().trim()),

  timePreferences: joi
    .array()
    .items(joi.string().trim()),

  profilePicture: joi
    .string()
    .allow(null, '')
    .messages({
      'string.base': 'Profile picture must be a string',
    }),

  media: joi
    .array()
    .items(
      joi.object({
        id: joi.number().required(),
        type: joi.string().valid('photo', 'video').required(),
        title: joi.string().trim().required(),
        image: joi.string().required(),
        color: joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
      })
    ),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

module.exports = {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  emailVerificationSchema,
  updateProfileSchema,
};
