import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function backup() {
  console.log('🔄 Starting full database backup...')

  try {
    const data = {
      users: await prisma.user.findMany(),
      admins: await prisma.admin.findMany(),
      content: await prisma.content.findMany(),
      sections: await prisma.section.findMany(),
      genres: await prisma.genre.findMany(),
      platforms: await prisma.platform.findMany(),
      editorsPickCategories: await prisma.editorsPickCategory.findMany(),
      reviews: await prisma.review.findMany(),
      meterVotes: await prisma.meterVote.findMany(),
      watched: await prisma.watched.findMany(),
      collections: await prisma.collection.findMany(),
    }

    const backupPath = path.join(__dirname, '../db-backup.json')
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2))

    console.log(`✅ Backup successful! Data saved to: ${backupPath}`)
    console.log(`📊 Statistics:`)
    console.log(`- Users: ${data.users.length}`)
    console.log(`- Content: ${data.content.length}`)
    console.log(`- Reviews: ${data.reviews.length}`)
  } catch (error) {
    console.error('❌ Backup failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

backup()
