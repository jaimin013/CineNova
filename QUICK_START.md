# CineNova Quick Start - Authentication Setup

## ⚡ 5-Minute Setup

### 1. Create Postgres Database (Pick ONE)

**Neon.tech (Easiest - Free Cloud)**

```
1. Visit https://neon.tech → Sign up
2. Create project
3. Copy connection string
```

**Or Local Postgres**

```bash
# macOS
brew install postgresql
brew services start postgresql

# Linux
sudo apt install postgresql
sudo service postgresql start

# Then create database
createdb cinenova
# Connection: postgresql://localhost/cinenova
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env.local file with:
DATABASE_URL="postgresql://..."  # Your Postgres URL
JWT_SECRET=my_secret_key_123
PORT=4000

# Run migrations
npx prisma migrate dev --name init

# Start server
npm run dev
# Server at: http://localhost:4000
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file with:
VITE_API_URL=http://localhost:4000

# Start dev server
npm run dev
# Frontend at: http://localhost:5173
```

## 🧪 Test It!

1. **Open browser**: http://localhost:5173/register
2. **Create account**:
   - Name: John Doe
   - Email: john@example.com
   - Password: MyPass123
3. **Auto login** → Redirects to dashboard
4. **Try protected route**: http://localhost:5173/explore ✅ Works
5. **Logout** and try again → Redirects to login ✅ Works

## 📋 What's Working

✅ Registration with validation
✅ Login with bcrypt password verification
✅ JWT tokens (1h access, 7d refresh)
✅ Protected routes
✅ Auto-logout
✅ Real database persistence
✅ No more hardcoded credentials

## 🔐 Authentication Routes

| Route                | Method | Protected | Purpose          |
| -------------------- | ------ | --------- | ---------------- |
| `/api/auth/register` | POST   | ❌        | Create account   |
| `/api/auth/login`    | POST   | ❌        | Login            |
| `/api/auth/logout`   | POST   | ✅        | Logout           |
| `/api/auth/me`       | GET    | ✅        | Get current user |
| `/api/auth/refresh`  | POST   | ❌        | Refresh token    |

## 🛡️ Protected Frontend Routes

Require login:

- `/dashboard`
- `/explore`
- `/communities`
- `/movie-detail`

Public:

- `/` (landing)
- `/login`
- `/register`

## 💡 Password Rules

Your password must have:

- ✅ 8+ characters
- ✅ 1 UPPERCASE letter
- ✅ 1 lowercase letter
- ✅ 1 number

Example: `Password123`

## 🚨 Common Issues

| Error                        | Fix                                            |
| ---------------------------- | ---------------------------------------------- |
| Connection refused           | Postgres not running                           |
| Token invalid                | Database URL wrong                             |
| Can't access /dashboard      | Not logged in (intended!)                      |
| Invalid email or password    | Check credentials match                        |
| Google/Apple buttons missing | Intentionally removed, only email+password now |

## 📂 Key Files Created/Modified

**Backend:**

- `src/utils/jwt.ts` - Token generation
- `src/utils/password.ts` - Password hashing
- `src/utils/validation.ts` - Zod validation schemas
- `src/middleware/auth.ts` - Auth middleware
- `src/index.ts` - All auth endpoints

**Frontend:**

- `src/context/AuthContext.tsx` - Auth state
- `src/components/ProtectedRoute.tsx` - Route guard
- `src/pages/LoginPortal.tsx` - Login form (updated)
- `src/pages/RegisterPortal.tsx` - Register form (new)
- `src/App.tsx` - Routes with protection (updated)

**Database:**

- `prisma/schema.prisma` - User model with password

## 🎯 You Can Now

✅ Register new users
✅ Login securely
✅ Only authenticated users see dashboard/explore
✅ Passwords are hashed (not stored as plaintext)
✅ Sessions persist on page refresh
✅ Logout clears everything
✅ JWT tokens expire automatically

## 🔄 Data Flow

```
User Registration
├─ Fill form → RegisterPortal.tsx
├─ POST /api/auth/register
├─ Backend validates + hashes password
├─ Saves to Postgres
├─ Returns JWT tokens
├─ Frontend stores token in localStorage
└─ Auto-redirects to dashboard

User Login
├─ Fill form → LoginPortal.tsx
├─ POST /api/auth/login
├─ Backend checks DB + verifies password
├─ Returns JWT tokens
├─ Frontend stores token → useAuth()
└─ Auto-redirects to dashboard

Protected Routes
├─ Try accessing /dashboard
├─ Check if token exists + valid
├─ If valid → show page
├─ If invalid → redirect to /login
```

## 📚 Full Docs

See `AUTHENTICATION_SETUP.md` for complete documentation including:

- Detailed API endpoints
- Environment variables
- Database schema
- Security features
- Troubleshooting
- Future enhancements

---

**That's it! Your app now has real authentication! 🎉**
