// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Verify JWT token from Authorization header
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
};

/**
 * Check if logged-in user is admin
 * Must be used AFTER verifyToken
 */
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

/**
 * Generate JWT token — now includes role
 */
const generateToken = (userId, email, role = 'user') => {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { verifyToken, isAdmin, generateToken };
