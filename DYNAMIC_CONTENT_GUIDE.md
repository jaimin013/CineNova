# CineNova Dynamic Content System Documentation

## Overview

The CineNova application now uses a fully dynamic content system. All movies and series are stored in a PostgreSQL database (via Neon) and fetched through REST APIs. This eliminates the need to hardcode images or content into components.

## Architecture

### Backend Stack

- **Database**: PostgreSQL (Neon) with Prisma ORM v6
- **Content Model**: Single `Content` table with fields:
  - `id`: Unique identifier
  - `title`: Movie/Series name
  - `description`: Full description text
  - `type`: "movie" or "series"
  - `posterUrl`: URL to poster image
  - `backdropUrl`: URL to backdrop/hero image
  - `rating`: Movie rating (0-10)
  - `genre`: Comma-separated genres
  - `releaseYear`: Year of release
  - `duration`: Duration in minutes (for movies)
  - `section`: Section name (e.g., "Talk Of The Town", "Editor's Pick", etc.)
  - `platform`: Platform name (e.g., "netflix", "jiohotstar", "prime", null for general)
  - `featured`: Boolean flag for featured content
  - `casts`: JSON string of cast array

### Frontend Components

#### 1. **DynamicFeaturedHero** (`components/DynamicFeaturedHero.tsx`)

- Displays the featured hero section at the top of dashboard
- Fetches from `/api/content/featured` endpoint
- Shows first featured content item
- Includes play button linking to movie/series detail page

#### 2. **DynamicContentGrid** (`components/DynamicContentGrid.tsx`)

- Reusable component for displaying content in grid layout
- Props:
  - `sectionName`: The section name to fetch (e.g., "Talk Of The Town")
  - `title`: Display title for the section
  - `subtitle`: Optional subtitle
  - `layout`: Grid layout type ("grid-2", "grid-4", "carousel")
- Features:
  - Auto-fetches content from `/api/content/section/{sectionName}`
  - Shows loading state with skeleton
  - Handles errors gracefully
  - Hover effects and animations

#### 3. **Dashboard** (`pages/Dashboard.tsx`)

- Main dashboard page for authenticated users
- Imports and uses `DynamicFeaturedHero`
- Uses multiple `DynamicContentGrid` components for each section
- Shows topbar, sidebar, and footer
- Sections displayed:
  - Talk of the Town
  - Editor's Pick of the Week
  - Most Interested
  - Don't Miss These on Netflix
  - Don't Miss These on JioHotstar
  - Worth Watching on Prime

#### 4. **MovieDetail** (`pages/MovieDetail.tsx`)

- Dynamic movie/series detail page
- Route: `/movie-detail/:id`
- Fetches single content by ID from `/api/content/:id`
- Displays:
  - Hero section with backdrop
  - Title, description, rating
  - Release year, duration, genres
  - Cast information (if available)
  - Community section for comments
- Handles loading and error states

### Backend API Endpoints

All endpoints are located in `backend/src/index.ts`:

#### Public Endpoints (No Authentication Required)

1. **GET /api/content**
   - Fetch all content
   - Query params: `type`, `section`, `platform` (optional filters)
   - Response: Array of content objects

2. **GET /api/content/featured**
   - Fetch featured content
   - Returns: Array of featured items (up to 5)

3. **GET /api/content/section/:sectionName**
   - Fetch content by section name
   - Route param: `sectionName` (e.g., "Talk Of The Town")
   - Response: Array of content in that section

4. **GET /api/content/:id**
   - Fetch single content by ID
   - Route param: `id` (numeric ID)
   - Response: Single content object with full details

5. **GET /api/sections**
   - Fetch all unique section names
   - Response: Array of section names

## Adding New Movies/Series

### Option 1: Add to JSON Seed File (Recommended for Initial Setup)

1. Edit `backend/prisma/seed-data.json`:

   ```json
   {
     "title": "Movie Title",
     "description": "Full description...",
     "type": "movie",
     "posterUrl": "https://...",
     "backdropUrl": "https://...",
     "rating": 8.5,
     "genre": "Action,Drama,Sci-Fi",
     "releaseYear": 2024,
     "duration": 120,
     "section": "Talk Of The Town",
     "platform": null,
     "featured": false,
     "casts": "[{\"name\":\"Actor Name\",\"role\":\"Character\",\"image\":\"https://...\"}]"
   }
   ```

2. Run seed script:
   ```bash
   npm run seed
   ```

### Option 2: Manual Database Entry via Prisma Studio

1. Start Prisma Studio:

   ```bash
   npx prisma studio
   ```

