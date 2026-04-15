# Backend Database Setup Guide - MySQL & Sequelize ORM

## Overview
This guide covers setting up MySQL database connection and creating models using Sequelize ORM for the Kozyful Blankets Website backend.

---

## Table of Contents
1. [Prerequisites & Installation](#prerequisites--installation)
2. [Database Configuration](#database-configuration)
3. [Sequelize Setup](#sequelize-setup)
4. [Creating Models](#creating-models)
5. [Migrations](#migrations)
6. [Best Practices](#best-practices)
7. [Example Implementation](#example-implementation)

---

## Prerequisites & Installation

### Required Packages
Install the following npm packages in your backend directory:

```bash
npm install sequelize mysql2 dotenv
npm install --save-dev sequelize-cli
```

### Versions Recommended
- **sequelize**: ^6.35.0
- **mysql2**: ^3.6.0
- **dotenv**: ^16.0.0

### What Each Package Does:
- **sequelize**: ORM for Node.js
- **mysql2**: MySQL database driver
- **dotenv**: Environment variable management
- **sequelize-cli**: Command-line tool for migrations

---

## Database Configuration

### Step 1: Create Environment File
Create a `.env` file in the backend root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kozyful_blankets
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql

# Server Configuration
NODE_ENV=development
PORT=5000
```

### Step 2: Update Database Config File
Update `backend/config/db.js`:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Database connected successfully');
  })
  .catch((error) => {
    console.error('✗ Database connection failed:', error);
  });

module.exports = sequelize;
```

### Step 3: Create MySQL Database
Create the database in MySQL:

```sql
CREATE DATABASE IF NOT EXISTS kozyful_blankets;
```

---

## Sequelize Setup

### Initialize Sequelize
Run this command in the backend directory:

```bash
npx sequelize-cli init
```

This creates:
- `config/` - Database configuration
- `migrations/` - Migration files
- `models/` - Model definitions
- `seeders/` - Seed data

### Update .sequelizerc (Optional but Recommended)
Create `.sequelizerc` file in backend root:

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('config', 'database.js'),
  'models-path': path.resolve('models'),
  'seeders-path': path.resolve('seeders'),
  'migrations-path': path.resolve('migrations')
};
```

---

## Creating Models

### Model Creation Methods

#### Method 1: Manual Model Creation
Create `backend/models/User.js`:

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
```

#### Method 2: Using sequelize-cli Generate
```bash
npx sequelize-cli model:generate --name Product --attributes name:string,description:text,price:float,stock:integer
```

---

## Model Definitions (Example Models)

### 1. User Model
`backend/models/User.js`

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
```

**Fields:**
- **id**: Auto-increment primary key
- **name**: User's full name (from registration form)
- **email**: Unique email address (validated)
- **password**: Hashed password (never store plain text)
- **isActive**: Account status flag
- **createdAt/updatedAt**: Automatically managed timestamps

### 2. Product Model
`backend/models/Product.js`

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  isBestSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;
```

### 3. Order Model
`backend/models/Order.js`

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;
```

### 4. OrderItem Model
`backend/models/OrderItem.js`

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: true
});

module.exports = OrderItem;
```

### 5. Review Model
`backend/models/Review.js`

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  helpful: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'reviews',
  timestamps: true
});

module.exports = Review;
```

---

## Migrations

### Creating a Migration
```bash
npx sequelize-cli migration:create --name create-users
```

### Migration Example
`backend/migrations/[timestamp]-create-users.js`:

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
```

### Running Migrations
```bash
# Run all pending migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

---

## Best Practices

### 1. Model Organization
- Create a separate file for each model
- Use descriptive names (singular form: User, Product, Order)
- Store all models in `backend/models/` directory

### 2. Associations
```javascript
// In a separate file or model initialization file
const User = require('./models/User');
const Order = require('./models/Order');
const Product = require('./models/Product');
const Review = require('./models/Review');

// Define associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Order, { through: 'OrderItem' });
Order.hasMany(Product, { through: 'OrderItem' });

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });
```

### 3. Validation
```javascript
// Add validations in models
email: {
  type: DataTypes.STRING,
  validate: {
    isEmail: true,
    len: [5, 100]
  }
},
price: {
  type: DataTypes.DECIMAL(10, 2),
  validate: {
    min: 0
  }
}
```

### 4. Hooks
```javascript
// Use hooks for auto-operations
User.beforeCreate(async (user) => {
  // Hash password before saving
});

Product.beforeUpdate(async (product) => {
  // Update lastModified timestamp
});
```

### 5. Error Handling
- Use try-catch blocks in queries
- Handle Sequelize validation errors
- Log database errors appropriately

---

## Example Implementation

### Initialize All Models
Create `backend/models/index.js`:

```javascript
const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');

// Define associations
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Database synchronized');
  } catch (error) {
    console.error('✗ Database sync failed:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Review,
  syncDatabase
};
```

### Example API Route
```javascript
const express = require('express');
const { Product } = require('../models');

const router = express.Router();

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

---

## Troubleshooting

### Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check `.env` file has correct credentials
- Ensure database exists

### Migration Issues
```bash
# Clear migration history if stuck
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

### Model Sync Issues
- Use `alter: false` in production
- Use migrations for production changes
- Backup data before altering tables

---

## Summary Checklist
- [ ] Install required packages
- [ ] Create `.env` file with database credentials
- [ ] Update `backend/config/db.js`
- [ ] Create MySQL database
- [ ] Create model files
- [ ] Define model associations
- [ ] Run migrations
- [ ] Test database connection
- [ ] Set up routes that use models

---

## Useful Resources
- [Sequelize Documentation](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/)
- [Sequelize CLI](https://github.com/sequelize/cli)
