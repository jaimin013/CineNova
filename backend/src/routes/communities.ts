import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { z } from 'zod'
import logger from '../utils/logger'

// Validation schemas
const communitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description is too short'),
  imageUrl: z.string().url('Invalid image URL').optional(),
})

const clubMessageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty'),
})

// ============ PUBLIC ROUTES ============

export const getCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await prisma.community.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    })

    res.status(200).json({
      success: true,
      data: communities,
    })
  } catch (error) {
    logger.error('Get communities error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch communities' })
  }
}

export const getCommunityMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const communityId = parseInt(id as string)

    if (isNaN(communityId)) {
      return res.status(400).json({ success: false, error: 'Invalid community ID' })
    }

    const messages = await prisma.clubMessage.findMany({
      where: { communityId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    })

    res.status(200).json({
      success: true,
      data: messages,
    })
  } catch (error) {
    logger.error('Get messages error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch messages' })
  }
}

// ============ AUTHENTICATED ROUTES ============

export const postMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const communityId = parseInt(id as string)
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    if (isNaN(communityId)) {
      return res.status(400).json({ success: false, error: 'Invalid community ID' })
    }

    const validation = clubMessageSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.flatten(),
      })
    }

    const message = await prisma.clubMessage.create({
      data: {
        communityId,
        userId,
        text: validation.data.text,
      },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    })

    logger.info(`New message posted in community ${communityId}`, { userId, communityId, messageId: message.id });
    res.status(201).json({
      success: true,
      data: message,
    })
  } catch (error) {
    logger.error('Post message error:', { error });
    res.status(500).json({ success: false, error: 'Failed to post message' })
  }
}

// ============ ADMIN ROUTES ============

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const validation = communitySchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten(),
      })
    }

    const community = await prisma.community.create({
      data: validation.data,
    })

    logger.info(`Community created: ${community.name}`, { communityId: community.id });
    res.status(201).json({
      success: true,
      message: 'Community created successfully',
      data: community,
    })
  } catch (error) {
    logger.error('Create community error:', { error });
    res.status(500).json({ success: false, error: 'Failed to create community' })
  }
}

export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const communityId = parseInt(id as string)

    if (isNaN(communityId)) {
      return res.status(400).json({ success: false, error: 'Invalid community ID' })
    }

    const validation = communitySchema.partial().safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten(),
      })
    }

    const community = await prisma.community.update({
      where: { id: communityId },
      data: validation.data,
    })

    logger.info(`Community updated: ${community.name}`, { communityId });
    res.status(200).json({
      success: true,
      message: 'Community updated successfully',
      data: community,
    })
  } catch (error) {
    logger.error('Update community error:', { error });
    res.status(500).json({ success: false, error: 'Failed to update community' })
  }
}

export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const communityId = parseInt(id as string)

    if (isNaN(communityId)) {
      return res.status(400).json({ success: false, error: 'Invalid community ID' })
    }

    await prisma.community.delete({
      where: { id: communityId },
    })

    logger.info(`Community deleted`, { communityId });
    res.status(200).json({
      success: true,
      message: 'Community deleted successfully',
    })
  } catch (error) {
    logger.error('Delete community error:', { error });
    res.status(500).json({ success: false, error: 'Failed to delete community' })
  }
}
