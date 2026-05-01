const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./models');
const { errorHandler } = require('./middleware');

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── 1. API ROUTES FIRST ──
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reviews', require('./routes/review.routes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ── 2. STATIC FRONTEND AFTER API ROUTES ──
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// ── 3. ERROR HANDLER LAST ──
app.use(errorHandler);

// Database
db.sequelize.authenticate()
  .then(() => console.log('✓ Database connected successfully'))
  .catch((error) => { console.error('✗ Database connection failed:', error.message); process.exit(1); });

db.sequelize.sync({ alter: true })
  .then(() => console.log('✓ Database synced'))
  .catch((error) => console.error('✗ Database sync failed:', error.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});