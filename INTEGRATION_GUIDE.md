# Frontend-Backend Integration Guide

## Overview
Your React frontend has been successfully integrated with the Node.js/Express backend. The frontend now dynamically fetches data from the backend APIs.

## What's Been Integrated

### 1. **API Service Layer** (`src/services/api.js`)
- Centralized API configuration using Axios
- Automatic JWT token injection in all requests
- Organized API endpoints for:
  - Authentication (login, register, logout, reset password)
  - Products (get all, get by ID, search)
  - Users (profile, orders)
  - Orders (create, get all, get by ID)
  - Reviews (create, get, update, delete)

### 2. **Auth Context** (`src/context/AuthContext.jsx`)
- Global authentication state management
- User session persistence using localStorage
- Automatic token handling
- Usage: `useAuth()` hook in components

### 3. **Updated Components**

#### **Login Page** (`src/pages/auth/Login.jsx`)
- Integrated with `/auth/login` API endpoint
- Form validation
- Error handling and display
- Automatic redirect to home on success
- Password visibility toggle

#### **Signup Page** (`src/pages/auth/Signup.jsx`)
- Integrated with `/auth/register` API endpoint
- Password confirmation validation
- User data collection and submission
- Automatic login on successful registration

#### **Home Page** (`src/pages/Home/Home.jsx`)
- Fetches best seller products on mount
- Dynamic product carousel display
- useEffect hook for API calls
- Loading states handled

#### **Collection Page** (`src/pages/Collection/Collection.jsx`)
- Fetches all products with pagination
- Filter and sort functionality
- Dynamic product display based on filters
- Real-time product count

#### **BestSellerCard Component** (`src/components/BestSellerCard/BestSellerCard.jsx`)
- Now accepts product data as props
- Displays dynamic product information
- Shows pricing, discounts, and sale status

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Backend server running on `http://localhost:5000`

### Installation

1. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

2. **Configure API URL:**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env if your backend runs on a different URL
# VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints Being Used

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/reset-password` - Reset password

### Products
- `GET /products` - Get all products with filters/pagination
- `GET /products/:id` - Get specific product details
- `GET /products?search=query` - Search products

### Sample Product Data Expected
```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "price": "199.99",
  "discountPrice": "149.99",
  "stock": 50,
  "category": "bedroom",
  "image": "image-url",
  "rating": 4.5,
  "isBestSeller": true,
  "isActive": true
}
```

## Usage Examples

### Using the Auth Context
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### Making API Calls
```jsx
import { productAPI } from '../services/api';

async function fetchProducts() {
  try {
    const response = await productAPI.getAll({ 
      limit: 10, 
      page: 1 
    });
    console.log(response.data.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Change this if your backend runs on a different URL or port.

## Features Implemented

✅ User Authentication (Login/Signup)
✅ JWT Token Management
✅ Product Listing with Filters
✅ Product Sorting
✅ Search Functionality
✅ Dynamic Component Data
✅ Error Handling
✅ Loading States
✅ Session Persistence
✅ API Request Interceptors

## Next Steps

1. **Add Database Seeding** - Seed products in your backend
2. **Product Details Page** - Create dynamic product detail page
3. **Shopping Cart** - Add cart management
4. **Checkout** - Implement order creation
5. **User Profile** - Show user orders and details
6. **Product Reviews** - Display and submit reviews
7. **Search Bar** - Implement search functionality in Header

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
- Ensure backend is running with CORS enabled
- Check backend server.js includes: `app.use(cors())`

### API connection issues
- Verify backend is running on `http://localhost:5000`
- Check `.env` file has correct `VITE_API_BASE_URL`
- Check browser console for error messages

### Token not persisting
- Check if localStorage is enabled in browser
- Verify token is being returned from backend
- Check if AuthProvider wraps your entire app

## File Structure
```
frontend/
├── src/
│   ├── services/
│   │   └── api.js              # API configuration
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state management
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx       # Integrated login
│   │   │   └── Signup.jsx      # Integrated signup
│   │   ├── Home/
│   │   │   └── Home.jsx        # Integrated home with products
│   │   └── Collection/
│   │       └── Collection.jsx  # Integrated collection with filters
│   ├── components/
│   │   └── BestSellerCard/
│   │       └── BestSellerCard.jsx  # Dynamic product card
│   └── App.jsx                 # Wrapped with AuthProvider
├── .env                        # API configuration
└── .env.example               # Example config
```

## Notes
- Backend must have proper CORS configuration
- Database must be seeded with product data for collection to display
- JWT tokens are stored in localStorage for persistence
- All API calls automatically include the authorization token

For more details, check the API_DOCUMENTATION.md in the backend folder.
