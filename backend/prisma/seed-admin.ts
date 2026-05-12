import { prisma } from '../src/utils/prisma'
import { hashPassword } from '../src/utils/password'

async function seedAdmin() {
  try {
    console.log('🌱 Seeding default admin account...')

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst()
    if (existingAdmin) {
      console.log('✅ Admin account already exists')
      process.exit(0)
    }

    // Hash password
    const hashedPassword = await hashPassword('Admin@1234')

    // Create default admin
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@cinerenova.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'admin',
      },
    })

    console.log('✅ Default admin created successfully!')
    console.log('📋 Admin Details:')
    console.log(`   Email: ${admin.email}`)
    console.log(`   Password: Admin@1234`)
    console.log(`   Important: Change this password immediately after first login!`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()
