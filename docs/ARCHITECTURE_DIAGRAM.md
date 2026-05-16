# 🏗️ CineNova Authentication Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER BROWSER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           React Frontend (Vite + TypeScript)                │  │
│  │                                                              │  │
│  │  ┌───────────────────────────────────────────────────────┐  │  │
│  │  │  App.tsx (with AuthProvider + Root Routes)           │  │  │
│  │  │                                                       │  │  │
│  │  │  PublicRoutes:           ProtectedRoutes:            │  │  │
│  │  │  ├─ / (Landing)          ├─ /dashboard              │  │  │
│  │  │  ├─ /login               ├─ /explore                │  │  │
│  │  │  └─ /register            ├─ /communities            │  │  │
│  │  │                           └─ /movie-detail           │  │  │
│  │  │                            ↑ Wrapped with           │  │  │
│  │  │                            ProtectedRoute           │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌───────────────────────────────────────────────────────┐  │  │
│  │  │  React Context (Auth State Management)               │  │  │
│  │  │                                                       │  │  │
│  │  │  AuthContext.tsx                                     │  │  │
│  │  │  ├─ user: User | null                                │  │  │
│  │  │  ├─ isAuthenticated: boolean                         │  │  │
│  │  │  ├─ isLoading: boolean                               │  │  │
│  │  │  ├─ error: string | null                             │  │  │
│  │  │  ├─ login(email, password)                           │  │  │
│  │  │  ├─ register(email, name, password)                  │  │  │
│  │  │  └─ logout()                                         │  │  │
│  │  │                                                       │  │  │
│  │  │  useAuth() Hook ← Used by all components             │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌───────────────────────────────────────────────────────┐  │  │
│  │  │  Components                                          │  │  │
│  │  │  ├─ LoginPortal.tsx → POST /api/auth/login          │  │  │
│  │  │  ├─ RegisterPortal.tsx → POST /api/auth/register    │  │  │
│  │  │  └─ ProtectedRoute.tsx → Checks auth status         │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  ┌───────────────────────────────────────────────────────┐  │  │
│  │  │  Token Storage (localStorage)                        │  │  │
│  │  │  ├─ accessToken (1h expiry)                          │  │  │
│  │  │  └─ refreshToken (7d expiry)                         │  │  │
│  │  └───────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↕                                      │
│                          HTTPS/JSON                                │
│                                                                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER (Express)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  src/index.ts (Main Server)                                │  │
│  │                                                              │  │
│  │  PUBLIC ENDPOINTS:                                          │  │
│  │  ├─ POST /api/auth/register                                │  │
│  │  │  ├─ Validate input (Zod)                               │  │
│  │  │  ├─ Hash password (bcrypt)                             │  │
│  │  │  ├─ Save to DB (Prisma)                                │  │
│  │  │  └─ Return JWT tokens                                  │  │
│  │  │                                                          │  │
│  │  ├─ POST /api/auth/login                                   │  │
│  │  │  ├─ Find user in DB                                    │  │
│  │  │  ├─ Verify password (bcrypt)                           │  │
│  │  │  ├─ Generate tokens (JWT)                              │  │
│  │  │  └─ Return tokens                                      │  │
│  │  │                                                          │  │
│  │  └─ POST /api/auth/refresh                                 │  │
│  │     └─ Verify refresh token → Issue new access token      │  │
│  │                                                              │  │
│  │  PROTECTED ENDPOINTS (require JWT):                         │  │
│  │  ├─ GET /api/auth/me                                       │  │
│  │  │  ├─ Verify token (Middleware)                          │  │
│  │  │  └─ Return authenticated user                          │  │
│  │  │                                                          │  │
│  │  └─ POST /api/auth/logout                                  │  │
│  │     └─ Clear refresh token from DB                         │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Middleware Stack                                            │  │
│  │  ├─ Helmet (Security headers)                               │  │
│  │  ├─ CORS (Cross-origin requests)                            │  │
│  │  ├─ Express.json (JSON parsing)                             │  │
│  │  └─ authMiddleware (Custom JWT validation)                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Utilities                                                  │  │
│  │                                                              │  │
│  │  jwt.ts:                                                    │  │
│  │  ├─ generateTokens(payload)                                │  │
│  │  ├─ verifyAccessToken(token)                              │  │
│  │  └─ verifyRefreshToken(token)                             │  │
│  │                                                              │  │
│  │  password.ts:                                              │  │
│  │  ├─ hashPassword(password) → bcrypt                        │  │
│  │  └─ verifyPassword(password, hash)                         │  │
│  │                                                              │  │
│  │  validation.ts:                                            │  │
│  │  ├─ registerSchema (Zod)                                   │  │
│  │  └─ loginSchema (Zod)                                      │  │
│  │                                                              │  │
│  │  auth.ts (Middleware):                                     │  │
│  │  ├─ authMiddleware (JWT validation)                        │  │
│  │  └─ optionalAuthMiddleware                                 │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Database Connection (Prisma ORM)                           │  │
│  │  └─ PostgreSQL (Neon / Local)                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↕                                      │
│                         SQL Queries                                │
│                                                                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Table: User                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  id (INT, PRIMARY KEY, AUTO_INCREMENT)                      │  │
│  │  email (VARCHAR, UNIQUE)                                    │  │
│  │  name (VARCHAR)                                             │  │
│  │  password (VARCHAR, HASHED WITH BCRYPT)                     │  │
│  │  refreshToken (VARCHAR, NULLABLE)                           │  │
│  │  createdAt (TIMESTAMP, DEFAULT NOW)                         │  │
│  │  updatedAt (TIMESTAMP, AUTO UPDATE)                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Storage:                                                          │
│  ├─ Neon Cloud (Recommended) → Free tier, serverless             │  │
│  ├─ Local PostgreSQL → Development                               │  │
│  └─ Docker Container → Testing                                   │  │
│                                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

