import dotenv from 'dotenv'
import path from 'path'
import { PrismaClient } from '@prisma/client'

// Load .env from the backend directory
const envPath = path.join(__dirname, '../../.env')
dotenv.config({ path: envPath })

const rawConnectionString = process.env.DATABASE_URL

if (!rawConnectionString) {
  throw new Error('DATABASE_URL is not set in environment variables')
}

// Strip surrounding quotes and whitespace (just in case)
const connectionString = rawConnectionString.trim().replace(/^"|"$/g, '')

// Add stability parameters if they are not already there
let stableConnectionString = connectionString
if (!stableConnectionString.includes('connect_timeout')) {
  const separator = stableConnectionString.includes('?') ? '&' : '?'
  stableConnectionString += `${separator}connect_timeout=30&pool_timeout=30`
}

import logger from './logger'

logger.info('[Prisma] Using standard PrismaClient with stability parameters')

export const prisma = new PrismaClient({ 
  datasources: {
    db: {
      url: stableConnectionString
    }
  },
  log: ['error', 'warn']
})
