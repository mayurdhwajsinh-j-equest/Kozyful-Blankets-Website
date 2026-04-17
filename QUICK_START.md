# 🚀 Quick Start Guide - Backend API

## Installation (2 minutes)

```bash
cd backend
npm install
```

## Setup (3 minutes)

**1. Create MySQL Database**
```bash
mysql -u root -p
```
```sql
CREATE DATABASE kozyful_db;
```

**2. Create `.env` file**
```env
DB_NAME=kozyful_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

**3. Start Server**
```bash
npm run dev
```

Expected output:
```
✓ Database connected successfully
✓ Database synced
✓ Server running on http://localhost:5000
```

---

## Quick API Tests

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Pass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Pass123"
  }'
```

Save the token from response for authenticated requests.

### 3. Browse Products
```bash
curl http://localhost:5000/api/products
```

### 4. Get Product Details
```bash
curl http://localhost:5000/api/products/1
```

### 5. Create Order (with token)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "totalAmount": 299.98,
    "shippingAddress": "123 Main St",
    "paymentMethod": "credit_card",
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 149.99
      }
    ]
  }'
```

### 6. Create Review (with token)
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": 1,
    "rating": 5,
    "comment": "Great product!"
  }'
```

---

## File Structure

```
backend/
├── middleware/          # Auth, validation, error handling
├── controllers/         # Business logic for each resource
├── routes/              # API endpoints
├── models/              # Database models with associations
├── config/              # Database configuration
├── server.js            # Main server file
└── package.json         # Dependencies
```

---

## Key Features

✅ JWT Authentication (7-day expiry)
✅ Password Hashing (bcryptjs)
✅ Input Validation (Joi)
✅ Database Associations (Cascade delete)
✅ Pagination & Filtering
✅ Search Functionality
✅ Error Handling
✅ Transaction Support (Orders)
✅ 28 API Endpoints

---

## Documentation

📖 **Full API Docs:** [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
📖 **Setup Guide:** [SETUP_DEPLOYMENT.md](backend/SETUP_DEPLOYMENT.md)
📖 **Database Guide:** [DB_ASSOCIATIONS_GUIDE.md](backend/DB_ASSOCIATIONS_GUIDE.md)

---

## Endpoints Overview

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /auth/register | No | Register user |
| POST | /auth/login | No | Login user |
| GET | /products | No | Browse products |
| GET | /products/1 | No | Get product details |
| POST | /orders | Yes | Create order |
| GET | /orders | Yes | View orders |
| POST | /reviews | Yes | Create review |
| GET | /reviews/product/1 | No | Get reviews |

---

## Common Commands

```bash
# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Install new dependency
npm install package-name

# View database
mysql -u root -p kozyful_db
```

---

## Troubleshooting

**Port Already in Use?**
```bash
# Change PORT in .env or
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

**Database Not Connecting?**
- Check MySQL is running
- Verify .env credentials
- Ensure database exists

**Token Invalid?**
- Include "Bearer " prefix: `Authorization: Bearer <token>`
- Token expires in 7 days

---

## Environment Variables Needed

```env
# Database
DB_NAME=kozyful_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql

# JWT
JWT_SECRET=your_secret_key

# Server
PORT=5000
NODE_ENV=development
```

---

**Ready to start?** Run `npm run dev` and go! 🚀

For detailed information, see the full documentation in the backend folder.
