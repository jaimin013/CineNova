import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  // Read seed data from JSON file
  const seedFilePath = path.join(__dirname, '../prisma/seed-data.json')
  const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf-8'))

  // Clear existing content
  await prisma.content.deleteMany({})
  console.log('Cleared existing content')

  // Insert seed data
  for (const item of seedData) {
    const content = await prisma.content.create({
      data: {
        title: item.title,
        description: item.description,
        type: item.type,
        posterUrl: item.posterUrl,
        backdropUrl: item.backdropUrl || item.posterUrl,
        rating: item.rating,
        genre: item.genre,
        releaseYear: item.releaseYear,
        duration: item.duration,
        section: item.section,
        platform: item.platform || null,
        featured: item.featured || false,
        casts: item.casts || null,
      },
    })
    console.log(`✓ Created: ${content.title}`)
  }

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
