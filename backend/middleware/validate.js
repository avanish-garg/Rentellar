const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Common validation rules
exports.commonValidations = {
  id: {
    in: ['params'],
    isMongoId: true,
    errorMessage: 'Invalid ID format'
  },
  email: {
    in: ['body'],
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Please provide a valid email address'
  },
  password: {
    in: ['body'],
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long'
    },
    matches: {
      options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
      errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  address: {
    in: ['body'],
    matches: {
      options: /^0x[a-fA-F0-9]{64}$/,
      errorMessage: 'Invalid blockchain address format'
    }
  },
  amount: {
    in: ['body'],
    isFloat: {
      options: { min: 0 },
      errorMessage: 'Amount must be a positive number'
    }
  },
  date: {
    in: ['body'],
    isISO8601: true,
    errorMessage: 'Invalid date format'
  },
  image: {
    in: ['file'],
    custom: {
      options: (value, { req }) => {
        if (!req.file) {
          throw new Error('Image file is required');
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          throw new Error('Invalid image format. Supported formats: jpg, jpeg, png, gif');
        }
        if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('Image size must be less than 5MB');
        }
        return true;
      }
    }
  }
}; 