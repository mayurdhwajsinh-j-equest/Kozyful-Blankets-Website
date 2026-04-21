const bcrypt = require('bcryptjs');
const db = require('../models');
const { User } = db;

/**
 * Get all customers (admin only) — excludes admin accounts
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: { role: 'user' },          // ← only return customers, not admins
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
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
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: db.Order, attributes: ['id', 'totalAmount', 'status', 'createdAt'] },
        { model: db.Review, attributes: ['id', 'rating', 'comment', 'createdAt'] }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: db.Order, attributes: ['id', 'totalAmount', 'status', 'createdAt'] },
        { model: db.Review, attributes: ['id', 'rating', 'comment', 'createdAt'] }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User profile fetched successfully', data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (req.userId !== parseInt(id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this user' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
    }

    const updateData = { name, email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await user.update(updateData);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.destroy();

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser
};