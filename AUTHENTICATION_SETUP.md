# CineNova Authentication Setup Guide

## 🎯 What's Been Implemented

### Backend Authentication (✅ Complete)

- **JWT-based authentication** with access tokens (1h expiry) and refresh tokens (7d)
- **Password hashing** with bcrypt (10 salt rounds)
- **Three auth endpoints**:
  - `POST /api/auth/register` - Create new account with validation
  - `POST /api/auth/login` - Login with email/password
  - `POST /api/auth/logout` - Clear session
  - `POST /api/auth/refresh` - Get new access token (optional)
  - `GET /api/auth/me` - Get current user (protected)

### Frontend Authentication (✅ Complete)

- **Auth Context Provider** - Centralized auth state management
- **Protected Routes** - Automatic redirect to login if not authenticated
- **Login Portal** - Email/password login with validation
- **Register Portal** - New user registration with strong password requirements
- **Token persistence** - Auto-login on page refresh
- **Error handling** - User-friendly error messages

## 🔧 Database Setup (Choose One)

### Option 1: Neon (Recommended - Free Serverless Postgres)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the **Connection String** (looks like: `postgresql://user:password@host/database`)
4. Paste into `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@host/database"
   ```

### Option 2: Local Postgres

```bash
# Install PostgreSQL locally
# Create database
createdb cinenova

# Connection string:
DATABASE_URL="postgresql://localhost/cinenova"
```

### Option 3: Docker (Database Container)

```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres:latest
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

## 📦 Installation Steps

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env with your database URL
# DATABASE_URL=postgresql://user:password@host/database
# JWT_SECRET=your_secret_key_change_this

# Run migrations (creates User table with password field)
npx prisma migrate dev --name init

# Start development server
npm run dev
# Server runs on http://localhost:4000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local with API URL
# VITE_API_URL=http://localhost:4000

# Start dev server
npm run dev
# App runs on http://localhost:5173
```

## 🔐 Password Requirements

- **Minimum 8 characters**
- **1 uppercase letter (A-Z)**
- **1 lowercase letter (a-z)**
- **1 number (0-9)**

Example: `MyPassword123`

## 📝 API Endpoints

### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "MyPassword123",
  "confirmPassword": "MyPassword123"
}

Response (201):
{
  "success": true,
  "message": "Registration successful",
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "MyPassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### Protected Route (Requires Token)

```bash
GET /api/auth/me
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" }
}
```

### Logout

```bash
POST /api/auth/logout
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 🔄 Frontend Usage

### Using Auth in Components

```tsx
import { useAuth } from '../context/AuthContext'

export default function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading, error } = useAuth()

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return <button onClick={() => login('email', 'password')}>Login</button>
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protected Routes

All these routes require authentication:

- `/dashboard` - Main dashboard
- `/explore` - Category explorer
- `/communities` - Communities clubs
- `/movie-detail` - Movie details

Public routes (no auth required):

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

Unauthenticated users trying to access protected routes are automatically redirected to `/login`.

## 🧪 Testing the Flow

1. **Register a new account**:
   - Go to http://localhost:5173/register
   - Fill in: Name, Email, Password (must meet requirements)
   - Click "CREATE ACCOUNT"

2. **Login with new account**:
   - Go to http://localhost:5173/login
   - Enter email and password
   - Click "LOGIN"
   - Should redirect to dashboard

3. **Access protected routes**:
   - Try accessing http://localhost:5173/explore
   - Should work if logged in
   - Should redirect to login if not authenticated

4. **Logout**:
   - Click logout button (in navbar/profile)
   - Should redirect to login page
   - Sessions are cleared

## 📊 Database Schema

```prisma
model User {
  id             Int       @id @default(autoincrement())
  email          String    @unique
  name           String
  password       String    // Hashed with bcrypt
  refreshToken   String?   // Stored for device sessions
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

## 🔒 Security Features

✅ **Password Hashing** - Bcrypt with 10 salt rounds
✅ **JWT Tokens** - Secure token-based auth
✅ **Short-lived Access Tokens** - 1 hour expiry
✅ **Long-lived Refresh Tokens** - 7 days, stored in DB
✅ **HTTP Headers** - JWT passed via Authorization header
✅ **Input Validation** - Zod schema validation
✅ **Protected Routes** - Client-side route guards
✅ **Middleware** - Server-side route protection
✅ **CORS Enabled** - Secure cross-origin requests
✅ **Helmet Security** - HTTP security headers

## 🚀 Environment Variables

### Backend (.env.local)

```
DATABASE_URL=postgresql://user:password@host/database
PORT=4000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production
```

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:4000
```

## 🐛 Troubleshooting

### "Connection refused" error

- Make sure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify database exists

### "Invalid email or password"

- Check you're using registered email
- Verify password is correct
- Check caps lock

### "Token expired" error

- Wait for 1 hour or login again
- Refresh token functionality can be implemented

### Protected route won't redirect

- Check Auth Provider is wrapping your app
- Verify ProtectedRoute component is used
- Check localStorage has token

### Password validation fails

- Must be 8+ characters
- Must have uppercase letter
- Must have lowercase letter
- Must have number

## 📚 Next Steps (Optional Enhancements)

- [ ] Email verification on registration
- [ ] Password reset flow
- [ ] Google/GitHub OAuth integration
- [ ] Two-factor authentication
- [ ] User profile update endpoint
- [ ] Remember me functionality
- [ ] Session management dashboard
- [ ] Activity logging
- [ ] Role-based access control
- [ ] Admin dashboard

## 🆘 Need Help?

Check these files for implementation details:

- Backend: `backend/src/index.ts` - All auth routes
- Frontend: `frontend/src/context/AuthContext.tsx` - Auth logic
- Routes: `frontend/src/App.tsx` - Protected routes setup
- Components: `frontend/src/components/ProtectedRoute.tsx` - Route guard
