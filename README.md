# CineNova | Premium Full-Stack Boilerplate

A modern, high-performance, and type-safe boilerplate for full-stack applications.

## 🚀 Tech Stack

### Frontend

- **React 19**: The latest React features and optimizations.
- **Vite**: Ultra-fast next-gen build tool.
- **TypeScript**: Complete type safety for the UI layer.
- **Framer Motion**: State-of-the-art animations for a premium feel.
- **Lucide Icons**: Beautiful, lightweight icons.
- **Vanilla CSS + CSS Variables**: Maximum control with modern styling techniques.

### Backend

- **Node.js (Next-Gen)**: Optimized for fast, modern runtime.
- **Express 4.x**: Robust and widely-adopted routing.
- **Zod**: Declarative schema validation for API inputs.
- **TypeScript**: End-to-end type safety between frontend and backend.
- **Helmet**: Security-focused HTTP headers.
- **Dotenv**: Centralized environment configuration.

## 📁 Structure

- `/frontend`: Vite-powered React project.
- `/backend`: Node-Express-TS server.
- `package.json`: Root scripts to manage both environments.

## 🛠️ Getting Started

### 1. Install Dependencies

Run from the root directory:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Run Development Server

From the root directory:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

### 3. Build for Production

```bash
npm run build
```

## 🔐 Security & Validation

The backend includes:

- **Helmet**: Protects your app from common vulnerabilities.
- **CORS**: Configured for secure cross-origin requests.
- **Zod Validation**: Ensures data integrity with schema-based validation.

## 🔑 Authentication System

CineNova includes a complete **production-ready authentication system** with:

### ✅ Backend Features

- **JWT-based authentication** with access & refresh tokens
- **Bcrypt password hashing** (10 salt rounds)
- **Protected routes** with middleware
- **Zod schema validation** for all auth inputs
- **Database persistence** with Prisma ORM

### ✅ Frontend Features

- **Auth Context Provider** for centralized state
- **Protected Route components** with auto-redirect
- **Login & Registration pages** with validation
- **Token persistence** across sessions
- **Auto-logout** on token expiry

### 🚀 Quick Setup

**See [QUICK_START.md](./QUICK_START.md)** for a 5-minute setup guide.

**For full documentation**: [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)

### Routes Requiring Login

- `/dashboard` - Main dashboard
- `/explore` - Category explorer
- `/communities` - Communities section
- `/movie-detail` - Movie details

### Public Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Test Account (After Registration)

1. Go to `http://localhost:5173/register`
2. Create a new account (password must have: 8 chars, uppercase, lowercase, number)
3. Auto-login and dashboard access!

### Password Requirements

- ✅ Minimum 8 characters
- ✅ 1 uppercase letter (A-Z)
- ✅ 1 lowercase letter (a-z)
- ✅ 1 number (0-9)
