import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import logger from '../utils/logger'

export const toggleWatched = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const contentId = parseInt(req.params.id as string)

    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })
    if (isNaN(contentId)) return res.status(400).json({ success: false, error: 'Invalid content ID' })

    const existing = await prisma.watched.findUnique({
      where: {
        userId_contentId: { userId, contentId }
      }
    })

    if (existing) {
      await prisma.watched.delete({
        where: { id: existing.id }
      })
      logger.info(`User ${userId} unmarked content ${contentId} as watched`, { userId, contentId });
      return res.status(200).json({ success: true, watched: false })
    } else {
      await prisma.watched.create({
        data: { userId, contentId }
      })
      logger.info(`User ${userId} marked content ${contentId} as watched`, { userId, contentId });
      return res.status(200).json({ success: true, watched: true })
    }
  } catch (error) {
    logger.error('Toggle watched error:', { error });
    res.status(500).json({ success: false, error: 'Failed to toggle watched status' })
  }
}

export const toggleCollection = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const contentId = parseInt(req.params.id as string)

    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })
    if (isNaN(contentId)) return res.status(400).json({ success: false, error: 'Invalid content ID' })

    const existing = await prisma.collection.findUnique({
      where: {
        userId_contentId: { userId, contentId }
      }
    })

    if (existing) {
      await prisma.collection.delete({
        where: { id: existing.id }
      })
      logger.info(`User ${userId} removed content ${contentId} from collection`, { userId, contentId });
      return res.status(200).json({ success: true, collected: false })
    } else {
      await prisma.collection.create({
        data: { userId, contentId }
      })
      logger.info(`User ${userId} added content ${contentId} to collection`, { userId, contentId });
      return res.status(200).json({ success: true, collected: true })
    }
  } catch (error) {
    logger.error('Toggle collection error:', { error });
    res.status(500).json({ success: false, error: 'Failed to toggle collection status' })
  }
}

export const getContentInteractions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const contentId = parseInt(req.params.id as string)

    if (!userId) {
      return res.status(200).json({ 
        success: true, 
        data: { watched: false, collected: false } 
      })
    }

    if (isNaN(contentId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid content ID' 
      })
    }

    const watched = await prisma.watched.findUnique({
      where: { userId_contentId: { userId, contentId } }
    })

    const collected = await prisma.collection.findUnique({
      where: { userId_contentId: { userId, contentId } }
    })

    res.status(200).json({
      success: true,
      data: {
        watched: !!watched,
        collected: !!collected
      }
    })
  } catch (error) {
    logger.error('Get interactions error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch interactions' })
  }
}

export const getWatchedList = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

    const watchedItems = await prisma.watched.findMany({
      where: { userId },
      include: {
        content: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.status(200).json({
      success: true,
      data: watchedItems.map(item => item.content)
    })
  } catch (error) {
    logger.error('Get watched list error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch watched history' })
  }
}

export const getCollectionList = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

    const collectedItems = await prisma.collection.findMany({
      where: { userId },
      include: {
        content: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.status(200).json({
      success: true,
      data: collectedItems.map(item => item.content)
    })
  } catch (error) {
    logger.error('Get collection list error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch collection' })
  }
}
