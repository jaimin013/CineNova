import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
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
  searchTMDB,
  getTrendingTMDB,
  getTMDBDetails,
} from './routes/admin'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(helmet())
app.use(cors())
app.use(express.json())

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

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Register error:', error)
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

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Login error:', error)
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

    res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  } catch (error) {
    console.error('Refresh error:', error)
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

    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
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
      },
    })

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Get user error:', error)
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
    console.error('Get content error:', error)
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
    console.error('Get featured error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch featured' })
  }
})

// GET CONTENT BY SECTION
app.get('/api/content/section/:sectionName', async (req: Request, res: Response) => {
  try {
    const { sectionName } = req.params as { sectionName: string }

    const content = await prisma.content.findMany({
      where: { section: sectionName },
      orderBy: { createdAt: 'desc' },
    })

    res.status(200).json({
      success: true,
      data: content,
      section: sectionName,
    })
  } catch (error) {
    console.error('Get section content error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch section' })
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
    console.error('Get content by ID error:', error)
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
    console.error('Get sections error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch sections' })
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

// ADMIN TMDB PROXY
app.get('/api/admin/tmdb/search', adminMiddleware, searchTMDB)
app.get('/api/admin/tmdb/trending', adminMiddleware, getTrendingTMDB)
app.get('/api/admin/tmdb/details/:type/:id', adminMiddleware, getTMDBDetails)

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`)
  console.log('✅ Database connected via Prisma')
})
