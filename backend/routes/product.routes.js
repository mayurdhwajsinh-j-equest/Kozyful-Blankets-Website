// ─────────────────────────────────────────────────────────────
// routes/product.routes.js
// ─────────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const upload = require('../middleware/upload'); // multer config

// Public routes
router.get('/', productController.getAllProducts);
router.get('/bestsellers', productController.getBestSellers);
router.get('/:id', productController.getProductById);

// Admin routes — order matters:
// 1. verifyToken  → authenticate
// 2. upload       → parse FormData into req.body + req.file
// 3. validate     → now req.body has values, coercion works
router.post(
  '/',
  verifyToken,
  upload.single('image'),
  validate(schemas.createProduct),
  productController.createProduct
);

router.put(
  '/:id',
  verifyToken,
  upload.single('image'),
  validate(schemas.updateProduct),
  productController.updateProduct
);

router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;


// ─────────────────────────────────────────────────────────────
// controllers/product.controller.js  (createProduct + updateProduct updated)
// ─────────────────────────────────────────────────────────────

// const db = require('../models');
// const { Product } = db;

/*
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, stock, category, isBestSeller } = req.body;

    // If a file was uploaded via multer, use its path; otherwise fall back to body value
    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : req.body.image || null;

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      stock: stock || 0,
      category,
      image,
      isBestSeller: isBestSeller || false,
      isActive: true,
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Only update image if a new file was uploaded
    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.update(updateData);
    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    next(error);
  }
};
*/
