const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/bestsellers', productController.getBestSellers);
router.get('/:id', productController.getProductById);

// Admin routes (protected)
router.post('/', verifyToken, validate(schemas.createProduct), productController.createProduct);
router.put('/:id', verifyToken, validate(schemas.updateProduct), productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
