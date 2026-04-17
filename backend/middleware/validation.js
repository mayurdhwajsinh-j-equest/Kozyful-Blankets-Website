const Joi = require('joi');

/**
 * Validate request body against a schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req.body = value;
    next();
  };
};

// Validation schemas
const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be valid',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(6).max(50).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(6).required()
  }),

  // Product schemas
  createProduct: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().positive().required(),
    discountPrice: Joi.number().positive().optional(),
    stock: Joi.number().integer().min(0).required(),
    category: Joi.string().max(50).required(),
    image: Joi.string().optional(),
    isBestSeller: Joi.boolean().optional()
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().positive().optional(),
    discountPrice: Joi.number().positive().optional(),
    stock: Joi.number().integer().min(0).optional(),
    category: Joi.string().max(50).optional(),
    image: Joi.string().optional(),
    isBestSeller: Joi.boolean().optional(),
    isActive: Joi.boolean().optional()
  }),

  // Review schemas
  createReview: Joi.object({
    productId: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500).optional()
  }),

  // Order schemas
  createOrder: Joi.object({
    totalAmount: Joi.number().positive().required(),
    shippingAddress: Joi.string().required(),
    paymentMethod: Joi.string().max(50).optional(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required()
      })
    ).required()
  }),

  // User schemas
  updateUser: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional()
  })
};

module.exports = {
  validate,
  schemas
};