## Authentication Flow Diagram

### Registration Flow

```
User fills form (name, email, password, confirm)
                    ↓
         Frontend validates locally
                    ↓
    POST /api/auth/register (JSON)
                    ↓
         Backend validates with Zod
                    ↓
         Check if email exists
       ├─ YES → Return 409 error
       └─ NO → Continue
                    ↓
        Hash password with bcrypt
                    ↓
       Create user in PostgreSQL
                    ↓
      Generate JWT tokens (access + refresh)
                    ↓
      Store refresh token in User record
                    ↓
      Return tokens + user data
                    ↓
   Frontend stores in localStorage
                    ↓
  Auth Context updates (user, isAuthenticated)
                    ↓
   Components re-render with login state
                    ↓
   Auto-redirect to /dashboard
```

### Login Flow

```
User enters email + password
                    ↓
     Frontend validates format
                    ↓
      POST /api/auth/login
                    ↓
      Backend validates Zod schema
                    ↓
       Find user by email in DB
       ├─ NOT FOUND → Return 401
       └─ FOUND → Continue
                    ↓
    Compare password with hash (bcrypt)
       ├─ MISMATCH → Return 401
       └─ MATCH → Continue
                    ↓
     Generate new JWT tokens
                    ↓
     Update refreshToken in DB record
                    ↓
     Return tokens + user data
                    ↓
  Frontend stores tokens in localStorage
                    ↓
   Auth Context updates (user, isAuthenticated)
                    ↓
     Auto-redirect to /dashboard
```

### Protected Route Flow

```
User navigates to /dashboard
                    ↓
        ProtectedRoute component renders
                    ↓
         useAuth() hook gets state
                    ↓
    Check if isAuthenticated = true
       ├─ YES → Render page
       ├─ LOADING → Show spinner
       └─ NO → Redirect to /login
                    ↓
If page loads, headers include token:
  Authorization: Bearer {accessToken}
                    ↓
Backend authMiddleware validates token
       ├─ VALID → Attach user to request
       ├─ EXPIRED → Return 401
       └─ INVALID → Return 401
                    ↓
       Process route handler
                    ↓
      Return response to frontend
```

### Logout Flow

