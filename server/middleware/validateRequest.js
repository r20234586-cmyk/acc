const ValidationError = require('../utils/errors/ValidationError');

/**
 * Middleware to validate request data
 * Validates body (or other properties) against a Joi schema
 * Transforms validation errors into field-level messages
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Get all errors, not just first
      stripUnknown: true, // Remove unknown fields
      presence: 'required', // Treat missing as error
    });

    // If validation passed, update request with cleaned data
    if (!error) {
      req[property] = value;
      return next();
    }

    // Transform joi errors into field-level messages
    const fields = {};
    error.details.forEach(detail => {
      const fieldName = detail.path[0];
      fields[fieldName] = detail.message;
    });

    // Pass validation error to error handler
    next(new ValidationError('Validation failed', fields));
  };
};

module.exports = validateRequest;
