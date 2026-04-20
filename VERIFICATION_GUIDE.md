# Kozyful Blankets - Project Verification & Troubleshooting

## ✅ Verification Checklist

### Backend Setup
- [x] Express server configured (`server.js`)
- [x] CORS enabled for frontend access
- [x] Sequelize ORM configured
- [x] Database connection setup
- [x] JWT authentication middleware
- [x] Error handling middleware
- [x] Input validation (Joi)
- [x] Routes configured:
  - [x] `/api/auth` - Authentication
  - [x] `/api/products` - Products
  - [x] `/api/users` - Users
  - [x] `/api/orders` - Orders
  - [x] `/api/reviews` - Reviews
- [x] Controllers implemented
- [x] Models defined with associations
- [x] Environment variables configured

### Frontend Setup
- [x] React Router configured
- [x] Axios installed and configured
- [x] Auth Context for state management
- [x] API service layer created
- [x] Environment variables configured
- [x] Pages integrated:
  - [x] Login - API integration ✅
  - [x] Signup - API integration ✅
  - [x] ResetPassword - API integration ✅
  - [x] Home - Product fetching ✅
  - [x] Collection - Filters & sorting ✅
  - [x] Pdp - Product detail page
- [x] Components updated:
  - [x] BestSellerCard - Dynamic data ✅
  - [x] AuthProvider wrapper ✅

## ⚙️ Configuration Files

### Backend .env
```
DB_HOST = localhost
DB_PORT = 3306
DB_NAME = kozyfulWebsiteDB
DB_USER = root
DB_PASSWORD = eQuest@123
DB_DIALECT = mysql
NODE_ENV = development
PORT = 5000
JWT_SECRET = your_super_secret_jwt_key_change_this_in_production_12345
```
✅ **Status**: Configured with JWT_SECRET added

### Frontend .env
```
VITE_API_BASE_URL=http://localhost:5000/api
```
✅ **Status**: Configured

## 🔍 Common Issues & Solutions

### Issue 1: Database Connection Error
**Symptoms**: "Database connection failed" on server startup

**Solutions**:
```bash
# 1. Ensure MySQL is running
mysql --version

# 2. Check database credentials in backend/.env
# Verify DB_HOST, DB_USER, DB_PASSWORD match your setup

# 3. Create database manually if needed
mysql -u root -p
CREATE DATABASE kozyfulWebsiteDB;
EXIT;

# 4. Restart backend
npm run dev
```

### Issue 2: JWT Token Not Working
**Symptoms**: "Invalid token" error on protected routes

**Solutions**:
```bash
# 1. Verify JWT_SECRET is set in backend/.env
# Current: your_super_secret_jwt_key_change_this_in_production_12345

# 2. Check token format in requests (Bearer <token>)

# 3. Clear browser localStorage and re-login
localStorage.clear()
```

### Issue 3: CORS Errors
**Symptoms**: "Access to XMLHttpRequest blocked by CORS policy"

**Solutions**:
```javascript
// Already handled in server.js:
app.use(cors());

// If issues persist, configure specific origins:
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### Issue 4: API Not Returning Data
**Symptoms**: Products/users not showing up in frontend

**Solutions**:
```bash
# 1. Seed database with sample data
npm run seed

# 2. Check if products table has data
mysql -u root -p kozyfulWebsiteDB
SELECT COUNT(*) FROM products;

# 3. Verify API endpoint directly
curl http://localhost:5000/api/products

# 4. Check browser console for errors
# Open DevTools > Console tab
```

### Issue 5: Frontend Can't Find Components
**Symptoms**: "Cannot find module" errors during build

**Solutions**:
```bash
# 1. Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# 2. Verify all files exist in correct paths
# Check src/services/api.js exists
# Check src/context/AuthContext.jsx exists

# 3. Restart dev server
npm run dev
```

### Issue 6: Token Lost on Page Refresh
**Symptoms**: User logged out after page refresh

**Solutions**:
```javascript
// Verify AuthContext is properly retrieving token from localStorage
// Current implementation should handle this automatically

// Check browser > Application > Local Storage
// Should have 'token' key with JWT value

