# Database Associations & Connection Setup Guide

## Overview
This document outlines all database associations, the consolidated connection setup, and how to use models throughout the application.

## Architecture Changes

### 1. Single Database Connection (No Duplicates)
Previously, the application had TWO separate Sequelize instances:
- One in `config/db.js`
- One in `models/index.js`

**Now:** Only ONE Sequelize instance is created in `config/db.js`, which is imported and used by `models/index.js`. This ensures:
- ✅ No duplicate connections
- ✅ Proper connection pooling
- ✅ Shared connection state across all models
- ✅ Cleaner memory management

### 2. Connection Flow
```
config/db.js (creates Sequelize instance)
    ↓
models/index.js (loads all models with this instance)
    ↓
server.js (uses db.sequelize for authentication & sync)
```

---

## Database Model Associations

### User Model
**Table:** `users`

**Associations:**
- `User.hasMany(Order)` - One user can have many orders
- `User.hasMany(Review)` - One user can have many reviews

```javascript
// Usage in code:
const user = await User.findByPk(1, { include: ['Orders', 'Reviews'] });
```

---

### Product Model
**Table:** `products`

**Associations:**
- `Product.hasMany(Review)` - One product can have many reviews
- `Product.hasMany(OrderItem)` - One product can appear in many order items

```javascript
// Usage in code:
const product = await Product.findByPk(1, { include: ['Reviews', 'OrderItems'] });
```

---

### Order Model
**Table:** `orders`

**Associations:**
- `Order.belongsTo(User)` - Each order belongs to one user
- `Order.hasMany(OrderItem)` - One order can have many items

```javascript
// Usage in code:
const order = await Order.findByPk(1, { include: ['User', 'OrderItems'] });
```

---

### OrderItem Model
**Table:** `order_items`

**Associations:**
- `OrderItem.belongsTo(Order)` - Each item belongs to one order
- `OrderItem.belongsTo(Product)` - Each item references one product

```javascript
// Usage in code:
const orderItem = await OrderItem.findByPk(1, { include: ['Order', 'Product'] });
```

---

### Review Model
**Table:** `reviews`

**Associations:**
- `Review.belongsTo(Product)` - Each review is for one product
- `Review.belongsTo(User)` - Each review is by one user

```javascript
// Usage in code:
const review = await Review.findByPk(1, { include: ['Product', 'User'] });
```

---

## Association Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                          User                               │
│                      (users table)                           │
└──────────────────┬──────────────────┬──────────────────────┘
                   │                  │
         hasMany   │1:N               │1:N    hasMany
                   │                  │
            ┌──────▼─────┐     ┌──────▼──────┐
            │   Order     │     │   Review    │
            │ (orders)    │     │ (reviews)   │
            └──────┬─────┘     └──────┬──────┘
                   │                  │
         hasMany   │1:N               │1:N    belongsTo
                   │                  │
           ┌───────▼────────┐   ┌─────▼────────────┐
           │  OrderItem     │   │    Product       │
           │(order_items)   │   │  (products)      │
           └────────────────┘   └──────────────────┘
                   │                    ▲
                   └────────────────────┘
               belongsTo Product
```

---

## How to Use Models

### Importing Models in Routes/Controllers
```javascript
const db = require('../models');
const { User, Product, Order, OrderItem, Review } = db;

// Or import the sequelize instance
const sequelize = db.sequelize;
```

### Creating Records with Associations
```javascript
// Create a user with an order
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed_password'
});

const order = await user.createOrder({
  totalAmount: 100,
  status: 'pending',
  shippingAddress: '123 Main St'
});

// Create order items
await order.createOrderItem({
  productId: 1,
  quantity: 2,
  price: 50
});
```

### Querying with Associations (Eager Loading)
```javascript
// Get user with all orders and reviews
const user = await User.findByPk(1, {
  include: [
    { model: Order, include: [OrderItem] },
    { model: Review }
  ]
});

// Get product with reviews (including reviewer info)
const product = await Product.findByPk(1, {
  include: [
    { 
      model: Review, 
      include: [{ model: User, attributes: ['name', 'email'] }]
    }
  ]
});

// Get order with all details
const order = await Order.findByPk(1, {
  include: [
    { model: User },
    { 
      model: OrderItem, 
      include: [{ model: Product }]
    }
  ]
});
```

### Cascade Delete
All associations are set with `onDelete: 'CASCADE'`, which means:
- Deleting a user deletes all their orders and reviews
- Deleting an order deletes all its order items
- Deleting a product deletes all its reviews and order items

---

## Server Initialization Flow

When `server.js` starts:

1. **Load Models** → `db = require('./models')`
   - Creates single Sequelize instance from `config/db.js`
   - Loads all model files
   - Sets up all associations

2. **Authenticate** → `db.sequelize.authenticate()`
   - Verifies database connection
   - Exits if connection fails

3. **Sync Models** → `db.sequelize.sync()`
   - Creates all tables if they don't exist
   - Respects existing tables (doesn't drop/alter by default)

4. **Mount Routes** → Uses the models in route handlers

---

## Environment Variables Required

```env
DB_NAME=kozyful_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
```

---

## Migration Notes

- All models now use the function pattern `module.exports = (sequelize, DataTypes) => {}`
- This allows proper integration with `models/index.js`
- Previously, models couldn't have associations - now they do
- No changes needed to database schema, only application code

---

## Testing the Setup

```bash
# Start the server
npm start

# Check console output:
# ✓ Database connected successfully
# ✓ Database synced
# Server running on http://localhost:PORT

# Test health endpoint
curl http://localhost:3000/api/health
```

---

## Common Queries

### Get all orders for a user
```javascript
const orders = await Order.findAll({
  where: { userId: userId },
  include: [{ model: OrderItem, include: [Product] }]
});
```

### Get all reviews for a product with user info
```javascript
const reviews = await Review.findAll({
  where: { productId: productId },
  include: [{ model: User, attributes: ['id', 'name'] }]
});
```

### Get order with complete details
```javascript
const order = await Order.findByPk(orderId, {
  include: [
    User,
    { 
      model: OrderItem, 
      include: [Product],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  ]
});
```

---

## Best Practices

1. **Always use eager loading** when you need related data
2. **Select specific attributes** to reduce query payload
3. **Use transactions** for multi-step operations
4. **Validate data** before creating/updating records
5. **Handle errors** gracefully in route handlers
6. **Log database operations** during development

---

## Troubleshooting

**Error: "Cannot find module"**
- Ensure all model files export a function, not a constant
- Check `models/index.js` is importing all models

**Error: "Foreign key constraint fails"**
- Ensure referenced records exist before creating child records
- Check `onDelete` cascade settings

**Error: "Duplicate entry"**
- Check unique constraints (like email in users)
- Verify data before insertion

---

Last Updated: April 17, 2026
