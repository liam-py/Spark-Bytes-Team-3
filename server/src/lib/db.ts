import { PrismaClient } from '@prisma/client'

// Configure PrismaClient with connection pool settings for Supabase
// For Supabase pooler (port 6543), add ?pgbouncer=true to DATABASE_URL
// For direct connection (port 5432), use standard connection string
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['error', 'warn'] 
    : ['error'],
  errorFormat: 'pretty',
  // Connection timeout handling is done via DATABASE_URL parameters
  // Example: ?connect_timeout=10&pool_timeout=10&pgbouncer=true
})

// Test connection on startup
let isConnected = false

export async function connectDatabase() {
  if (isConnected) return
  
  try {
    // Test connection with a simple query
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    isConnected = true
    console.log('✓ Database connected successfully')
  } catch (error: any) {
    console.error('✗ Database connection failed:', error.message)
    throw error
  }
}

// Handle graceful shutdown
const cleanup = async () => {
  if (isConnected) {
    await prisma.$disconnect()
    isConnected = false
    console.log('Database disconnected')
  }
}

process.on('beforeExit', cleanup)
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

// Export connection status check
export function isDatabaseConnected() {
  return isConnected
}
