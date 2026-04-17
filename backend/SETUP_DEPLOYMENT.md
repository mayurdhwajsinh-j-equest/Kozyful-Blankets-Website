# Backend Setup & Deployment Guide

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- **express** - Web framework
- **sequelize** - ORM
- **mysql2** - MySQL driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **joi** - Data validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload (devDependency)

### 2. Database Setup

Create a MySQL database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE kozyful_db;
CREATE USER 'kozyful_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON kozyful_db.* TO 'kozyful_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Configuration

Create `.env` file in the backend directory:

```env
# Database
DB_NAME=kozyful_db
DB_USER=kozyful_user
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server
PORT=5000
NODE_ENV=development
```

### 4. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Expected output:
```
✓ Database connected successfully
✓ Database synced
✓ Server running on http://localhost:5000
✓ Environment: development
```

## Project Structure

```
backend/
├── middleware/           # Middleware functions
│   ├── index.js
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Error handling
│   └── validation.js    # Input validation
├── controllers/         # Business logic
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── order.controller.js
│   └── review.controller.js
├── models/              # Data models
│   ├── index.js         # Model loader & associations
│   ├── user.model.js
│   ├── product.model.js
│   ├── order.model.js
│   ├── orderItem.models.js
│   └── review.model.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   └── review.routes.js
├── config/              # Configuration
│   ├── db.js            # Database connection
│   ├── config.js        # Configuration loader
│   └── config.json      # Environment configs
├── migrations/          # Database migrations
├── seeders/             # Database seeders
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env                 # Environment variables (not in git)
```

## Database Tables

The application automatically creates the following tables:

1. **users** - User accounts
2. **products** - Product catalog
3. **orders** - Customer orders
4. **order_items** - Items in each order
5. **reviews** - Product reviews

### Schema Overview

**users**
```
id (PK) | name | email (UNIQUE) | password | isActive | timestamps
```

**products**
```
id (PK) | name | description | price | discountPrice | stock | category | 
image | rating | isBestSeller | isActive | timestamps
```

**orders**
```
id (PK) | userId (FK) | totalAmount | status | shippingAddress | 
paymentMethod | trackingNumber | timestamps
```

**order_items**
```
id (PK) | orderId (FK) | productId (FK) | quantity | price | timestamps
```

**reviews**
```
id (PK) | productId (FK) | userId (FK) | rating | comment | helpful | timestamps
```

## API Testing

### Using cURL

```bash
# Health Check
curl http://localhost:5000/api/health

# Register User
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Pass123"}'

# Get Products
curl http://localhost:5000/api/products
```

### Using Postman

1. Import the API collection
2. Set base URL: `http://localhost:5000/api`
3. After login, add token to Authorization tab:
   - Type: Bearer Token
   - Token: `<paste_token_from_login_response>`

### Using Insomnia

Similar to Postman - create requests and manage authentication.

## Common Issues & Solutions

### Issue: Database Connection Failed

**Solution:**
- Check MySQL is running: `mysql -u root -p`
- Verify .env credentials
- Ensure database exists: `SHOW DATABASES;`

### Issue: Port Already in Use

**Solution:**
```bash
# Change PORT in .env
PORT=3001

# Or kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: JWT Token Invalid

**Solution:**
- Ensure JWT_SECRET is set in .env
- Token expires in 7 days - login again to get new token
- Include "Bearer " prefix in Authorization header

### Issue: CORS Error

**Solution:**
- CORS is already configured for all origins in development
- For production, update cors configuration in server.js:
  ```javascript
  app.use(cors({
    origin: ['https://yourdomain.com'],
    credentials: true
  }));
  ```

## Database Seeding

To populate sample data (when implemented):

```bash
npm run seed
```

## Running Migrations

Apply pending migrations:

```bash
npm run migrate
```

## Production Deployment

### 1. Prepare for Production

```bash
# Update .env
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
# Use strong password for DB

# Install production dependencies only
npm ci --only=production
```

### 2. Deployment Options

**Option A: Using PM2**
```bash
npm install -g pm2

# Start with PM2
pm2 start server.js --name "kozyful-api"

# Monitor
pm2 monit

# View logs
pm2 logs
```

**Option B: Using Docker**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
```

```bash
docker build -t kozyful-api .
docker run -p 5000:5000 --env-file .env kozyful-api
```

**Option C: Deploy to Heroku**
```bash
heroku login
heroku create kozyful-api
git push heroku main
```

### 3. Environment Variables for Production

```env
DB_NAME=prod_kozyful_db
DB_USER=prod_user
DB_PASSWORD=<strong-password>
DB_HOST=prod-db-host.com
DB_PORT=3306
JWT_SECRET=<strong-random-secret>
PORT=5000
NODE_ENV=production
```

### 4. Database Backups

```bash
# Backup
mysqldump -u root -p kozyful_db > backup.sql

# Restore
mysql -u root -p kozyful_db < backup.sql
```

## Performance Optimization

1. **Enable Query Caching** in MySQL config
2. **Add Database Indexes** on frequently searched fields
3. **Implement Rate Limiting** for API endpoints
4. **Use Pagination** for list endpoints (already implemented)
5. **Add Compression** middleware
6. **Monitor & Log** application performance

## Security Best Practices

1. ✅ Passwords hashed with bcryptjs
2. ✅ JWT authentication for protected routes
3. ✅ Input validation with Joi
4. ✅ CORS configured
5. ⚠️ Add rate limiting middleware (recommended)
6. ⚠️ Add request size limits (recommended)
7. ⚠️ Enable HTTPS in production
8. ⚠️ Set secure headers with helmet.js
9. ⚠️ Use environment variables for secrets

## Monitoring & Logging

For production, consider:

- **Winston** - Advanced logging
- **Morgan** - HTTP request logging
- **New Relic** - Performance monitoring
- **Sentry** - Error tracking
- **DataDog** - Infrastructure monitoring

## Support & Documentation

- Full API Documentation: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Database Associations: [DB_ASSOCIATIONS_GUIDE.md](DB_ASSOCIATIONS_GUIDE.md)
- Database Changes Summary: [../DB_CHANGES_SUMMARY.md](../DB_CHANGES_SUMMARY.md)

---

**Last Updated:** April 17, 2026
