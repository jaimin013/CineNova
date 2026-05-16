import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { prisma } from './utils/prisma'
import { generateTokens, verifyRefreshToken } from './utils/jwt'
import { hashPassword, verifyPassword } from './utils/password'
import { registerSchema, loginSchema, refreshTokenSchema } from './utils/validation'
import { authMiddleware } from './middleware/auth'
import { adminMiddleware } from './middleware/adminAuth'
import {
  adminRegister,
  adminLogin,
  adminLogout,
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
  bulkDeleteContent,
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
  getAllGenres,
  createGenre,
  deleteGenre,
  getAllPlatforms,
  createPlatform,
  deletePlatform,
  getEditorsPickCategories,
  createEditorsPickCategory,
  deleteEditorsPickCategory,
  getAllContentGroups,
  createContentGroup,
  searchTMDB,
  getTrendingTMDB,
  getTMDBDetails,
  searchOMDBController,
  getOMDBDetails,
  discoverTMDB,
  getReportedReviews,
  dismissReportedReview,
  deleteReportedReviewContent,
} from './routes/admin'
import logger from './utils/logger'
import {
  getReviews,
  createReview,
  deleteReview,
  toggleReviewLike,
  getMeterVotes,
  submitMeterVote,
  reportReview,
} from './routes/reviews'
import {
  getCommunities,
  getCommunityMessages,
  postMessage,
  createCommunity,
  updateCommunity,
  deleteCommunity,
} from './routes/communities'
import {
  toggleWatched,
  toggleCollection,
  getContentInteractions,
  getWatchedList,
  getCollectionList,
} from './routes/interactions'
import {
  getUserCollections,
  getCollectionDetails,
  createCollection,
  updateCollection,
  deleteCollection,
  addItemToCollection,
  removeItemFromCollection,
} from './routes/userCollections'

const app = express()
const port = process.env.PORT || 4000

app.use(helmet())

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4000',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(ao => origin.startsWith(ao))) {
      callback(null, true);
    } else {
      console.error(`Origin ${origin} not allowed by CORS`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// ============ AUTH ROUTES ============

// REGISTER
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten(),
      })
    }

    const { email, name, password } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
    })

    // Store refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    })

    logger.info(`User registered: ${email}`, { userId: user.id });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    logger.error('Register error:', { error });
    res.status(500).json({ success: false, error: 'Registration failed' })
  }
})

// LOGIN
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    const { email, password } = validation.data

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    // Verify password
    const isPasswordCorrect = await verifyPassword(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      email: user.email,
    })

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    })

    logger.info(`User logged in: ${email}`, { userId: user.id });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    logger.error('Login error:', { error });
    res.status(500).json({ success: false, error: 'Login failed' })
  }
})

// REFRESH TOKEN
app.post('/api/auth/refresh', async (req: Request, res: Response) => {
  try {
    const validation = refreshTokenSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid refresh token',
      })
    }

    const { refreshToken } = validation.data
    const payload = verifyRefreshToken(refreshToken)

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      })
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        refreshToken: true,
        createdAt: true,
      },
    })

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token mismatch',
      })
    }

    // Generate new tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
    })

    // Update refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    })

    logger.info(`Token refreshed for user: ${user.email}`, { userId: user.id });

    res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  } catch (error) {
    logger.error('Refresh error:', { error });
    res.status(500).json({ success: false, error: 'Token refresh failed' })
  }
})

// LOGOUT
app.post('/api/auth/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    })

    logger.info(`User logged out: ${req.user.email}`, { userId: req.user.id });

    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    logger.error('Logout error:', { error });
    res.status(500).json({ success: false, error: 'Logout failed' })
  }
})

// ============ PROTECTED ROUTES ============

// GET CURRENT USER
app.get('/api/auth/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    logger.error('Get user error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch user' })
  }
})

// ============ CONTENT ROUTES (Public) ============

