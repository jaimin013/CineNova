import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { generateTokens, verifyRefreshToken } from '../utils/jwt'
import { hashPassword, verifyPassword } from '../utils/password'
import { z } from 'zod'
import { fetchFromTMDB, mapTMDBToContent } from '../utils/tmdb'

// ============ TMDB PIPELINE ============

export const searchTMDB = async (req: Request, res: Response) => {
  try {
    const { query, type = 'multi' } = req.query as { query: string, type: string }
    if (!query) return res.status(400).json({ success: false, error: 'Search query is required' })

    const endpoint = type === 'multi' ? '/search/multi' : (type === 'movie' ? '/search/movie' : '/search/tv')
    const data = await fetchFromTMDB(endpoint, { query })
    
    const results = data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv' || type !== 'multi')
      .map((item: any) => mapTMDBToContent(item, item.media_type || (type as 'movie' | 'tv')))

    res.status(200).json({ success: true, data: results })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export const getTrendingTMDB = async (req: Request, res: Response) => {
  try {
    const { type = 'movie' } = req.query as { type: string }
    const endpoint = `/trending/${type}/day`
    const data = await fetchFromTMDB(endpoint)
    
    const results = data.results.map((item: any) => mapTMDBToContent(item, type as 'movie' | 'tv'))
    res.status(200).json({ success: true, data: results })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

export const getTMDBDetails = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.params as { id: string, type: string }
    const endpoint = `/${type === 'series' ? 'tv' : 'movie'}/${id}`
    const data = await fetchFromTMDB(endpoint, { append_to_response: 'credits' })
    
    const mapped = mapTMDBToContent(data, type === 'series' ? 'tv' : 'movie')
    res.status(200).json({ success: true, data: mapped })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

// Validation schemas
const adminRegisterSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

const contentSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().min(10, 'Description too short'),
  type: z.enum(['movie', 'series']),
  posterUrl: z.string().url('Invalid poster URL'),
  backdropUrl: z.string().url('Invalid backdrop URL').optional(),
  rating: z.number().min(0).max(10).optional(),
  genre: z.string().min(1, 'Genre required'),
  releaseYear: z.number().int().optional(),
  duration: z.number().int().optional(),
  section: z.string().min(1, 'Section required'),
  platform: z.string().optional(),
  featured: z.boolean().optional(),
  videoUrl: z.string().url('Invalid video URL').optional().or(z.literal('')),
  casts: z.string().optional(),
})

// ============ ADMIN AUTH ROUTES ============

export const adminRegister = async (req: Request, res: Response) => {
  try {
    const validation = adminRegisterSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten(),
      })
    }

    const { email, name, password } = validation.data

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({ where: { email } })
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        error: 'Admin email already registered',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: admin.id,
      email: admin.email,
      role: 'admin',
    })

    // Store refresh token
    await prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken },
    })

    res.status(201).json({
      success: true,
      message: 'Admin registration successful',
      admin,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Admin register error:', error)
    res.status(500).json({ success: false, error: 'Registration failed' })
  }
}

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const validation = adminLoginSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    const { email, password } = validation.data

    // Find admin by email
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    // Verify password
    const isPasswordCorrect = await verifyPassword(password, admin.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: admin.id,
      email: admin.email,
      role: 'admin',
    })

    // Store refresh token
    await prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken },
    })

    res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ success: false, error: 'Login failed' })
  }
}

export const adminLogout = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).admin?.id

    if (!adminId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    await prisma.admin.update({
      where: { id: adminId },
      data: { refreshToken: null },
    })

    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Admin logout error:', error)
    res.status(500).json({ success: false, error: 'Logout failed' })
  }
}

// ============ ADMIN CONTENT CRUD ============

// CREATE
export const createContent = async (req: Request, res: Response) => {
  try {
    const validation = contentSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten(),
      })
    }

    const content = await prisma.content.create({
      data: validation.data,
    })

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content,
    })
  } catch (error) {
    console.error('Create content error:', error)
    res.status(500).json({ success: false, error: 'Failed to create content' })
  }
}

// READ ALL
export const getAllContent = async (req: Request, res: Response) => {
  try {
    const { section, platform, type, featured } = req.query as {
      section?: string
      platform?: string
      type?: string
      featured?: string
    }

    const whereClause: any = {}
    if (section) whereClause.section = section
    if (platform) whereClause.platform = platform
    if (type) whereClause.type = type
    if (featured === 'true') whereClause.featured = true
    if (featured === 'false') whereClause.featured = false

    const content = await prisma.content.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: 'desc' },
    })

    res.status(200).json({
      success: true,
      data: content,
      total: content.length,
    })
  } catch (error) {
    console.error('Get all content error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch content' })
  }
}

