import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function restore() {
  console.log('🔄 Starting robust database restoration...')

  const backupPath = path.join(__dirname, '../db-backup.json')
  if (!fs.existsSync(backupPath)) {
    console.error('❌ Backup file not found!')
    return
  }

  const data = JSON.parse(fs.readFileSync(backupPath, 'utf-8'))

  try {
    // Helper to safely create many
    const safeCreateMany = async (model: any, items: any[], name: string) => {
      if (items && items.length > 0) {
        try {
          await (prisma as any)[model].createMany({ data: items, skipDuplicates: true })
          console.log(`✅ Restored ${items.length} ${name}`)
        } catch (err) {
          console.warn(`⚠️ Partial or failed restore for ${name}:`, (err as any).message)
        }
      }
    }

    // 1. Core independent tables
    await safeCreateMany('admin', data.admins, 'admins')
    await safeCreateMany('user', data.users, 'users')
    await safeCreateMany('section', data.sections, 'sections')
    await safeCreateMany('genre', data.genres, 'genres')
    await safeCreateMany('platform', data.platforms, 'platforms')
    
    // 2. Reference tables
    const contentGroups = data.contentGroups || data.contentGroup || []
    await safeCreateMany('contentGroup', contentGroups, 'content groups')
    
    await safeCreateMany('editorsPickCategory', data.editorsPickCategories, 'editor favorite categories')

    // 3. Content (Sanitize references)
    if (data.content?.length > 0) {
      console.log('📦 Sanitizing content references...')
      
      // Get existing IDs for foreign keys
      const existingGroupIds = new Set((await prisma.contentGroup.findMany({ select: { id: true } })).map(g => g.id))
      const existingCategoryIds = new Set((await prisma.editorsPickCategory.findMany({ select: { id: true } })).map(c => c.id))

      const sanitizedContent = data.content.map((item: any) => {
        const newItem = { ...item }
        if (newItem.groupId && !existingGroupIds.has(newItem.groupId)) {
          newItem.groupId = null
        }
        if (newItem.editorsPickCategoryId && !existingCategoryIds.has(newItem.editorsPickCategoryId)) {
          newItem.editorsPickCategoryId = null
        }
        return newItem
      })

      await prisma.content.createMany({ data: sanitizedContent, skipDuplicates: true })
      console.log(`✅ Restored ${sanitizedContent.length} content items`)
    }

    // 4. Activity tables (Sanitize references)
    const existingContentIds = new Set((await prisma.content.findMany({ select: { id: true } })).map(c => c.id))
    const existingUserIds = new Set((await prisma.user.findMany({ select: { id: true } })).map(u => u.id))

    const filterValid = (items: any[], contentKey = 'contentId', userKey = 'userId') => {
      return (items || []).filter(item => 
        existingContentIds.has(item[contentKey]) && 
        (!userKey || existingUserIds.has(item[userKey]))
      )
    }

    if (data.reviews) {
      const validReviews = filterValid(data.reviews)
      await safeCreateMany('review', validReviews, 'reviews')
    }

    if (data.meterVotes) {
      const validVotes = filterValid(data.meterVotes)
      await safeCreateMany('meterVote', validVotes, 'meter votes')
    }

    if (data.watched) {
      const validWatched = filterValid(data.watched)
      await safeCreateMany('watched', validWatched, 'watched history')
    }

    if (data.collections) {
      const validCollections = filterValid(data.collections)
      await safeCreateMany('collection', validCollections, 'collections')
    }

    console.log('🎉 Restoration complete!')
  } catch (error) {
    console.error('❌ Restoration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

restore()