// GET ALL CONTENT with optional filters
app.get('/api/content', async (req: Request, res: Response) => {
  try {
    const { type, section, platform } = req.query as {
      type?: string
      section?: string
      platform?: string
    }

    const whereClause: any = {}
    if (type) whereClause.type = type
    if (section) whereClause.section = section
    if (platform) whereClause.platform = platform

    const content = await prisma.content.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: 'desc' },
    })

    res.status(200).json({
      success: true,
      data: content,
    })
  } catch (error) {
    logger.error('Get content error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch content' })
  }
})

// GET FEATURED CONTENT (for hero section)
app.get('/api/content/featured', async (req: Request, res: Response) => {
  try {
    const featured = await prisma.content.findMany({
      where: { featured: true },
      take: 5,
    })

    res.status(200).json({
      success: true,
      data: featured,
    })
  } catch (error) {
    logger.error('Get featured error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch featured' })
  }
})

// GET EDITOR'S FAVORITES (public)
app.get('/api/content/editors-picks', async (req: Request, res: Response) => {
  try {
    const picks = await prisma.content.findMany({
      where: { editorsPick: true },
      include: { editorsPickCategory: true },
      orderBy: [{ editorsPickOrder: 'asc' }, { createdAt: 'desc' }],
    })

    res.status(200).json({
      success: true,
      data: picks,
    })
  } catch (error) {
    logger.error('Get editors picks error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch editors picks' })
  }
})

// GET CONTENT BY SECTION
app.get('/api/content/section/:sectionName', async (req: Request, res: Response) => {
  try {
    const { sectionName } = req.params as { sectionName: string }
    const { limit } = req.query as { limit?: string }

    const content = await prisma.content.findMany({
      where: { section: sectionName },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    res.status(200).json({
      success: true,
      data: content,
      section: sectionName,
    })
  } catch (error) {
    logger.error('Get section content error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch section' })
  }
})

// GET CONTENT BY GENRE
app.get('/api/content/genre/:genreName', async (req: Request, res: Response) => {
  try {
    const { genreName } = req.params as { genreName: string }
    const { limit } = req.query as { limit?: string }

    const content = await prisma.content.findMany({
      where: {
        genre: {
          contains: genreName,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    res.status(200).json({
      success: true,
      data: content,
      genre: genreName,
    })
  } catch (error) {
    logger.error('Get genre content error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch genre' })
  }
})

// SEARCH CONTENT
app.get('/api/content/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query as { q?: string }

    if (!q || q.trim() === '') {
      return res.status(200).json({
        success: true,
        data: [],
      })
    }

    const content = await prisma.content.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { genre: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { rating: 'desc' },
      take: 20,
    })

    res.status(200).json({
      success: true,
      data: content,
    })
  } catch (error) {
    logger.error('Search content error:', { error });
    res.status(500).json({ success: false, error: 'Failed to search content' })
  }
})

// GET RELATED CONTENT BY GROUP
app.get('/api/content/:id/related', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    const contentId = parseInt(id)

    if (isNaN(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      })
    }

    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: { group: true },
    })

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      })
    }

    if (!content.groupId) {
      return res.status(200).json({
        success: true,
        data: {
          group: null,
          items: [],
        },
      })
    }

    const items = await prisma.content.findMany({
      where: { groupId: content.groupId },
      orderBy: [{ groupOrder: 'asc' }, { releaseYear: 'asc' }, { createdAt: 'desc' }],
    })

    res.status(200).json({
      success: true,
      data: {
        group: content.group,
        items,
      },
    })
  } catch (error) {
    logger.error('Get related content error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch related content' })
  }
})

// GET SINGLE CONTENT BY ID
app.get('/api/content/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    const contentId = parseInt(id)

    if (isNaN(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      })
    }

    const content = await prisma.content.findUnique({
      where: { id: contentId },
    })

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      })
    }

    res.status(200).json({
      success: true,
      data: content,
    })
  } catch (error) {
    logger.error('Get content by ID error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch content' })
  }
})

