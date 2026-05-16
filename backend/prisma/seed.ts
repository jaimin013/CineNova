import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting safe, non-destructive seed...')

  // 1. Seed Platforms (using upsert to avoid duplicates and preserve existing)
  const platforms = [
    { name: 'netflix', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'jiohotstar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_Hotstar_logo.svg' },
    { name: 'prime', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg' },
  ]

  for (const p of platforms) {
    await prisma.platform.upsert({
      where: { name: p.name },
      update: { imageUrl: p.imageUrl },
      create: p,
    })
  }
  console.log('✅ Seeded Platforms')

  // 2. Seed Genres
  const genres = [
    'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Comedy', 
    'Horror', 'Fantasy', 'Animation', 'Superhero', 
    'Crime', 'Mystery', 'Romance', 'Documentary', 'Biography'
  ]

  for (const g of genres) {
    await prisma.genre.upsert({
      where: { name: g },
      update: {},
      create: { name: g },
    })
  }
  console.log('✅ Seeded Genres')

  // 3. Seed Sections
  const sections = [
    { name: 'Talk Of The Town', order: 1 },
    { name: "Editor's Pick Of The Week", order: 2 },
    { name: 'Most Interested', order: 3 },
    { name: "Don't Miss These on Netflix", order: 4 },
    { name: "Don't Miss These on JioHotstar", order: 5 },
    { name: 'Worth Watching on Prime', order: 6 },
  ]

  for (const s of sections) {
    await prisma.section.upsert({
      where: { name: s.name },
      update: { order: s.order },
      create: s,
    })
  }
  console.log('✅ Seeded Sections')

  // 4. Seed Content from JSON (Checking for existence to avoid duplicates)
  const seedFilePath = path.join(__dirname, '../prisma/seed-data.json')
  if (fs.existsSync(seedFilePath)) {
    const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf-8'))

    for (const item of seedData) {
      const existing = await prisma.content.findFirst({
        where: { title: item.title }
      })

      if (!existing) {
        await prisma.content.create({
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
            videoUrl: item.videoUrl,
            casts: item.casts || null,
          },
        })
        console.log(`✓ Created Content: ${item.title}`)
      } else {
        console.log(`⏩ Skipping existing Content: ${item.title}`)
      }
    }
  }

  console.log('🏁 Seed completed successfully! (No data was deleted)')
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
