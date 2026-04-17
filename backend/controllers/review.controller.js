const db = require('../models');

const { Review, Product, User } = db;

/**
 * Create product review
 * POST /api/reviews
 */
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.userId;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { productId, userId }
    });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create review
    const review = await Review.create({
      productId,
      userId,
      rating,
      comment: comment || null
    });

    // Update product rating (average of all reviews)
    const reviews = await Review.findAll({
      where: { productId },
      attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating']]
    });

    const avgRating = reviews[0]?.dataValues?.avgRating || 0;
    await product.update({ rating: parseFloat(avgRating).toFixed(2) });

    const createdReview = await Review.findByPk(review.id, {
      include: [
        { model: Product, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: createdReview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product reviews with pagination
 * GET /api/reviews/product/:productId
 */
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
    const offset = (page - 1) * limit;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { count, rows } = await Review.findAndCountAll({
      where: { productId },
      include: [
        { model: User, attributes: ['id', 'name'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy === 'helpful' ? 'helpful' : 'createdAt', 'DESC']],
      subQuery: false
    });

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reviews for user
 * GET /api/reviews/user/:userId
 */
const getUserReviews = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { count, rows } = await Review.findAndCountAll({
      where: { userId },
      include: [
        { model: Product, attributes: ['id', 'name', 'image'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'User reviews fetched successfully',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get review by ID
 * GET /api/reviews/:id
 */
const getReviewById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id, {
      include: [
        { model: Product, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name'] }
      ]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review fetched successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update review
 * PUT /api/reviews/:id
 */
const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check authorization
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const oldRating = review.rating;
    await review.update({ rating, comment });

    // Update product rating if rating changed
    if (oldRating !== rating) {
      const reviews = await Review.findAll({
        where: { productId: review.productId },
        attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating']]
      });

      const avgRating = reviews[0]?.dataValues?.avgRating || 0;
      const product = await Product.findByPk(review.productId);
      await product.update({ rating: parseFloat(avgRating).toFixed(2) });
    }

    const updatedReview = await Review.findByPk(id, {
      include: [
        { model: Product, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'name'] }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete review
 * DELETE /api/reviews/:id
 */
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check authorization
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const productId = review.productId;
    await review.destroy();

    // Update product rating
    const reviews = await Review.findAll({
      where: { productId },
      attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating']]
    });

    const avgRating = reviews.length > 0 ? reviews[0]?.dataValues?.avgRating : 0;
    const product = await Product.findByPk(productId);
    await product.update({ rating: parseFloat(avgRating).toFixed(2) });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark review as helpful
 * PUT /api/reviews/:id/helpful
 */
const markHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.update({ helpful: review.helpful + 1 });

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  getReviewById,
  updateReview,
  deleteReview,
  markHelpful
};
