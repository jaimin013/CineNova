import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { z } from 'zod'
import logger from '../utils/logger'

const METER_TYPES = ['Skip', 'Timepass', 'Go for it', 'Perfection'] as const

const createReviewSchema = z.object({
  text: z.string().min(1, 'Review text is required').max(1000, 'Review too long'),
  voteType: z.enum(METER_TYPES),
})

const createMeterSchema = z.object({
  voteType: z.enum(METER_TYPES),
})

// ============ REVIEWS ============

// GET all reviews for a content item (public)
export const getReviews = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const contentId = parseInt(id)
    if (isNaN(contentId)) {
      return res.status(400).json({ success: false, error: 'Invalid content ID' })
    }

    // Get current user ID if logged in (for like status)
    let currentUserId: number | null = null
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const { verifyAccessToken } = await import('../utils/jwt.js')
        const payload = verifyAccessToken(authHeader.substring(7))
        if (payload) currentUserId = payload.id
      } catch {}
    }

    const reviews = await prisma.review.findMany({
      where: { contentId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true },
        },
        likesList: {
          where: currentUserId ? { userId: currentUserId } : { userId: 0 },
          select: { id: true },
        },
        _count: {
          select: { likesList: true },
        },
      },
    })

    const formatted = reviews.map((r) => ({
      id: r.id,
      author: r.user.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.user.name)}`,
      text: r.text,
      date: getRelativeTime(r.createdAt),
      likes: r._count.likesList,
      comments: 0,
      voteType: r.voteType as 'Skip' | 'Timepass' | 'Go for it' | 'Perfection',
      isLikedByMe: r.likesList.length > 0,
      userId: r.user.id,
    }))

    res.status(200).json({ success: true, data: formatted })
  } catch (error) {
    logger.error('Get reviews error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' })
  }
}

// CREATE a review (authenticated)
export const createReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const contentId = parseInt(id)
    if (isNaN(contentId)) {
      return res.status(400).json({ success: false, error: 'Invalid content ID' })
    }

    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const validation = createReviewSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten(),
      })
    }

    const { text, voteType } = validation.data

    // Check content exists
    const content = await prisma.content.findUnique({ where: { id: contentId } })
    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found' })
    }

    // Create review AND upsert meter vote in a transaction
    const [review] = await prisma.$transaction([
      prisma.review.create({
        data: {
          contentId,
          userId: req.user.id,
          text,
          voteType,
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      }),
      // Also upsert a MeterVote so the meter updates when posting a review
      prisma.meterVote.upsert({
        where: { contentId_userId: { contentId, userId: req.user.id } },
        update: { voteType },
        create: { contentId, userId: req.user.id, voteType },
      }),
    ])

    logger.info(`New review created by user ${req.user.id} for content ${contentId}`, { userId: req.user.id, contentId, reviewId: review.id });
    res.status(201).json({
      success: true,
      data: {
        id: review.id,
        author: review.user.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(review.user.name)}`,
        text: review.text,
        date: 'Just now',
        likes: 0,
        comments: 0,
        voteType: review.voteType as 'Skip' | 'Timepass' | 'Go for it' | 'Perfection',
        isLikedByMe: false,
        userId: review.user.id,
      },
    })
  } catch (error) {
    logger.error('Create review error:', { error });
    res.status(500).json({ success: false, error: 'Failed to create review' })
  }
}

// DELETE a review (authenticated - own review only)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId as string
    const reviewIdNum = parseInt(reviewId)
    if (isNaN(reviewIdNum)) {
      return res.status(400).json({ success: false, error: 'Invalid review ID' })
    }

    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const review = await prisma.review.findUnique({ where: { id: reviewIdNum } })
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' })
    }
    if (review.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not your review' })
    }

    // Delete review AND remove meter vote in a transaction
    await prisma.$transaction([
      // Delete the review (cascades to ReviewLike, ReportedReview)
      prisma.review.delete({ where: { id: reviewIdNum } }),
      // Also remove the user's meter vote for this content
      prisma.meterVote.deleteMany({
        where: { contentId: review.contentId, userId: req.user.id },
      }),
    ])

    logger.info(`Review deleted by user ${req.user.id}`, { userId: req.user.id, reviewId: reviewIdNum });
    res.status(200).json({ success: true, message: 'Review deleted' })
  } catch (error) {
    logger.error('Delete review error:', { error });
    res.status(500).json({ success: false, error: 'Failed to delete review' })
  }
}

// TOGGLE LIKE on a review (authenticated)
export const toggleReviewLike = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId as string
    const reviewIdNum = parseInt(reviewId)
    if (isNaN(reviewIdNum)) {
      return res.status(400).json({ success: false, error: 'Invalid review ID' })
    }

    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    // Check review exists
    const review = await prisma.review.findUnique({ where: { id: reviewIdNum } })
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' })
    }

    // Check if already liked
    const existingLike = await prisma.reviewLike.findUnique({
      where: { reviewId_userId: { reviewId: reviewIdNum, userId: req.user.id } },
    })

    if (existingLike) {
      // Unlike
      await prisma.reviewLike.delete({ where: { id: existingLike.id } })
      await prisma.review.update({
        where: { id: reviewIdNum },
        data: { likes: { decrement: 1 } },
      })
      logger.info(`User ${req.user.id} unliked review ${reviewIdNum}`, { userId: req.user.id, reviewId: reviewIdNum });
      res.status(200).json({ success: true, liked: false })
    } else {
      // Like
      await prisma.reviewLike.create({
        data: { reviewId: reviewIdNum, userId: req.user.id },
      })
      await prisma.review.update({
        where: { id: reviewIdNum },
        data: { likes: { increment: 1 } },
      })
      logger.info(`User ${req.user.id} liked review ${reviewIdNum}`, { userId: req.user.id, reviewId: reviewIdNum });
      res.status(200).json({ success: true, liked: true })
    }
  } catch (error) {
    logger.error('Toggle like error:', { error });
    res.status(500).json({ success: false, error: 'Failed to toggle like' })
  }
}

