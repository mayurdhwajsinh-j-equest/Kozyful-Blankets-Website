const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// ── Middleware to block admins from placing/viewing orders as customers ──
const blockAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admins cannot place or manage customer orders from this endpoint.'
    });
  }
  next();
};

// ── Admin routes FIRST (before /:id) ──
router.get('/admin/all', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);

// ── Customer routes ──
router.post('/', verifyToken, blockAdmin, validate(schemas.createOrder), orderController.createOrder);
router.get('/', verifyToken, blockAdmin, orderController.getUserOrders);
router.get('/:id', verifyToken, blockAdmin, orderController.getOrderById);
router.put('/:id/cancel', verifyToken, blockAdmin, orderController.cancelOrder);

module.exports = router;