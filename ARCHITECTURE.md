# Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        KOZYFUL BLANKETS                              │
│                      Full-Stack Application                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│     FRONTEND (React)     │
│  http://localhost:5173   │
├──────────────────────────┤
│  ✅ React Router         │
│  ✅ Axios                │
│  ✅ Auth Context         │
│  ✅ Components           │
│  ✅ Pages                │
│     • Home               │
│     • Collection         │
│     • Login              │
│     • Signup             │
│     • ResetPassword      │
│     • Pdp                │
└────────────┬─────────────┘
             │
             │ API Calls (Axios)
             │ + JWT Token
             │
             ▼
┌──────────────────────────┐
│   BACKEND (Express)      │
│  http://localhost:5000   │
├──────────────────────────┤
│  ✅ Express Server       │
│  ✅ CORS Enabled         │
│  ✅ JWT Auth             │
│  ✅ Middleware           │
│  ✅ Routes               │
│     • /api/auth          │
│     • /api/products      │
│     • /api/users         │
│     • /api/orders        │
│     • /api/reviews       │
│  ✅ Controllers          │
│  ✅ Models               │
└────────────┬─────────────┘
             │
             │ Sequelize ORM
             │
             ▼
┌──────────────────────────┐
│      DATABASE            │
│   MySQL 3306             │
├──────────────────────────┤
│  ✅ kozyfulWebsiteDB     │
│     • users              │
│     • products           │
│     • orders             │
│     • order_items        │
│     • reviews            │
└──────────────────────────┘
```

---

## Authentication Flow

```
USER REGISTRATION
────────────────

┌─────────────┐
│  Signup     │
│  Form       │
└──────┬──────┘
       │ POST /api/auth/register
       │ {name, email, password}
       ▼
┌──────────────────────────┐
│  Backend: Validate Input │
│  Hash Password           │
│  Create User             │
│  Generate JWT Token      │
└──────┬───────────────────┘
       │ Return token
       ▼
┌──────────────────────────┐
│  Frontend: Save Token    │
│  Store in localStorage   │
│  Update Auth Context     │
│  Redirect to Home        │
└──────────────────────────┘


USER LOGIN
──────────

┌─────────────┐
│  Login      │
│  Form       │
└──────┬──────┘
       │ POST /api/auth/login
       │ {email, password}
       ▼
┌──────────────────────────┐
│  Backend: Find User      │
│  Verify Password         │
│  Generate JWT Token      │
└──────┬───────────────────┘
       │ Return token
       ▼
┌──────────────────────────┐
│  Frontend: Save Token    │
│  Store in localStorage   │
│  Update Auth Context     │
│  Redirect to Home        │
└──────────────────────────┘


PROTECTED API CALL
──────────────────

┌─────────────────────────────┐
│  Frontend Request           │
│  (Get User Profile)         │
└──────┬──────────────────────┘
       │ Headers:
       │ {Authorization: Bearer <token>}
       ▼
┌──────────────────────────────┐
│  Axios Interceptor           │
│  Adds token to header        │
└──────┬───────────────────────┘
       │ GET /api/users/profile
       ▼
┌──────────────────────────────┐
│  Backend: Verify Token       │
│  Extract User ID             │
│  Fetch User Data             │
│  Return Response             │
└──────┬───────────────────────┘
       │ User data
       ▼
┌──────────────────────────────┐
│  Frontend: Display Data      │
│  Update UI                   │
└──────────────────────────────┘
```

---

## Product Fetching Flow

```
HOME PAGE LOAD
──────────────

┌──────────────┐
│  Home Page   │
│  Mounted     │
└──────┬───────┘
       │ useEffect hook runs
       ▼
┌──────────────────────────────┐
│  productAPI.getAll()         │
│  Axios GET /products?...     │
│  (isBestSeller=true, limit=7)│
└──────┬───────────────────────┘
       │ API call
       ▼
┌──────────────────────────────┐
│  Backend: Filter Products    │
│  Apply Sequelize where       │
│  Fetch from database         │
│  Return JSON                 │
└──────┬───────────────────────┘
       │ Products array
       ▼
┌──────────────────────────────┐
│  Frontend: Parse Response    │
│  Update state: setBestSellers│
│  Re-render components        │
│  Display product cards       │
└──────────────────────────────┘


COLLECTION PAGE WITH FILTERS
──────────────────────────────

┌──────────────────────┐
│  Collection Page     │
│  Select Filter       │
│  (e.g., Color: Red)  │
└──────┬───────────────┘
       │ onChange event
       ▼
┌──────────────────────────────┐
│  toggleFilter()              │
│  Update filter state         │
│  Trigger useEffect           │
└──────┬───────────────────────┘
       │ activeFilters changed
       ▼
┌──────────────────────────────┐
│  fetchProducts()             │
│  Build query params          │
│  GET /products?color=red     │
└──────┬───────────────────────┘
       │ API call
       ▼
┌──────────────────────────────┐
│  Backend: Apply Filters      │
│  WHERE color = 'red'         │
│  Fetch filtered products     │
│  Return results              │
└──────┬───────────────────────┘
       │ Filtered products
       ▼
