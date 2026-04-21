# Admin Dashboard Guide

## 📊 Overview
A complete admin dashboard has been created to manage all aspects of your Kozyful Blankets e-commerce platform. The dashboard features a beautiful design that matches your existing frontend color scheme.

## 🎨 Design Features
- **Color Scheme**: Matches your existing frontend perfectly
  - Primary Pink/Red: #E8656B
  - Light Pink Backgrounds: #FEE9ED, #FEF9FA
  - Text: #404D58
  - Accent Blue: #1A67A0
  - Green: #11854D
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🗂️ Admin Dashboard Structure

### 1. **Main Dashboard** (`/admin`)
   - **Stats Overview**: Quick view of total products, orders, users, and revenue
   - **Quick Access**: Links to key admin functions
   - **Visual Cards**: Color-coded stat cards for easy scanning

### 2. **Products Management** (`/admin/products`)
   **Features:**
   - View all products in a sortable table
   - Add new products with form validation
   - Edit existing products
   - Delete products (with confirmation)
   - Search products by name
   - Best seller status toggle
   
   **Form Fields:**
   - Product Name
   - Description
   - Price
   - Category (Bedroom, Living Room, Travel, Kids, Other)
   - Image URL
   - Best Seller checkbox

### 3. **Orders Management** (`/admin/orders`)
   **Features:**
   - View all orders as cards
   - Filter orders by status (Pending, Processing, Shipped, Delivered, Cancelled)
   - Update order status from dropdown
   - View detailed order information in modal
   - Color-coded status badges

### 4. **Users Management** (`/admin/users`)
   **Features:**
   - View all registered users
   - Search users by name or email
   - User avatars with initials
   - Total user count
   - User details: Name, Email, Phone, Join Date

### 5. **Reviews Management** (`/admin/reviews`)
   **Features:**
   - View all customer reviews
   - Filter by star rating
   - Delete inappropriate reviews
   - View average rating
   - Star ratings display
   - Review comments and titles

## 🚀 How to Access the Admin Dashboard

### Access Point:
```
http://localhost:5173/admin
```

### Navigation:
- **Sidebar Menu**: Use the left sidebar to navigate between different sections
- **Sidebar Toggle**: Click the hamburger button to collapse/expand the sidebar
- **Quick Links**: Click any menu item to go to that section

## 🔐 Authentication
The admin dashboard is protected with JWT token authentication:
- Must have a valid token in localStorage
- Token is automatically included in all admin requests
- If unauthorized, you'll be redirected to login page

## 📝 Available Admin Features

### Product Management
```
- Create Product: POST /api/products
- Update Product: PUT /api/products/:id
- Delete Product: DELETE /api/products/:id
- Get All Products: GET /api/products
```

### Order Management
```
- Get All Orders: GET /api/orders
- Update Order Status: PUT /api/orders/:id
- Get Order Details: GET /api/orders/:id
```

### User Management
```
- Get All Users: GET /api/users
- View User Profile: GET /api/users/profile
```

### Review Management
```
- Get All Reviews: GET /api/reviews
- Delete Review: DELETE /api/reviews/:id
```

## 🎯 Color Scheme Used

| Element | Color Code | Usage |
|---------|-----------|-------|
| Primary | #E8656B | Sidebar, buttons, accents |
| Light Pink | #FEE9ED | Backgrounds, headers |
| Text | #404D58 | Main text, labels |
| Blue Accent | #1A67A0 | Secondary accents |
| Green | #11854D | Success badges |
| Light Gray | #EFF2F4 | Borders, subtle backgrounds |

## 📱 Responsive Breakpoints

- **Desktop**: Full sidebar with labels
- **Tablet/Mobile**: Collapsed sidebar with icons only
- **Mobile**: Stacked layouts for forms and tables

## ✨ Features Breakdown

### Dashboard Stats
- Shows real-time statistics from database
- Color-coded icons for each category
- Hover effects for interactivity

### Product Form
- Full validation of all fields
- Image preview support
- Category selection dropdown
- Best seller toggle
- Success/error alerts

### Orders Management
- Status filtering
- Order detail modal with items list
- Status update dropdown
- Customer information display
- Date formatting

### Users Table
- Sortable table
- User avatars with initials
- Search functionality
- Status badges
- Join date display

### Reviews Section
- Star rating filters
- Average rating calculation
- Delete functionality with confirmation
- Comment display
- Reviewer information

## 🛠️ Customization

### Colors
All colors are defined in the CSS files. To customize, update color codes in:
- `AdminLayout.css`
- `AdminDashboard.css`
- `AdminProducts.css`
- `AdminOrders.css`
- `AdminUsers.css`
- `AdminReviews.css`

### Adding New Features
You can extend the dashboard by:
1. Creating new page components in `/pages/Admin/`
2. Adding menu items in `AdminLayout.jsx`
3. Adding corresponding routes in `App.jsx`

## 📚 File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── AdminLayout/
│   │       ├── AdminLayout.jsx
│   │       └── AdminLayout.css
│   ├── pages/
│   │   └── Admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminDashboard.css
│   │       ├── AdminProducts.jsx
│   │       ├── AdminProducts.css
│   │       ├── AdminOrders.jsx
│   │       ├── AdminOrders.css
│   │       ├── AdminUsers.jsx
│   │       ├── AdminUsers.css
│   │       ├── AdminReviews.jsx
│   │       └── AdminReviews.css
│   └── services/
│       └── api.js (updated)
└── App.jsx (updated)
```

## 🔧 Setup Instructions

1. **No additional setup required** - All components are ready to use
2. Make sure your backend is running on `http://localhost:5000`
3. The frontend should be running on `http://localhost:5173`
4. Login with an admin account to get access

## 💡 Tips & Tricks

1. **Logout**: Click the logout button in the sidebar to safely log out
2. **Search**: Use the search functionality in Products and Users pages
3. **Status Updates**: Update order status instantly from the dropdown
4. **Responsive**: Sidebar collapses on mobile for better mobile UX
5. **Real-time Stats**: Dashboard stats update based on current database state

## 🐛 Troubleshooting

### Issue: Admin page shows "Not Found"
- **Solution**: Make sure you've imported all admin pages in `App.jsx`

### Issue: Can't update products
- **Solution**: Ensure you have an active JWT token and admin privileges

### Issue: Images not loading
- **Solution**: Verify image URLs are correct and accessible

### Issue: No data showing
- **Solution**: Make sure your backend API is running and accessible

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify backend API is running
3. Ensure all routes are properly configured
4. Check token is stored in localStorage

---

**Created**: Your Admin Dashboard is now ready to use! 🎉