2. Navigate to `Content` table and click "Add record"

3. Fill in all required fields

### Option 3: API Endpoint (For Future Admin Panel)

Create a POST endpoint once admin panel is built:

```bash
POST /api/content/create
```

Request body:

```json
{
  "title": "...",
  "description": "...",
  ...
}
```

## Adding New Sections

Sections are dynamically created based on the `section` field in content records. To add a new section:

1. Add content items with the new `section` name in seed data or database
2. Add a new `DynamicContentGrid` component in Dashboard.tsx:

```tsx
<DynamicContentGrid
  sectionName="Your Section Name"
  title="Display Title"
  subtitle="Optional subtitle"
  layout="grid-4"
/>
```

3. No backend changes needed - the API automatically serves by section name

## Database Seeding

### Initial Seed

```bash
cd backend
npm run seed
```

This reads `prisma/seed-data.json` and populates the database.

### Clear and Reseed

```bash
npx prisma migrate reset
npm run seed
```

## Image Storage Strategy

Currently using external URLs (hosted images). For future enhancement with image uploads:

1. Store images in cloud storage (AWS S3, Cloudinary, etc.)
2. Save URLs in database posterUrl/backdropUrl fields
3. Update seed script to handle file uploads

Alternatively, for on-premises storage:

1. Create endpoint: `POST /api/upload`
2. Store images in `backend/public/images`
3. Reference as: `http://localhost:4000/images/filename.jpg`

## Environment Configuration

Ensure `.env` file in backend has:

```
DATABASE_URL=postgresql://... (pooler URL)
DATABASE_URL_UNPOOLED=postgresql://... (unpooled URL for migrations)
JWT_SECRET=your-secret
PORT=4000
NODE_ENV=development
```

Frontend `.env`:

```
VITE_API_URL=http://localhost:4000
```

## Scaling Considerations

### When You Have 10,000+ Movies:

1. Add pagination to DynamicContentGrid:

   ```tsx
   const [page, setPage] = useState(1)
   const skip = (page - 1) * 20
   // fetch with &skip={skip}&take=20
   ```

2. Add database indexes (already in schema for `section`, `platform`, `featured`)

3. Implement caching:
   ```tsx
   // Cache featured content for 1 hour
   const [cached, setCached] = useState(null)
   const cacheTime = useRef(Date.now())
   ```

## Future Enhancements

1. **Admin Panel**:
   - CRUD operations for content
   - Bulk import from CSV
   - Image upload interface

2. **Search & Filtering**:
   - Full-text search on title/description
   - Advanced filters (year range, rating range)
   - Genre-based filtering

3. **User Preferences**:
   - Store user watchlist
   - Track viewing history
   - Personalized recommendations

4. **Analytics**:
   - Track which content is most viewed
   - User engagement metrics
   - Section performance dashboard

## Troubleshooting

### Movies not showing up:

1. Check database: `SELECT COUNT(*) FROM "Content"`
2. Verify section names match exactly (case-sensitive)
3. Check VITE_API_URL is correct in frontend

### Images not loading:

1. Test URL in browser directly
2. Check CORS is enabled on backend
3. Verify URL is accessible and not expired

### Performance issues:

1. Add indexes via Prisma migration
2. Implement pagination for large sections
3. Use React.memo() to prevent re-renders
4. Implement lazy loading for images

## File Structure

```
backend/
├── src/
│   ├── index.ts (all API endpoints)
│   ├── middleware/
│   │   └── auth.ts
│   └── utils/
│       ├── jwt.ts
│       ├── password.ts
│       └── validation.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts (seed script)
│   └── seed-data.json (seed data)

frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx (main dashboard with dynamic sections)
│   │   ├── MovieDetail.tsx (dynamic detail page with :id)
│   │   └── ...
│   ├── components/
│   │   ├── DynamicFeaturedHero.tsx
│   │   ├── DynamicContentGrid.tsx
│   │   └── ...
│   └── App.tsx (updated routing)
```

## Key Benefits of This Setup

✅ **No Hardcoding**: All content in database
✅ **Fully Dynamic**: Add content without code changes
✅ **Scalable**: Works with thousands of movies
✅ **Reusable Components**: DynamicContentGrid works for any section
✅ **Easy Maintenance**: Seed script for bulk operations
✅ **Future-Proof**: Ready for admin panel integration

## Quick Start Command Reference

```bash
# Start backend
cd backend
npm run dev

# Seed database
npm run seed

# Open Prisma Studio
npx prisma studio

# Run migrations
npx prisma migrate dev --name description
```

---

For questions or issues, check the API responses and console logs for detailed error messages.
