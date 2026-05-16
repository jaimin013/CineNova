# CineNova — Codebase Overview

> **A full-stack cinematic streaming platform** built with React (frontend) + Express/Prisma/PostgreSQL (backend).  
> Allows users to browse, search, and discover movies/series, with a full admin panel for content management.

---

## 1. Project Structure (High-Level)

```
CineNova/
├── backend/                 # Express.js API server
│   ├── prisma/              # Database schema, migrations, seed data
│   └── src/
│       ├── index.ts         # Server entry point — all routes defined here
│       ├── middleware/       # auth.ts, adminAuth.ts
│       ├── routes/          # admin.ts (all admin CRUD + TMDB pipeline)
│       └── utils/           # jwt.ts, password.ts, prisma.ts, tmdb.ts, validation.ts
├── frontend/                # React SPA (Vite + Tailwind CSS)
│   └── src/
│       ├── App.tsx          # Router setup
│       ├── main.tsx         # Entry point
│       ├── index.css        # Global styles (dark cinema theme)
│       ├── context/         # AuthContext.tsx (user auth state)
│       ├── components/      # Reusable UI (modals, nav, grids, hero)
│       ├── pages/           # Route/page components
│       └── styles/          # Movie detail page CSS
├── docker-compose.yml       # Postgres + Backend + Frontend
└── .env.example             # Environment template
```

---

## 2. Tech Stack

| Layer       | Technology                                                         |
|-------------|--------------------------------------------------------------------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion 12, React Router 7, Lucide React icons |
| **Backend**  | Node.js, Express 4, TypeScript, Prisma ORM, PostgreSQL, Zod validation, JWT auth, bcrypt, Axios |
| **Database** | PostgreSQL (via Prisma ORM — Neon serverless adapter available)    |
| **Auth**     | JWT access tokens (1h expiry) + refresh tokens (7d expiry), bcrypt password hashing |
| **DevOps**   | Docker Compose (3 services: postgres, backend, frontend)           |
| **External** | TMDB (The Movie Database) API for content discovery and import     |

---

## 3. Backend Architecture

### 3.1 Database Models (Prisma Schema)

```
User      — id, email, name, password, refreshToken, reviews[], reviewLikes[], meterVotes[], createdAt, updatedAt
Admin     — id, email, name, password, role("admin"/"superadmin"), refreshToken, createdAt, updatedAt
Content   — id, title, description, type("movie"/"series"), posterUrl, rating, genre, releaseYear,
            duration, section, platform?, backdropUrl?, featured, videoUrl?, casts?, 
            reviews[], meterVotes[], createdAt, updatedAt
Section   — id, name(unique), order, createdAt, updatedAt
Genre     — id, name(unique), createdAt, updatedAt
Platform  — id, name(unique), imageUrl?, createdAt, updatedAt
Review    — id, contentId, userId, text, voteType("Skip"/"Timepass"/"Go for it"/"Perfection"), 
            likes, likesList[], createdAt, updatedAt
ReviewLike — id, reviewId, userId, createdAt (unique: reviewId+userId)
MeterVote — id, contentId, userId, voteType, createdAt (unique: contentId+userId)
```

### 3.2 API Endpoints

#### Public Routes (no auth required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/refresh` | Refresh JWT tokens |
| GET | `/api/content` | List all content (with optional `type`, `section`, `platform` filters) |
| GET | `/api/content/featured` | Get featured content (hero section, max 5) |
| GET | `/api/content/section/:sectionName` | Get content by section |
| GET | `/api/content/:id` | Get single content item by ID |
| GET | `/api/sections` | Get all sections (ordered) |