```
User clicks logout button
                    ↓
   logout() function from useAuth called
                    ↓
  POST /api/auth/logout (with token)
                    ↓
  Backend validates JWT middleware
                    ↓
  Updates DB: set refreshToken = null
                    ↓
     Removes tokens from localStorage
                    ↓
  Auth Context clears (user = null)
                    ↓
  Components re-render without login state
                    ↓
   Auto-redirect to /login
```

## Token Structure

### Access Token (JWT)

```json
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "id": 1,
  "email": "user@example.com",
  "iat": 1704067200,
  "exp": 1704070800        // Expires in 1 hour
}

Signature: HMAC-SHA256(header + payload + secret)

Format in requests:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Refresh Token (JWT)

```json
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "id": 1,
  "email": "user@example.com",
  "iat": 1704067200,
  "exp": 1704672000       // Expires in 7 days
}

Signature: HMAC-SHA256(header + payload + secret)

Storage: localStorage.refreshToken
Usage: To get new access token when expired
```

## Security Features

### Password Security

```
User Input: "MyPassword123"
            ↓
     Bcrypt with salt rounds = 10
            ↓
Database stored: $2b$10$...(60 char hash)
            ↓
On login: Compare input with stored hash
            ↓
✅ Never stored as plaintext
✅ Cannot be reversed
✅ Requires min 8 chars, uppercase, lowercase, number
```

### Token Security

```
JWT Structure: header.payload.signature
            ↓
Signed with server secret (JWT_SECRET)
            ↓
Frontend can READ payload (not secret)
Frontend CANNOT forge token (needs secret)
            ↓
Backend verifies signature before trusting
            ↓
Token sent in HTTP header (not cookie)
            ↓
Short access token (1h) limits exposure
Long refresh token (7d) for convenience
```

### Request Security

```
Middleware Stack:
  1. Helmet (Security headers)
  2. CORS (Allowed origins)
  3. Rate limiting (Optional)
  4. Input validation (Zod)
  5. Auth verification (JWT)
  6. Request size limits
            ↓
✅ Protects against common attacks
✅ Validates all inputs
✅ Verifies tokens
✅ Prevents unauthorized access
```

## State Management

### AuthContext Component Tree

```
<BrowserRouter>
  <AuthProvider>                    ← Provides useAuth hook
    ├─ Auth State: user, tokens, loading, error
    ├─ Methods: login, register, logout
    │
    ├─ <Routes>
    │   ├─ Public: /login, /register, /
    │   │
    │   ├─ Protected: /dashboard
    │   │   └─ <ProtectedRoute>
    │   │       └─ Checks auth + redirects
    │   │
    │   └─ ...more routes
    │
    └─ All components can call useAuth()
```

### LocalStorage Structure

```
localStorage:
{
  "accessToken": "eyJhbGc...",      // Added on login/register
  "refreshToken": "eyJhbGc...",     // Added on login/register
}

// Cleared on logout
```

## File Dependencies

```
App.tsx
├─ AuthProvider (from context/AuthContext.tsx)
├─ ProtectedRoute (from components/ProtectedRoute.tsx)
├─ LoginPortal, RegisterPortal pages
└─ Backend: /api/auth/* endpoints

LoginPortal.tsx
├─ useAuth hook (from context/AuthContext.tsx)
└─ Backend: POST /api/auth/login

RegisterPortal.tsx
├─ useAuth hook (from context/AuthContext.tsx)
└─ Backend: POST /api/auth/register

ProtectedRoute.tsx
├─ useAuth hook
├─ Navigate (from react-router-dom)
└─ Backend: GET /api/auth/me (optional)

Auth Endpoints (backend/src/index.ts)
├─ utils/jwt.ts (token funcs)
├─ utils/password.ts (hashing)
├─ utils/validation.ts (schemas)
├─ middleware/auth.ts (verification)
├─ Prisma (database)
└─ Zod (validation)

Database (backend/prisma/schema.prisma)
└─ User model (Prisma ORM)
```

---

This architecture provides **security**, **scalability**, and **maintainability** while keeping things simple and understandable! 🎯
