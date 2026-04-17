const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Admin routes
router.get('/', verifyToken, userController.getAllUsers);
router.get('/admin/all', verifyToken, userController.getAllUsers);

// User routes
router.get('/profile/me', verifyToken, userController.getCurrentUser);
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, validate(schemas.updateUser), userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