┌──────────────────────────────┐
│  Frontend: Update Products   │
│  Display filtered results    │
│  Show product count          │
└──────────────────────────────┘
```

---

## Component Hierarchy

```
App (Root)
│
├─ AuthProvider (Context)
│  │
│  └─ BrowserRouter
│     │
│     └─ Layout
│        │
│        ├─ Header (if not auth page)
│        │
│        ├─ Routes
│        │  │
│        │  ├─ Home /
│        │  │  ├─ HeroSection
│        │  │  ├─ FeaturesSection
│        │  │  ├─ BestSellerSwiper
│        │  │  │  └─ BestSellerCard (×7)
│        │  │  ├─ BlanketLoverSwiper
│        │  │  │  └─ BlanketLoverCard (×6)
│        │  │  └─ ReviewsSection
│        │  │
│        │  ├─ Collection /collection
│        │  │  ├─ FilterSidebar
│        │  │  └─ ProductGrid
│        │  │     └─ BestSellerCard (×N)
│        │  │
│        │  ├─ Pdp /pdp
│        │  │  ├─ ProductHero
│        │  │  ├─ ProductDetail
│        │  │  └─ ReviewsSection
│        │  │
│        │  ├─ Login /login
│        │  ├─ Signup /signup
│        │  └─ ResetPassword /reset-password
│        │
│        └─ Footer (if not auth page)
```

---

## Database Schema

```
USERS
├─ id (PK)
├─ name
├─ email (UNIQUE)
├─ password (hashed)
├─ isActive
├─ createdAt
└─ updatedAt

PRODUCTS
├─ id (PK)
├─ name
├─ description
├─ price
├─ discountPrice
├─ stock
├─ category
├─ image
├─ rating
├─ isBestSeller
├─ isActive
├─ createdAt
└─ updatedAt

ORDERS
├─ id (PK)
├─ userId (FK → USERS)
├─ totalAmount
├─ status
├─ createdAt
└─ updatedAt

ORDER_ITEMS
├─ id (PK)
├─ orderId (FK → ORDERS)
├─ productId (FK → PRODUCTS)
├─ quantity
├─ price
├─ createdAt
└─ updatedAt

REVIEWS
├─ id (PK)
├─ userId (FK → USERS)
├─ productId (FK → PRODUCTS)
├─ rating
├─ title
├─ comment
├─ createdAt
└─ updatedAt
```

---

## API Endpoints

```
Authentication
├─ POST   /auth/register          → Create account
├─ POST   /auth/login             → Login (returns token)
├─ POST   /auth/logout            → Logout
└─ POST   /auth/reset-password    → Reset password

Products
├─ GET    /products               → Get all (with filters)
├─ GET    /products/:id           → Get single
├─ POST   /products (protected)   → Create (admin)
├─ PUT    /products/:id (protected) → Update (admin)
└─ DELETE /products/:id (protected) → Delete (admin)

Users
├─ GET    /users/profile (protected)    → Get profile
├─ PUT    /users/profile (protected)    → Update profile
└─ GET    /users/orders (protected)     → Get user orders

Orders
├─ POST   /orders (protected)     → Create order
├─ GET    /orders (protected)     → Get all orders
├─ GET    /orders/:id (protected) → Get single order
└─ PUT    /orders/:id (protected) → Update order status

Reviews
├─ POST   /reviews (protected)         → Create review
├─ GET    /reviews/product/:id         → Get product reviews
├─ PUT    /reviews/:id (protected)     → Update review
└─ DELETE /reviews/:id (protected)     → Delete review
```

---

## State Management Flow

```
Global Auth State (AuthContext)
├─ user: {id, name, email}
├─ token: JWT string
├─ isAuthenticated: boolean
├─ loading: boolean
├─ error: string
└─ Methods:
   ├─ login(userData)
   └─ logout()

Page State (useState)
├─ products: array
├─ loading: boolean
├─ filters: object
├─ activeFilters: object
├─ sortValue: string
└─ pagination: object
```

---

## Error Handling Flow

```
Backend Error
├─ Database Error → caught
│  └─ → SequelizeError handler → JSON response
│
├─ Validation Error → caught
│  └─ → ValidationError handler → JSON response
│
├─ JWT Error → caught
│  └─ → TokenError handler → JSON response
│
├─ Custom Error → caught
│  └─ → Custom handler → JSON response
│
└─ Unknown Error
   └─ → Generic handler → 500 error

Frontend Error
├─ Validation Error
│  └─ → Show in form
│
├─ API Error
│  └─ → Show error message
│
├─ Network Error
│  └─ → Show connection error
│
└─ Render Error
   └─ → Show fallback UI
```

---

## Security Measures

```
Authentication
├─ Password Hashing (bcryptjs)
├─ JWT Token (Bearer)
├─ Token Expiration (7 days)
└─ Secure storage (localStorage)

Authorization
├─ Token Verification
├─ Role-based access (ready)
└─ Protected routes (ready)

Data Protection
├─ CORS enabled
├─ Input validation (Joi)
├─ SQL Injection prevention (ORM)
└─ XSS prevention (React escaping)

API Security
├─ Bearer token requirement
├─ Token in Authorization header
├─ Automatic token injection
└─ Token refresh ready
```

---

## Deployment Architecture

```
Development
├─ Backend: localhost:5000
├─ Frontend: localhost:5173
└─ Database: localhost:3306

Production (Future)
├─ Backend: yourserver.com/api
├─ Frontend: yourserver.com
├─ Database: Managed MySQL
└─ HTTPS enabled
```

---

This architecture provides:
✅ Secure authentication
✅ Scalable API design
✅ Efficient data fetching
✅ Proper error handling
✅ Clean separation of concerns
✅ Easy to maintain and extend
