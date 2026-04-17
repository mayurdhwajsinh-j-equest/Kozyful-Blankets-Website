const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/user/:userId', reviewController.getUserReviews);
router.get('/:id', reviewController.getReviewById);

// User routes (protected)
router.post('/', verifyToken, validate(schemas.createReview), reviewController.createReview);
router.put('/:id', verifyToken, reviewController.updateReview);
router.delete('/:id', verifyToken, reviewController.deleteReview);
router.put('/:id/helpful', reviewController.markHelpful);

module.exports = router;
