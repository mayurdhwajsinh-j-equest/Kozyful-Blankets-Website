const express = require('express');
const cors = require('cors');
const path = require('path'); // ← was missing
const dotenv = require('dotenv');
const db = require('./models');
const { errorHandler } = require('./middleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // ← single cors call, removed duplicate
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
db.sequelize.authenticate()
  .then(() => console.log('✓ Database connected successfully'))
  .catch((error) => {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  });

// Sync models
db.sequelize.sync({ alter: false })
  .then(() => console.log('✓ Database synced'))
  .catch((error) => console.error('✗ Database sync failed:', error.message));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reviews', require('./routes/review.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
