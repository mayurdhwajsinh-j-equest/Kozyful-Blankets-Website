# Kozyful Blankets API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Format
All responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // optional, for validation errors
}
```

---

## Authentication

### Register
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
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

### Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout
**POST** `/auth/logout`

Logout user (client-side: delete the token).

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful. Please delete the token on client side."
}
```

### Reset Password
**POST** `/auth/reset-password`

Reset user password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "newPassword": "NewSecurePass456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## Products

### Get All Products
**GET** `/products`

Fetch all active products with pagination and filters.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `isBestSeller` - Filter best sellers (true/false)
- `search` - Search by name or description

**Example:**
```
GET /products?page=1&limit=10&category=bedroom&minPrice=50&maxPrice=200
```

**Response (200):**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Luxury Wool Blanket",
      "description": "Premium wool blanket",
      "price": "199.99",
      "discountPrice": "149.99",
      "stock": 50,
      "category": "bedroom",
      "image": "url",
      "rating": 4.5,
      "isBestSeller": true,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Get Product By ID
**GET** `/products/:id`

Fetch a specific product with reviews.

**Response (200):**
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "id": 1,
    "name": "Luxury Wool Blanket",
    "description": "Premium wool blanket",
    "price": "199.99",
    "discountPrice": "149.99",
    "stock": 50,
    "category": "bedroom",
    "image": "url",
    "rating": 4.5,
    "isBestSeller": true,
    "isActive": true,
    "Reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Great quality!",
        "helpful": 10,
        "User": {
          "id": 1,
          "name": "John Doe"
        }
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Best Sellers
**GET** `/products/bestsellers`

Get best-selling products.

**Query Parameters:**
- `limit` (default: 10) - Number of items

**Response (200):**
```json
{
  "success": true,
  "message": "Best sellers fetched successfully",
  "data": [...]
}
```

### Create Product (Admin)
**POST** `/products`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Blanket",
  "description": "Description",
  "price": 99.99,
  "discountPrice": 79.99,
  "stock": 100,
  "category": "bedroom",
  "image": "url",
  "isBestSeller": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { ... }
}
```

### Update Product (Admin)
**PUT** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "price": 89.99,
  "stock": 75,
  "isBestSeller": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

### Delete Product (Admin)
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Users

### Get All Users (Admin)
**GET** `/users`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

**Response (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Get Current User Profile
**GET** `/users/profile/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "Orders": [ ... ],
    "Reviews": [ ... ]
  }
}
```

### Get User By ID
**GET** `/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": { ... }
}
```

### Update User
**PUT** `/users/:id`

Users can only update their own profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "NewPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { ... }
}
```

### Delete User
**DELETE** `/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Orders

### Create Order
**POST** `/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "totalAmount": 299.98,
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "credit_card",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 149.99
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "totalAmount": "299.98",
    "status": "pending",
    "shippingAddress": "123 Main St, City, State 12345",
    "paymentMethod": "credit_card",
    "trackingNumber": null,
    "OrderItems": [ ... ],
    "User": { ... },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get User Orders
**GET** `/orders`

Get all orders for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` - Filter by status (pending, processing, shipped, delivered, cancelled)

**Response (200):**
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": [ ... ],
  "pagination": { ... }
}
```

### Get All Orders (Admin)
**GET** `/orders/admin/all`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` - Filter by status
- `userId` - Filter by user

**Response (200):**
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": [ ... ],
  "pagination": { ... }
}
```

### Get Order By ID
**GET** `/orders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order fetched successfully",
  "data": { ... }
}
```

### Update Order Status (Admin)
**PUT** `/orders/:id/status`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": { ... }
}
```

### Cancel Order
**PUT** `/orders/:id/cancel`

Users can cancel pending or processing orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": { ... }
}
```

---

## Reviews

### Create Review
**POST** `/reviews`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Excellent quality and great value!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "productId": 1,
    "userId": 1,
    "rating": 5,
    "comment": "Excellent quality!",
    "helpful": 0,
    "Product": { ... },
    "User": { ... }
  }
}
```

### Get Product Reviews
**GET** `/reviews/product/:productId`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` - Sort by 'createdAt' or 'helpful' (default: createdAt)

**Response (200):**
```json
{
  "success": true,
  "message": "Reviews fetched successfully",
  "data": [ ... ],
  "pagination": { ... }
}
```

### Get User Reviews
**GET** `/reviews/user/:userId`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

**Response (200):**
```json
{
  "success": true,
  "message": "User reviews fetched successfully",
  "data": [ ... ],
  "pagination": { ... }
}
```

### Get Review By ID
**GET** `/reviews/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Review fetched successfully",
  "data": { ... }
}
```

### Update Review
**PUT** `/reviews/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review comment"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": { ... }
}
```

### Delete Review
**DELETE** `/reviews/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### Mark Review as Helpful
**PUT** `/reviews/:id/helpful`

**Response (200):**
```json
{
  "success": true,
  "message": "Review marked as helpful",
  "data": { ... }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Not authorized to perform action |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate entry or constraint violation |
| 500 | Internal Server Error - Server error |

---

## Error Examples

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## Authentication Token

Include JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires in 7 days. Get a new token by logging in again.

---

## Environment Variables

```env
DB_NAME=kozyful_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

---

## Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Get Products:**
```bash
curl -X GET http://localhost:5000/api/products
```

---

Last Updated: April 17, 2026