#### Protected User Routes (Bearer token required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/logout` | Logout (clears refresh token) |
| GET | `/api/auth/me` | Get current user profile |
| **Reviews** | | |
| GET | `/api/content/:id/reviews` | Get all reviews for a content item (public, includes user's like status if authenticated) |
| POST | `/api/content/:id/reviews` | Create a new review with voteType (auth required) |
| DELETE | `/api/content/:id/reviews/:reviewId` | Delete own review (auth required) |
| POST | `/api/content/:id/reviews/:reviewId/like` | Toggle like/unlike on a review (auth required) |
| **CineNova Meter** | | |
| GET | `/api/content/:id/meter` | Get vote counts per type and current user's vote (public) |
| POST | `/api/content/:id/meter` | Submit or change meter vote (auth required, unvote by sending same voteType) |

#### Admin Routes (`adminMiddleware` — Bearer token with role "admin")

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/register` | Create admin account |
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| **Content CRUD** | | |
| GET | `/api/admin/content` | List all content (with optional filters: section, platform, type, featured) |
| POST | `/api/admin/content` | Create new content |
| GET | `/api/admin/content/:id` | Get content by ID |
| PUT | `/api/admin/content/:id` | Update content |
| DELETE | `/api/admin/content/:id` | Delete single content |
| DELETE | `/api/admin/content` | Bulk delete content (body: `{ ids: [...] }`) |
| **Dashboard** | | |
| GET | `/api/admin/stats` | Get platform stats (users, content counts) |
| **User Management** | | |
| GET | `/api/admin/users` | List all users |
| DELETE | `/api/admin/users/:id` | Delete a user |
| **Section Management** | | |
| GET | `/api/admin/sections` | List all sections |
| POST | `/api/admin/sections` | Create section |
| PUT | `/api/admin/sections/:id` | Update section |
| DELETE | `/api/admin/sections/:id` | Delete section |
| **Genre Management** | | |
| GET | `/api/admin/genres` | List all genres |
| POST | `/api/admin/genres` | Create genre |
| DELETE | `/api/admin/genres/:id` | Delete genre |
| **Platform Management** | | |
| GET | `/api/admin/platforms` | List all platforms |
| POST | `/api/admin/platforms` | Create platform |
| DELETE | `/api/admin/platforms/:id` | Delete platform |
| **TMDB Pipeline** | | |
| GET | `/api/admin/tmdb/search?query=&type=` | Search TMDB (multi/movie/tv) |
| GET | `/api/admin/tmdb/trending?type=` | Get trending from TMDB |
| GET | `/api/admin/tmdb/details/:type/:id` | Get TMDB details + credits |

### 3.3 Authentication Flow

1. **Register**: `POST /api/auth/register` — validates with Zod (`registerSchema`), hashes password with bcrypt, creates user, returns JWT access token (1h) + refresh token (7d) stored in DB.
2. **Login**: `POST /api/auth/login` — validates with Zod (`loginSchema`), verifies bcrypt hash, generates tokens, stores refresh token in DB.
3. **Token Refresh**: `POST /api/auth/refresh` — validates refresh token JWT, checks DB for token match, rotates tokens.
4. **Middleware**:
   - `authMiddleware` — extracts Bearer token, verifies access JWT, attaches `req.user`.
   - `adminMiddleware` — same but also checks `payload.role === "admin"`, attaches `req.admin`.
5. **Password requirements**: min 8 chars, must contain uppercase, lowercase, and number.

### 3.4 TMDB Integration

- Fetches from `https://api.themoviedb.org/3/` using API key from `TMDB_API_KEY` env var.
- `mapTMDBToContent()` transforms TMDB response into CineNova Content format.
- Supports search (multi/movie/tv), trending, and detail fetching (including cast/credits).
- Image URLs constructed using `https://image.tmdb.org/t/p/original` base.

### 3.5 Key Backend Files

- **index.ts** (475 lines) — Main server file. All route definitions, auth flow logic, public content endpoints.
- **routes/admin.ts** (641 lines) — All admin CRUD operations, TMDB pipeline, section/genre/platform management.
- **middleware/auth.ts** — `authMiddleware` and `optionalAuthMiddleware` for JWT verification.
- **middleware/adminAuth.ts** — `adminMiddleware` for admin-only route protection.
- **utils/jwt.ts** — Token generation (`generateTokens`), verification (`verifyAccessToken`, `verifyRefreshToken`), decoding.
- **utils/password.ts** — bcrypt hash/verify helpers.
- **utils/prisma.ts** — Prisma client singleton.
- **utils/tmdb.ts** — TMDB API fetch + response mapping.
- **utils/validation.ts** — Zod schemas for register, login, refresh token.

---

## 4. Frontend Architecture

### 4.1 Routing (React Router v7)

| Path | Component | Protected? | Auth Check |
|------|-----------|------------|------------|
| `/` | LandingPage | No | Redirects to `/dashboard` if authenticated |
| `/login` | LoginPortal | No | Redirects to `/dashboard` if authenticated |
| `/register` | RegisterPortal | No | Redirects to `/dashboard` if authenticated |
| `/admin/login` | AdminLogin | No | — |
| `/dashboard` | Dashboard | Yes (user) | AuthContext + ProtectedRoute |
| `/explore` | ExploreCategories | Yes (user) | AuthContext + ProtectedRoute |
| `/communities` | CommunitiesClubs | Yes (user) | AuthContext + ProtectedRoute |
| `/movie-detail/:id` | MovieDetail | Yes (user) | AuthContext + ProtectedRoute |
| `/admin/dashboard` | AdminDashboard | Yes (admin) | adminAccessToken in localStorage |

### 4.2 Component Tree

```
App (BrowserRouter)
└── AuthProvider (context)
    └── Routes
        ├── LandingPage           — Static hero, search bar, bento grid posters
        ├── LoginPortal            — Email/password form, glass effect card
        ├── RegisterPortal         — Registration form with validation
        ├── AdminLogin             — Admin sign-in with blue theme
        ├── [ProtectedRoute]Dashboard
        │   ├── AuthenticatedNavbar
        │   ├── AuthenticatedSidebar
        │   ├── DynamicFeaturedHero   — Fetches /api/content/featured, YouTube video bg
        │   └── DynamicContentGrid[]  — Fetches content per section
        ├── [ProtectedRoute]ExploreCategories
        │   ├── AuthenticatedNavbar
        │   └── AuthenticatedSidebar
        ├── [ProtectedRoute]CommunitiesClubs
        │   ├── AuthenticatedNavbar
        │   └── AuthenticatedSidebar
        ├── [ProtectedRoute]MovieDetail
        │   ├── AuthenticatedNavbar
        │   ├── AuthenticatedSidebar
        │   ├── MovieHero (backdrop/YouTube)
        │   ├── MovieInfoStrip
        │   ├── MovieCast
        │   ├── VibeChart
        │   ├── CinemaMeter
        │   ├── ReviewsSection
        │   └── MovieVideoModal
        └── [ProtectedRoute adminOnly]AdminDashboard
            └── ContentManagerModal  — 3-tab form (basic info, media, cast)
```

### 4.3 Auth System (AuthContext)

- Provides `user`, `isAuthenticated`, `isLoading`, `error`, and functions: `login()`, `register()`, `logout()`, `clearError()`.
- On mount, checks `localStorage` for `accessToken`, validates via `GET /api/auth/me`.
- Stores tokens in localStorage: `accessToken`, `refreshToken`.
- Admin auth is handled separately via `adminAccessToken` / `adminRefreshToken` in localStorage.

### 4.4 Styling Architecture

- **Tailwind CSS 4** with custom CSS variables in `index.css`.
- **Dark cinema theme**: deep dark backgrounds (`#0f0f0f`), warm gold accent (`#e5b76e`), subtle borders.
- **Custom utility classes**: `.btn-primary`, `.btn-secondary`, `.card`, `.input-field`, `.glass-effect`, `.text-glow`, `.gradient-gold`.
- **Typography**: Inter font, scale from 0.75rem (label) to 3.5rem (h1), all responsive.
- **MovieDetail page**: Separate `styles/movie-detail.css` for complex page-specific styling.
- **AdminDashboard**: Custom dark admin theme with blue/purple accents.

### 4.5 Key Frontend Files (Size & Purpose)

| File | Lines | Purpose |
|------|-------|---------|
| `App.tsx` | 72 | Router + layout |
| `context/AuthContext.tsx` | 181 | User auth state management |
| `index.css` | 385 | Global theme, utilities, typography |
| `pages/LandingPage.tsx` | 271 | Public landing with hero, search, bento grid |
| `pages/Dashboard.tsx` | 105 | Authenticated main page, dynamic content sections |
| `pages/MovieDetail.tsx` | 219 | Content detail page with hero, cast, vibe chart |
| `pages/LoginPortal.tsx` | 219 | Login form |
| `pages/RegisterPortal.tsx` | 282 | Registration form |
| `pages/AdminLogin.tsx` | 148 | Admin login (separate theme) |
| `pages/AdminDashboard.tsx` | 1026 | Full admin panel with 6 tabs |
| `pages/ExploreCategories.tsx` | 288 | Category browsing (A-Z layout) |
| `pages/CommunitiesClubs.tsx` | 271 | Social/community discovery page |
| `components/DynamicFeaturedHero.tsx` | 255 | Hero section with YouTube video background |
| `components/DynamicContentGrid.tsx` | 170 | Content grid (grid-2, grid-4, carousel) |
| `components/ContentManagerModal.tsx` | 708 | Admin modal for content CRUD |
| `components/ProtectedRoute.tsx` | 41 | Route guard for auth/admin |

---

## 5. Data Flow

### User Content Browsing Flow
```
User visits /dashboard
  → Dashboard fetches /api/sections to get dynamic section list
  → For each section, DynamicContentGrid fetches /api/content/section/:name
  → DynamicFeaturedHero fetches /api/content/featured for hero section
  → Clicking content → /movie-detail/:id → fetches /api/content/:id
```

### Admin Content Management Flow
```
Admin visits /admin/dashboard
  → Fetches stats, content, users, sections, genres, platforms via admin API
  → Can search TMDB via /api/admin/tmdb/search
  → Can import from TMDB → opens ContentManagerModal pre-filled
  → Submits content via POST/PUT /api/admin/content
```

### TMDB Import Pipeline
```
Admin searches TMDB
  → GET /api/admin/tmdb/search?query=...&type=...
  → Results displayed in pipeline tab
  → Click "Import To Library" → GET /api/admin/tmdb/details/:type/:id
  → ContentManagerModal opens with pre-filled data from TMDB
  → Admin adjusts fields → POST /api/admin/content
```

---

## 6. Docker Setup

```yaml
docker-compose.yml
  services:
    database:   postgres:17 (port 5432)
    backend:    Express (port 4000, depends on database)
    frontend:   Vite dev server (port 5173, depends on backend)
```

---

## 7. Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `PORT` | Backend | Server port (default 4000) |
| `JWT_SECRET` | Backend | Secret for JWT signing |
| `TMDB_API_KEY` | Backend | TMDB API key for content import |
| `VITE_API_URL` | Frontend | Backend API URL (default http://localhost:4000) |

---

## 8. Key Design Decisions

1. **Separate user and admin auth** — Users use `AuthContext` with standard JWT; admins use raw localStorage tokens (`adminAccessToken`) and a separate middleware flow.
2. **Dynamic sections** — Sections are stored in DB and fetched dynamically, allowing admin to add/remove/reorder homepage sections without redeployment.
3. **Content seeding** via Prisma seed (`prisma/seed.ts`) with `seed-data.json`.
4. **TMDB as external content source** — Admins can discover and import content from TMDB's API, which is mapped to the internal Content model.
5. **Movie details page** has rich compound sub-components (VibeChart, CinemaMeter, ReviewsSection, MovieHero, etc.). CinemaMeter and ReviewsSection are now fully connected to the backend via real API endpoints — users can submit reviews with voteType, like/unlike reviews, and vote on the CineNova Meter (per-user, stored in DB).
6. **CSS-driven theming** — No CSS-in-JS or CSS modules; relies on Tailwind + CSS variables for a consistent dark cinema aesthetic.