// GET ALL SECTIONS (from Section model, ordered)
app.get('/api/sections', async (req: Request, res: Response) => {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { order: 'asc' },
    })

    res.status(200).json({
      success: true,
      data: sections,
    })
  } catch (error) {
    logger.error('Get sections error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch sections' })
  }
})

// GET ALL PLATFORMS (Public)
app.get('/api/platforms', async (req: Request, res: Response) => {
  try {
    const platforms = await prisma.platform.findMany({
      orderBy: { name: 'asc' },
    })

    res.status(200).json({
      success: true,
      data: platforms,
    })
  } catch (error) {
    logger.error('Get platforms error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch platforms' })
  }
})

// GET ALL GENRES (Public)
app.get('/api/genres', async (req: Request, res: Response) => {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: { name: 'asc' },
    })

    // Get all content genre strings to count occurrences
    const contents = await prisma.content.findMany({
      select: { genre: true }
    })

    const genresWithCount = genres.map(g => {
      const count = contents.filter(c => {
        if (!c.genre) return false
        return c.genre.toLowerCase().split(',').map(s => s.trim()).includes(g.name.toLowerCase())
      }).length

      return {
        ...g,
        _count: { content: count }
      }
    })

    res.status(200).json({
      success: true,
      data: genresWithCount,
    })
  } catch (error) {
    logger.error('Get genres error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch genres' })
  }
})

// ============ ADMIN ROUTES ============

// ADMIN REGISTER (Signup)
app.post('/api/admin/register', adminRegister)

// ADMIN LOGIN (Signin)
app.post('/api/admin/login', adminLogin)

// ADMIN LOGOUT (Protected)
app.post('/api/admin/logout', adminMiddleware, adminLogout)

// ADMIN CONTENT MANAGEMENT (Protected)

// GET ALL CONTENT (Admin view)
app.get('/api/admin/content', adminMiddleware, getAllContent)

// CREATE CONTENT
app.post('/api/admin/content', adminMiddleware, createContent)

// GET CONTENT BY ID
app.get('/api/admin/content/:id', adminMiddleware, getContentById)

// UPDATE CONTENT
app.put('/api/admin/content/:id', adminMiddleware, updateContent)

// DELETE SINGLE CONTENT
app.delete('/api/admin/content/:id', adminMiddleware, deleteContent)

// BULK DELETE CONTENT
app.delete('/api/admin/content', adminMiddleware, bulkDeleteContent)

// ADMIN STATS
app.get('/api/admin/stats', adminMiddleware, getAdminStats)

// ADMIN USER MANAGEMENT
app.get('/api/admin/users', adminMiddleware, getAllUsers)
app.delete('/api/admin/users/:id', adminMiddleware, deleteUser)

// ADMIN SECTION MANAGEMENT
app.get('/api/admin/sections', adminMiddleware, getAllSections)
app.post('/api/admin/sections', adminMiddleware, createSection)
app.put('/api/admin/sections/:id', adminMiddleware, updateSection)
app.delete('/api/admin/sections/:id', adminMiddleware, deleteSection)

// ADMIN GENRE MANAGEMENT
app.get('/api/admin/genres', adminMiddleware, getAllGenres)
app.post('/api/admin/genres', adminMiddleware, createGenre)
app.delete('/api/admin/genres/:id', adminMiddleware, deleteGenre)

// ADMIN PLATFORM MANAGEMENT
app.get('/api/admin/platforms', adminMiddleware, getAllPlatforms)
app.post('/api/admin/platforms', adminMiddleware, createPlatform)
app.delete('/api/admin/platforms/:id', adminMiddleware, deletePlatform)

// ADMIN EDITOR FAVORITES CATEGORY MANAGEMENT
app.get('/api/admin/editors-pick-categories', adminMiddleware, getEditorsPickCategories)
app.post('/api/admin/editors-pick-categories', adminMiddleware, createEditorsPickCategory)
app.delete('/api/admin/editors-pick-categories/:id', adminMiddleware, deleteEditorsPickCategory)