// ============ CINENOVA METER ============

// GET meter vote counts for a content item (public)
export const getMeterVotes = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const contentId = parseInt(id)
    if (isNaN(contentId)) {
      return res.status(400).json({ success: false, error: 'Invalid content ID' })
    }

    // Get vote counts per type
    const votes = await prisma.meterVote.groupBy({
      by: ['voteType'],
      where: { contentId },
      _count: { id: true },
    })

    // Also get current user's vote if authenticated
    let userVote: string | null = null
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const { verifyAccessToken } = await import('../utils/jwt.js')
        const payload = verifyAccessToken(authHeader.substring(7))
        if (payload) {
          const userMeterVote = await prisma.meterVote.findUnique({
            where: { contentId_userId: { contentId, userId: payload.id } },
          })
          if (userMeterVote) userVote = userMeterVote.voteType
        }
      } catch {}
    }

    // Build full response with all 4 types
    const voteMap: Record<string, number> = {
      Skip: 0,
      Timepass: 0,
      'Go for it': 0,
      Perfection: 0,
    }
    votes.forEach((v) => {
      voteMap[v.voteType] = v._count.id
    })

    const total = Object.values(voteMap).reduce((a, b) => a + b, 0)

    res.status(200).json({
      success: true,
      data: {
        votes: voteMap,
        total,
        userVote,
      },
    })
  } catch (error) {
    logger.error('Get meter votes error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch meter votes' })
  }
}

// SUBMIT / change meter vote (authenticated)
export const submitMeterVote = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const contentId = parseInt(id)
    if (isNaN(contentId)) {
      return res.status(400).json({ success: false, error: 'Invalid content ID' })
    }

    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const validation = createMeterSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote type',
        details: validation.error.flatten(),
      })
    }

    const { voteType } = validation.data

    // Check content exists
    const content = await prisma.content.findUnique({ where: { id: contentId } })
    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found' })
    }

    // Upsert: if user already voted, update their vote
    const existing = await prisma.meterVote.findUnique({
      where: { contentId_userId: { contentId, userId: req.user.id } },
    })

    if (existing) {
      if (existing.voteType === voteType) {
        // Same vote — remove it (unvote)
        await prisma.meterVote.delete({ where: { id: existing.id } })
        logger.info(`User ${req.user.id} removed meter vote for content ${contentId}`, { userId: req.user.id, contentId });
        return res.status(200).json({ success: true, action: 'removed', voteType: null })
      }
      // Different vote — update
      await prisma.meterVote.update({
        where: { id: existing.id },
        data: { voteType },
      })
      logger.info(`User ${req.user.id} changed meter vote for content ${contentId} to ${voteType}`, { userId: req.user.id, contentId, voteType });
      return res.status(200).json({ success: true, action: 'changed', voteType })
    }

    // New vote
    await prisma.meterVote.create({
      data: { contentId, userId: req.user.id, voteType },
    })

    logger.info(`User ${req.user.id} added meter vote for content ${contentId}: ${voteType}`, { userId: req.user.id, contentId, voteType });
    res.status(201).json({ success: true, action: 'added', voteType })
  } catch (error) {
    logger.error('Submit meter vote error:', { error });
    res.status(500).json({ success: false, error: 'Failed to submit vote' })
  }
}

// ============ REPORT REVIEW ============

// REPORT a review (authenticated)
export const reportReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.reviewId as string
    const reviewIdNum = parseInt(reviewId)
    if (isNaN(reviewIdNum)) {
      return res.status(400).json({ success: false, error: 'Invalid review ID' })
    }

    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const { reason } = req.body
    if (!reason || typeof reason !== 'string' || reason.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Reason must be at least 3 characters' })
    }

    // Check review exists
    const review = await prisma.review.findUnique({ where: { id: reviewIdNum } })
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' })
    }

    // Can't report your own review
    if (review.userId === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot report your own review' })
    }

    // Check if already reported by this user
    const existing = await prisma.reportedReview.findUnique({
      where: { reviewId_reportedByUserId: { reviewId: reviewIdNum, reportedByUserId: req.user.id } },
    })
    if (existing) {
      return res.status(409).json({ success: false, error: 'You already reported this review' })
    }

    await prisma.reportedReview.create({
      data: {
        reviewId: reviewIdNum,
        reportedByUserId: req.user.id,
        reason: reason.trim(),
      },
    })

    logger.info(`Review ${reviewIdNum} reported by user ${req.user.id}`, { userId: req.user.id, reviewId: reviewIdNum, reason });
    res.status(201).json({ success: true, message: 'Review reported successfully' })
  } catch (error) {
    logger.error('Report review error:', { error });
    res.status(500).json({ success: false, error: 'Failed to report review' })
  }
}

// ============ HELPERS ============

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)

  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}