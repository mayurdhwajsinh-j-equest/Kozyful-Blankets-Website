const Joi = require('joi');

/**
 * Validate request body against a schema
 * Works with both JSON and multipart/form-data (multer) requests
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true, // ← coerces "25" → 25, "true" → true (needed for FormData)
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }
    req.body = value;
    next();
  };
};

const schemas = {
  // ── Auth ────────────────────────────────────────────────────
  register: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be valid',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).max(50).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(6).required(),
  }),

  // ── Products ─────────────────────────────────────────────────
  createProduct: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(2000).optional().allow(''),
    price: Joi.number().positive().required(),
    discountPrice: Joi.number().positive().optional().allow('', null),
    stock: Joi.number().integer().min(0).optional().default(0),
    category: Joi.string().max(50).required(),
    image: Joi.string().optional().allow(''),
    isBestSeller: Joi.boolean().optional().default(false),
    // ── new fields ──
    material: Joi.string().optional().allow(''),
    pattern: Joi.string().optional().allow(''),
    fill: Joi.string().optional().allow(''),
    types: Joi.string().optional().allow(''),   // JSON string
    sizes: Joi.string().optional().allow(''),   // JSON string
    dispatchInfo: Joi.string().optional().allow(''),
    isCustomizable: Joi.boolean().optional().default(false),
    klarnaEligible: Joi.boolean().optional().default(false),
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(2000).optional().allow(''),
    price: Joi.number().positive().optional(),
    discountPrice: Joi.number().positive().optional().allow('', null),
    stock: Joi.number().integer().min(0).optional(),
    category: Joi.string().max(50).optional(),
    image: Joi.string().optional().allow(''),
    isBestSeller: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    // ── new fields ──
    material: Joi.string().optional().allow(''),
    pattern: Joi.string().optional().allow(''),
    fill: Joi.string().optional().allow(''),
    types: Joi.string().optional().allow(''),   // JSON string
    sizes: Joi.string().optional().allow(''),   // JSON string
    dispatchInfo: Joi.string().optional().allow(''),
    isCustomizable: Joi.boolean().optional(),
    klarnaEligible: Joi.boolean().optional(),
  }),

  // ── Reviews ──────────────────────────────────────────────────
  createReview: Joi.object({
    productId: Joi.number().integer().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(500).optional(),
  }),

  // ── Orders ───────────────────────────────────────────────────
  createOrder: Joi.object({
    totalAmount: Joi.number().positive().required(),
    shippingAddress: Joi.string().required(),
    paymentMethod: Joi.string().max(50).optional(),
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.number().integer().required(),
          quantity: Joi.number().integer().min(1).required(),
          price: Joi.number().positive().required(),
        })
      )
      .required(),
  }),

  // ── Users ────────────────────────────────────────────────────
  updateUser: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
  }),
};

module.exports = { validate, schemas };
