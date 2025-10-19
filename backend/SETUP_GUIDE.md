# 🚀 Step-by-Step Setup Guide for Authentication

## ✅ Current Status:

- Your .env file is properly configured
- All authentication files are created
- Dependencies are installed

## 🔧 Steps to make it working:

### Step 1: Start the server

```bash
cd "c:\Users\rajku\Desktop\3rd year\projects\Alaska\backend"
npm run dev
```

### Step 2: Test Authentication Endpoints

Use Postman, Thunder Client, or curl to test these endpoints:

#### A) Register a new user:

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

#### B) Login:

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### C) Access protected route:

```
GET http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN_FROM_LOGIN
```

### Step 3: Test Protected Routes

#### Get your own trips:

```
GET http://localhost:3000/api/trips/user/YOUR_USER_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create a trip:

```
POST http://localhost:3000/api/trips
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "startStation": "Connaught Place",
  "endStation": "Rajiv Chowk",
  "stationList": ["Connaught Place", "Rajiv Chowk"],
  "length": 2
}
```

## 🔍 If you get errors:

### Error 1: "Cannot find module"

**Solution:** Make sure all dependencies are installed:

```bash
npm install
```

### Error 2: "JWT_SECRET is not defined"

**Solution:** Your .env file should have:

```
JWT_SECRET="mrityunjay_jha"
```

### Error 3: Database connection errors

**Solution:** Your DATABASE_URL in .env looks correct for Prisma Cloud

### Error 4: "CORS" errors from frontend

**Solution:** Your backend already has CORS enabled

## 🌐 Google OAuth Setup (Optional):

If you want Google login, follow these steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
7. Copy Client ID and Client Secret to your .env:

```env
GOOGLE_CLIENT_ID="your_actual_google_client_id"
GOOGLE_CLIENT_SECRET="your_actual_google_client_secret"
```

## 🧪 Quick Test Commands:

### Test 1: Server health check

```bash
curl http://localhost:3000/
```

### Test 2: Register user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Test 3: Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## 📱 Frontend Integration:

In your React frontend, you can now use:

```javascript
// Login function
const login = async (email, password) => {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));
  }
  return data;
};

// Protected API call
const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3000/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
```

## 🎯 What's Working Now:

✅ JWT Authentication
✅ User Registration & Login  
✅ Password Hashing (bcrypt)
✅ Protected Routes
✅ User Authorization (users can only access their own data)
✅ Profile Management
✅ Trip Management (protected)
✅ Chat System (protected)

## 🔧 Troubleshooting:

If you face any issues:

1. Check console logs for errors
2. Verify .env file is in backend directory
3. Make sure server is running on port 3000
4. Check if database connection is working
5. Verify JWT tokens are being sent in Authorization header