// READ SINGLE
export const getContentById = async (req: Request, res: Response) => {
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
}

// UPDATE
export const updateContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    const contentId = parseInt(id)

    if (isNaN(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      })
    }

    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id: contentId },
    })

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      })
    }

    const validation = contentSchema.partial().safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten(),
      })
    }

    const content = await prisma.content.update({
      where: { id: contentId },
      data: validation.data,
    })

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content,
    })
  } catch (error) {
    console.error('Update content error:', error)
    res.status(500).json({ success: false, error: 'Failed to update content' })
  }
}

// DELETE
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    const contentId = parseInt(id)

    if (isNaN(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      })
    }

    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id: contentId },
    })

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      })
    }

    await prisma.content.delete({
      where: { id: contentId },
    })

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    })
  } catch (error) {
    console.error('Delete content error:', error)
    res.status(500).json({ success: false, error: 'Failed to delete content' })
  }
}

// BULK DELETE
export const bulkDeleteContent = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No IDs provided',
      })
    }

    const result = await prisma.content.deleteMany({
      where: {
        id: { in: ids },
      },
    })

    res.status(200).json({
      success: true,
      message: `Deleted ${result.count} items`,
      deletedCount: result.count,
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    res.status(500).json({ success: false, error: 'Failed to delete content' })
  }
}

// ============ ADMIN STATS & USER MANAGEMENT ============

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalContent, featuredContent, moviesCount, seriesCount] = await Promise.all([
      prisma.user.count(),
      prisma.content.count(),
      prisma.content.count({ where: { featured: true } }),
      prisma.content.count({ where: { type: 'movie' } }),
      prisma.content.count({ where: { type: 'series' } }),
    ])

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalContent,
        featuredContent,
        moviesCount,
        seriesCount,
      },
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch stats' })
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch users' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
      })
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ success: false, error: 'Failed to delete user' })
  }
}

// ============ SECTION MANAGEMENT ============

export const getAllSections = async (req: Request, res: Response) => {
  try {
    const sections = await prisma.section.findMany({ orderBy: { order: 'asc' } })
    res.status(200).json({ success: true, data: sections })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch sections' })
  }
}

export const createSection = async (req: Request, res: Response) => {
  try {
    const { name, order } = req.body
    const section = await prisma.section.create({ 
      data: { 
        name, 
        order: order !== undefined ? parseInt(order) : 0 
      } 
    })
    res.status(201).json({ success: true, data: section })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create section' })
  }
}

export const updateSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, order } = req.body
    const section = await prisma.section.update({
      where: { id: parseInt(id) },
      data: { 
        name, 
        order: order !== undefined ? parseInt(order) : undefined 
      }
    })
    res.status(200).json({ success: true, data: section })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update section' })
  }
}

export const deleteSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.section.delete({ where: { id: parseInt(id) } })
    res.status(200).json({ success: true, message: 'Section deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete section' })
  }
}

// ============ GENRE MANAGEMENT ============

export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prisma.genre.findMany({ orderBy: { name: 'asc' } })
    res.status(200).json({ success: true, data: genres })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch genres' })
  }
}

export const createGenre = async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    const genre = await prisma.genre.create({ data: { name } })
    res.status(201).json({ success: true, data: genre })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create genre' })
  }
}

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.genre.delete({ where: { id: parseInt(id) } })
    res.status(200).json({ success: true, message: 'Genre deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete genre' })
  }
}

// ============ PLATFORM MANAGEMENT ============

export const getAllPlatforms = async (req: Request, res: Response) => {
  try {
    const platforms = await prisma.platform.findMany({ orderBy: { name: 'asc' } })
    res.status(200).json({ success: true, data: platforms })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch platforms' })
  }
}

export const createPlatform = async (req: Request, res: Response) => {
  try {
    const { name, imageUrl } = req.body
    const platform = await prisma.platform.create({ 
      data: { name, imageUrl } 
    })
    res.status(201).json({ success: true, data: platform })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create platform' })
  }
}

export const deletePlatform = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.platform.delete({ where: { id: parseInt(id) } })
    res.status(200).json({ success: true, message: 'Platform deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete platform' })
  }
}
