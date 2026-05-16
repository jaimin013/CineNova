import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { z } from 'zod'
import logger from '../utils/logger'

const createCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
})

const updateCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
})

// GET all custom collections for user
export const getUserCollections = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' })

    const collections = await prisma.userCollection.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: { items: true }
        },
        items: {
          take: 4,
          include: {
            content: {
              select: {
                posterUrl: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    res.status(200).json({ success: true, data: collections })
  } catch (error) {
    logger.error('Get user collections error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch collections' })
  }
}

// GET single custom collection with items
export const getCollectionDetails = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' })
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' })

    const collection = await prisma.userCollection.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            content: true
          }
        }
      }
    })

    if (!collection) return res.status(404).json({ success: false, error: 'Collection not found' })
    if (collection.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Forbidden' })

    res.status(200).json({ success: true, data: collection })
  } catch (error) {
    logger.error('Get collection details error:', { error });
    res.status(500).json({ success: false, error: 'Failed to fetch collection details' })
  }
}

// CREATE new collection
export const createCollection = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' })

    const validation = createCollectionSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message })
    }

    const { name, description } = validation.data

    const collection = await prisma.userCollection.create({
      data: {
        name,
        description,
        userId: req.user.id
      }
    })

    logger.info(`User ${req.user.id} created new collection: ${name}`, { userId: req.user.id, collectionId: collection.id });
    res.status(201).json({ success: true, data: collection })
  } catch (error) {
    logger.error('Create collection error:', { error });
    res.status(500).json({ success: false, error: 'Failed to create collection' })
  }
}

// UPDATE collection
export const updateCollection = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' })
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' })

    const validation = updateCollectionSchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.errors[0].message })
    }

    const collection = await prisma.userCollection.findUnique({ where: { id } })
    if (!collection) return res.status(404).json({ success: false, error: 'Collection not found' })
    if (collection.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Forbidden' })

    const updated = await prisma.userCollection.update({
      where: { id },
      data: validation.data
    })

    logger.info(`User ${req.user.id} updated collection ${id}`, { userId: req.user.id, collectionId: id });
    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    logger.error('Update collection error:', { error });
    res.status(500).json({ success: false, error: 'Failed to update collection' })
  }
}

// DELETE collection
export const deleteCollection = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' })
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' })

    const collection = await prisma.userCollection.findUnique({ where: { id } })
    if (!collection) return res.status(404).json({ success: false, error: 'Collection not found' })
    if (collection.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Forbidden' })

    await prisma.userCollection.delete({ where: { id } })

    logger.info(`User ${req.user.id} deleted collection ${id}`, { userId: req.user.id, collectionId: id });
    res.status(200).json({ success: true, message: 'Collection deleted' })
  } catch (error) {
    logger.error('Delete collection error:', { error });
    res.status(500).json({ success: false, error: 'Failed to delete collection' })
  }
}

// ADD item to collection
export const addItemToCollection = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' })
    const collectionId = parseInt(req.params.id as string)
    const { contentId } = req.body

    if (isNaN(collectionId) || !contentId) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' })
    }

    const collection = await prisma.userCollection.findUnique({ where: { id: collectionId } })
    if (!collection) return res.status(404).json({ success: false, error: 'Collection not found' })
    if (collection.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Forbidden' })

    const item = await prisma.userCollectionItem.upsert({
      where: {
        collectionId_contentId: {
          collectionId,
          contentId
        }
      },
      update: {},
      create: {
        collectionId,
        contentId
      }
    })

    logger.info(`User ${req.user.id} added content ${contentId} to collection ${collectionId}`, { userId: req.user.id, collectionId, contentId });
    res.status(201).json({ success: true, data: item })
  } catch (error) {
    logger.error('Add item error:', { error });
    res.status(500).json({ success: false, error: 'Failed to add item to collection' })
  }
}

// REMOVE item from collection
export const removeItemFromCollection = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' })
    const collectionId = parseInt(req.params.id as string)
    const contentId = parseInt(req.params.contentId as string)

    if (isNaN(collectionId) || isNaN(contentId)) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' })
    }

    const collection = await prisma.userCollection.findUnique({ where: { id: collectionId } })
    if (!collection) return res.status(404).json({ success: false, error: 'Collection not found' })
    if (collection.userId !== req.user.id) return res.status(403).json({ success: false, error: 'Forbidden' })

    await prisma.userCollectionItem.delete({
      where: {
        collectionId_contentId: {
          collectionId,
          contentId
        }
      }
    })

    logger.info(`User ${req.user.id} removed content ${contentId} from collection ${collectionId}`, { userId: req.user.id, collectionId, contentId });
    res.status(200).json({ success: true, message: 'Item removed from collection' })
  } catch (error) {
    logger.error('Remove item error:', { error });
    res.status(500).json({ success: false, error: 'Failed to remove item from collection' })
  }
}
