# Admin System Guide

## Overview

The admin panel is a complete content management system (CMS) that allows administrators to create, read, update, and delete movie/series content in the CineNova database. All admin operations are protected by JWT authentication and role-based access control.

## Admin Features

### 1. Admin Authentication

- **Login**: `/admin/login` - Secure admin login
- **Logout**: Protected route - Clear sessions
- **JWT Tokens**: Access token (1 hour) + Refresh token (7 days)

### 2. Content Management

- **Create Content**: Add new movies or series with all metadata
- **Read Content**: View all content with search and filters
- **Update Content**: Edit existing content details
- **Delete Content**: Remove single or multiple items
- **Featured Content**: Mark content as featured (★)

### 3. Content Fields

- **Title**: Display name
- **Description**: Detailed synopsis (min 10 characters)
- **Type**: Movie or Series
- **Poster URL**: Card image URL
- **Backdrop URL**: Background image URL (optional)
- **Rating**: 0-10 scale (optional)
- **Genre**: Content category
- **Release Year**: Year of release (optional)
- **Duration**: Length in minutes (optional)
- **Section**: Content section/collection name
- **Platform**: Streaming platform (optional)
- **Featured**: Mark as featured content
- **Casts**: Actor names, comma-separated (optional)

## Setup Instructions

### 1. Create Default Admin Account

```bash
cd backend
npx ts-node prisma/seed-admin.ts
```

**Output (Example)**:

```
🌱 Seeding default admin account...
✅ Default admin created successfully!
📋 Admin Details:
   Email: admin@cinerenova.com
   Password: Admin@1234
   Important: Change this password immediately after first login!
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:

```
🚀 Server is running at http://localhost:4000
✅ Database connected via Prisma
```

### 3. Start Frontend Server

```bash
cd frontend
npm run dev
```

Access at: `http://localhost:5173`

## Using the Admin Panel

### Login

1. Navigate to `/admin/login`
2. Enter credentials:
   - **Email**: `admin@cinerenova.com`
   - **Password**: `Admin@1234`
3. Click "Sign In"

### Access Dashboard

After login, you'll be redirected to `/admin/dashboard`

### Add New Content

1. Click **"+ Add Content"** button
2. Fill in all required fields:
   - Title
   - Description (min 10 chars)
   - Type (Movie/Series)
   - Genre
   - Poster URL
   - Section
3. Click **"Create Content"**

### Edit Content

1. Click the **Edit** icon (pencil) on any row
2. Modify the fields
3. Click **"Update Content"**

### Delete Content

1. Click the **Delete** icon (trash) on any row
2. Confirm the deletion
3. Content will be removed

### Search & Filter

- Use the search box to find content by title or section
- Results update in real-time

## API Endpoints

### Admin Authentication

- `POST /api/admin/register` - Create admin account
- `POST /api/admin/login` - Login and get tokens
- `POST /api/admin/logout` - Logout (requires token)

### Admin Content Management (All Protected)

- `GET /api/admin/content` - Get all content (with optional filters)
- `POST /api/admin/content` - Create new content
- `GET /api/admin/content/:id` - Get single content
- `PUT /api/admin/content/:id` - Update content
- `DELETE /api/admin/content/:id` - Delete single content
- `DELETE /api/admin/content` - Bulk delete (body: `{ ids: [1, 2, 3] }`)

### Request Headers

All protected routes require:

```
Authorization: Bearer <access_token>
```

## Security Features

✅ **Password Hashing**: Bcrypt with 10 rounds
✅ **JWT Authentication**: Access + Refresh tokens
✅ **Role-Based Access**: Admin-only endpoints
✅ **Input Validation**: Zod schemas on all inputs
✅ **Error Handling**: Comprehensive error responses
✅ **CORS**: Configured for frontend access
✅ **Helmet**: Security headers middleware
✅ **Token Expiry**: Access tokens expire after 1 hour

## Environment Variables

Backend (`.env`):

```
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...
JWT_SECRET=your_secret_key
PORT=4000
```

Frontend (`.env.local`):

```
VITE_API_URL=http://localhost:4000
```

## Troubleshooting

### Issue: "Admin access required"

- **Solution**: Make sure you're using a valid admin token. Re-login if necessary.

### Issue: "Invalid content URL"

- **Solution**: Ensure poster and backdrop URLs are valid HTTP/HTTPS URLs.

### Issue: "Validation failed"

- **Solution**: Check all required fields are filled with proper format:
  - Description must be at least 10 characters
  - URLs must be valid
  - Rating must be 0-10

### Issue: "Content not found"

- **Solution**: The content may have been deleted. Refresh the page.

### Issue: Network errors

- **Solution**: Ensure backend is running at `http://localhost:4000`

## Best Practices

1. **Change Default Password**: Always change the default admin password immediately
2. **Use Valid URLs**: Always use high-quality poster images
3. **Descriptive Titles**: Use full, searchable titles
4. **Update Featured Content**: Rotate featured content regularly
5. **Backup Content**: Keep content descriptions/metadata logged elsewhere
6. **Monitor Usage**: Check logs for any unauthorized access attempts

## Advanced Features

### Bulk Operations

Delete multiple items at once:

```bash
curl -X DELETE http://localhost:4000/api/admin/content \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "ids": [1, 2, 3] }'
```

### Filter by Section

```
GET /api/admin/content?section=Trending
```

### Filter by Platform

```
GET /api/admin/content?platform=Netflix
```

### Filter by Type

```
GET /api/admin/content?type=movie
```

## Support

For issues or questions:

1. Check the error message displayed in the admin panel
2. Review backend logs in terminal
3. Verify database connection
4. Check input validation requirements

---

**Last Updated**: Now
**Version**: 1.0