// If not working, check:
// 1. localStorage.setItem() is called on login
// 2. localStorage.getItem() is called on app load
```

## 🚀 Quick Start Guide

### Starting the Application

**Terminal 1 - Backend**:
```bash
cd backend
npm install  # Only first time
npm run dev
# Expected output:
# ✓ Database connected successfully
# ✓ Database synced
# ✓ Server running on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm install  # Only first time
npm run dev
# Expected output:
# VITE v8.x.x ready in 123 ms
# ➜  Local:   http://localhost:5173/
```

### Testing Authentication
1. Navigate to http://localhost:5173/signup
2. Register a new account
3. Should redirect to home page
4. Check browser localStorage for 'token'

### Testing Product Display
1. Go to home page
2. Should see product cards loading
3. Click "See all" to go to collection
4. Products should display dynamically
5. Test filters and sorting

## 📊 API Testing

### Using curl to test endpoints:

**Register User**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Login User**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Get Products**:
```bash
curl http://localhost:5000/api/products?limit=10
```

**Get Products with Token**:
```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🔧 Backend Endpoints Status

| Endpoint | Method | Auth Required | Status |
|----------|--------|---------------|--------|
| `/auth/register` | POST | ❌ | ✅ Working |
| `/auth/login` | POST | ❌ | ✅ Working |
| `/auth/logout` | POST | ❌ | ✅ Working |
| `/auth/reset-password` | POST | ❌ | ✅ Working |
| `/products` | GET | ❌ | ✅ Working |
| `/products/:id` | GET | ❌ | ✅ Working |
| `/products` | POST | ✅ | ✅ Working |
| `/products/:id` | PUT | ✅ | ✅ Working |
| `/products/:id` | DELETE | ✅ | ✅ Working |

## 📁 File Structure Verification

### Backend ✅
```
backend/
├── config/
│   ├── config.js
│   └── db.js ✅
├── controllers/
│   ├── auth.controller.js ✅
│   ├── product.controller.js ✅
│   ├── order.controller.js ✅
│   ├── user.controller.js ✅
│   └── review.controller.js ✅
├── middleware/
│   ├── auth.js ✅
│   ├── errorHandler.js ✅
│   ├── validation.js ✅
│   └── index.js ✅
├── models/
│   ├── index.js ✅
│   ├── user.model.js ✅
│   ├── product.model.js ✅
│   ├── order.model.js ✅
│   └── review.model.js ✅
├── routes/
│   ├── auth.routes.js ✅
│   ├── product.routes.js ✅
│   ├── order.routes.js ✅
│   ├── user.routes.js ✅
│   └── review.routes.js ✅
├── .env ✅ (with JWT_SECRET)
└── server.js ✅
```

### Frontend ✅
```
frontend/
├── src/
│   ├── services/
│   │   └── api.js ✅
│   ├── context/
│   │   └── AuthContext.jsx ✅
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx ✅
│   │   │   ├── Signup.jsx ✅
│   │   │   └── ResetPassword.jsx ✅ (Updated)
│   │   ├── Home/
│   │   │   └── Home.jsx ✅
│   │   ├── Collection/
│   │   │   └── Collection.jsx ✅
│   │   └── Pdp/
│   │       └── Pdp.jsx ✅
│   ├── components/
│   │   └── BestSellerCard/
│   │       └── BestSellerCard.jsx ✅
│   └── App.jsx ✅
├── .env ✅
└── package.json ✅
```

## 🧪 Testing Scenarios

### Scenario 1: User Registration & Login
```
1. Go to /signup
2. Fill form: name, email, password
3. Submit → Should show success message
4. Redirect to home page
5. Check localStorage for 'token'
6. Go to /login
7. Enter email/password
8. Should login successfully
```

### Scenario 2: Product Display
```
1. Visit home page /
2. Should fetch and display best sellers
3. Products should show: name, price, discount price
4. Cards should be clickable
5. Go to /collection
6. All products should display
7. Test filters (should trigger re-fetch)
8. Test sorting options
```

### Scenario 3: Logout
```
1. After login, token in localStorage
2. Click logout (if available)
3. Token should be removed
4. Redirect to login page
5. Cannot access protected routes
```

## 📝 Configuration Notes

- **JWT Secret**: Changed from hardcoded to environment variable
- **CORS**: Enabled for all origins (change in production)
- **Database**: MySQL with Sequelize ORM
- **Frontend**: Vite + React with React Router
- **API Client**: Axios with request interceptor for auth tokens

## 🎯 Next Steps (Optional)

1. **Add Product Image Upload**
2. **Implement Shopping Cart**
3. **Add Order Checkout**
4. **Implement Reviews**
5. **Add User Profile Page**
6. **Setup Payment Gateway**
7. **Add Admin Dashboard**
8. **Implement Search Bar**

## 📞 Support

If issues persist after following this guide:

1. Check error messages in browser console (F12)
2. Check backend terminal for error logs
3. Verify all .env files have correct values
4. Clear cache: `Ctrl+Shift+Delete`
5. Restart both servers
6. Check firewall/antivirus not blocking ports 5000/5173

---

**Last Updated**: April 20, 2026
**Status**: All systems integrated and verified ✅
