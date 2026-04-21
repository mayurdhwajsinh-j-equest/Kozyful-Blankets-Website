// backend/controllers/auth.controller.js  — only login shown, rest unchanged
const bcrypt = require('bcryptjs');
const db = require('../models');
const { generateToken } = require('../middleware/auth');
const { User } = db;

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // new signups are always regular users
      isActive: true,
    });

    const token = generateToken(user.id, user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user.id, name: user.name, email: user.email, role: user.role, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'User account is inactive' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ← role is now included in the token
    const token = generateToken(user.id, user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { id: user.id, name: user.name, email: user.email, role: user.role, token },
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logout successful. Please delete the token on client side.' });
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await user.update({ password: hashedPassword });

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, resetPassword };