// ADMIN CONTENT GROUP MANAGEMENT
app.get('/api/admin/content-groups', adminMiddleware, getAllContentGroups)
app.post('/api/admin/content-groups', adminMiddleware, createContentGroup)

// ADMIN TMDB PROXY
app.get('/api/admin/tmdb/search', adminMiddleware, searchTMDB)
app.get('/api/admin/tmdb/trending', adminMiddleware, getTrendingTMDB)
app.get('/api/admin/tmdb/details/:type/:id', adminMiddleware, getTMDBDetails)
app.get('/api/admin/tmdb/discover', adminMiddleware, discoverTMDB)

// ADMIN OMDB PROXY
app.get('/api/admin/omdb/search', adminMiddleware, searchOMDBController)
app.get('/api/admin/omdb/details/:type/:title', adminMiddleware, getOMDBDetails)

// ============ REVIEWS & METER ROUTES (Protected - require auth) ============

// REVIEWS
app.get('/api/content/:id/reviews', getReviews)
app.post('/api/content/:id/reviews', authMiddleware, createReview)
app.delete('/api/content/:id/reviews/:reviewId', authMiddleware, deleteReview)
app.post('/api/content/:id/reviews/:reviewId/like', authMiddleware, toggleReviewLike)

// CINENOVA METER
app.get('/api/content/:id/meter', getMeterVotes)
app.post('/api/content/:id/meter', authMiddleware, submitMeterVote)

// USER INTERACTIONS
app.get('/api/content/:id/interactions', authMiddleware, getContentInteractions)
app.post('/api/content/:id/watched', authMiddleware, toggleWatched)
app.post('/api/content/:id/collection', authMiddleware, toggleCollection)
app.get('/api/user/watched', authMiddleware, getWatchedList)
app.get('/api/user/collection', authMiddleware, getCollectionList)

// CUSTOM USER COLLECTIONS
app.get('/api/user/custom-collections', authMiddleware, getUserCollections)
app.get('/api/user/custom-collections/:id', authMiddleware, getCollectionDetails)
app.post('/api/user/custom-collections', authMiddleware, createCollection)
app.put('/api/user/custom-collections/:id', authMiddleware, updateCollection)
app.delete('/api/user/custom-collections/:id', authMiddleware, deleteCollection)
app.post('/api/user/custom-collections/:id/items', authMiddleware, addItemToCollection)
app.delete('/api/user/custom-collections/:id/items/:contentId', authMiddleware, removeItemFromCollection)

// REPORT REVIEW
app.post('/api/content/:id/reviews/:reviewId/report', authMiddleware, reportReview)

// ADMIN REPORTED REVIEWS
app.get('/api/admin/reports', adminMiddleware, getReportedReviews)
app.post('/api/admin/reports/:id/dismiss', adminMiddleware, dismissReportedReview)
app.post('/api/admin/reports/:id/delete', adminMiddleware, deleteReportedReviewContent)

// ============ COMMUNITY ROUTES ============

// PUBLIC
app.get('/api/communities', getCommunities)
app.get('/api/communities/:id/messages', getCommunityMessages)

// AUTHENTICATED
app.post('/api/communities/:id/messages', authMiddleware, postMessage)

// ADMIN
app.post('/api/admin/communities', adminMiddleware, createCommunity)
app.put('/api/admin/communities/:id', adminMiddleware, updateCommunity)
app.delete('/api/admin/communities/:id', adminMiddleware, deleteCommunity)

app.listen(port, async () => {
  logger.info(`🚀 Server is running at http://localhost:${port}`)
  
  try {
    // Test database connection on startup
    await prisma.$queryRaw`SELECT 1`
    logger.info('✅ Database connection verified')
  } catch (err) {
    logger.error('❌ Database connection failed:', { error: err })
  }
})

