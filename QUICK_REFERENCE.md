# Quick Reference Commands

## 🚀 Starting the Application

### Backend
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
```

## 📦 Installation & Updates

### Backend Dependencies
```bash
cd backend
npm install          # Install all dependencies
npm install axios    # Add specific package
npm audit fix        # Fix security vulnerabilities
```

### Frontend Dependencies
```bash
cd frontend
npm install          # Install all dependencies
npm install axios    # (Already installed)
npm audit fix        # Fix security vulnerabilities
```

## 🗄️ Database Operations

### MySQL Commands
```bash
# Login to MySQL
mysql -u root -p

# After login:
SHOW DATABASES;                          # List all databases
CREATE DATABASE kozyfulWebsiteDB;        # Create database
USE kozyfulWebsiteDB;                    # Select database
SHOW TABLES;                              # List tables in current DB
SELECT COUNT(*) FROM products;           # Count products
SELECT COUNT(*) FROM users;              # Count users

# View table structure
DESC products;                            # Show product table structure
DESC users;                               # Show user table structure

# Exit
EXIT;
```

### Add Sample Product
```bash
# Via MySQL command line
mysql -u root -p kozyfulWebsiteDB
INSERT INTO products (name, description, price, discountPrice, stock, category, image, isBestSeller, isActive, createdAt, updatedAt)
VALUES ('Luxury Wool Blanket', 'Premium wool blanket', 199.99, 149.99, 50, 'bedroom', 'blanket.jpg', true, true, NOW(), NOW());
```

## 🔍 Debugging Commands

### Check if ports are in use
```bash
# Windows PowerShell
netstat -ano | findstr :5000              # Check port 5000
netstat -ano | findstr :5173              # Check port 5173
netstat -ano | findstr :3306              # Check port 3306 (MySQL)
```

### Check running services
```bash
# Windows PowerShell
Get-Process node                          # Check Node processes
Get-Process mysqld                        # Check MySQL
```

## 🧹 Cleanup & Reset

### Clear npm cache
```bash
npm cache clean --force
```

### Remove node_modules and reinstall
```bash
# Backend
cd backend
rm -r node_modules
rm package-lock.json
npm install

# Frontend
cd frontend
rm -r node_modules
rm package-lock.json
npm install
```

### Clear browser cache
```
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)
```

### Clear localStorage (Browser Console)
```javascript
localStorage.clear()
sessionStorage.clear()
```

## 📝 Environment Variables

### View backend .env
```bash
cd backend
cat .env          # View file (Mac/Linux)
type .env         # View file (Windows)
```

### View frontend .env
```bash
cd frontend
cat .env          # View file (Mac/Linux)
type .env         # View file (Windows)
```

## 🧪 API Testing

### Using curl
```bash
# Test if backend is running
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John\",\"email\":\"john@test.com\",\"password\":\"Test123\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@test.com\",\"password\":\"Test123\"}"

# Get all products
curl http://localhost:5000/api/products

# Get products with filter
curl "http://localhost:5000/api/products?limit=10&page=1"
```

### Using Postman
1. Download [Postman](https://www.postman.com/downloads/)
2. Create new request
3. Set method: GET/POST
4. Set URL: http://localhost:5000/api/...
5. Add Headers: Content-Type: application/json
6. Add Body: JSON format
7. Click Send

## 📊 Viewing Logs

### Backend logs (Terminal)
```
✓ Database connected successfully
✓ Database synced
✓ Server running on http://localhost:5000
✓ Environment: development
```

### Frontend logs (Browser Console)
```
Press F12 to open Developer Tools
Go to Console tab
Check for any errors (red text)
```

## 🔐 Security Notes

- Change `JWT_SECRET` in production
- Use strong database password
- Enable HTTPS in production
- Set CORS to specific origins in production
- Never commit `.env` file to Git

## 🐛 Troubleshooting Commands

### Kill process on port
```bash
# Windows PowerShell
Stop-Process -Id 1234                     # Replace 1234 with PID from netstat

# Mac/Linux
lsof -ti:5000 | xargs kill -9             # Kill process on port 5000
```

### Check logs
```bash
# Backend logs are printed to console
# Frontend logs visible in browser console (F12)

# Check browser network tab for API calls
# F12 > Network tab > Reload page > Check requests
```

### Verify installations
```bash
node --version                            # Check Node.js
npm --version                             # Check npm
npm list react                            # Check React version
npm list axios                            # Check Axios version
mysql --version                           # Check MySQL version
```

## 📱 Common HTTP Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | ✅ Request OK |
| 201 | Created | ✅ Resource created |
| 400 | Bad Request | ❌ Check request format |
| 401 | Unauthorized | ❌ Add/check authentication token |
| 403 | Forbidden | ❌ User not allowed access |
| 404 | Not Found | ❌ Check endpoint URL |
| 409 | Conflict | ❌ Email already exists |
| 500 | Server Error | ❌ Check backend logs |

## 🎯 Development Workflow

1. **Start Backend**
   ```bash
   cd backend && npm run dev
   ```

2. **Start Frontend** (New Terminal)
   ```bash
   cd frontend && npm run dev
   ```

3. **Open Browser**
   ```
   http://localhost:5173
   ```

4. **Make Changes**
   - Both frontend and backend auto-reload
   - Check browser console (F12) for errors

5. **Test Features**
   - Register/Login
   - View products
   - Test filters
   - Check localStorage

6. **Debug Issues**
   - Check browser console (F12)
   - Check backend terminal
   - Use curl/Postman for API testing
   - Check network tab for API calls

---

**Need Help?** Check VERIFICATION_GUIDE.md for detailed troubleshooting
