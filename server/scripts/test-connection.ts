/**
 * Test database connection
 * Usage: npm run test:db
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

async function testConnection() {
  console.log('Testing database connection...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'))
  
  try {
    const start = Date.now()
    await prisma.$connect()
    const connectTime = Date.now() - start
    
    console.log(`✓ Connected in ${connectTime}ms`)
    
    // Test a simple query
    const queryStart = Date.now()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    const queryTime = Date.now() - queryStart
    
    console.log(`✓ Query executed in ${queryTime}ms`)
    console.log('Result:', result)
    
    // Test if we can read from User table
    try {
      const userCount = await prisma.user.count()
      console.log(`✓ Can read from User table (${userCount} users)`)
    } catch (error: any) {
      console.warn('⚠ Could not read from User table:', error.message)
    }
    
    console.log('\n✅ Connection test passed!')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Connection test failed!')
    console.error('Error:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check if DATABASE_URL is set correctly in .env')
    console.error('2. Verify Supabase database is not paused')
    console.error('3. Try using direct connection (port 5432) instead of pooler (port 6543)')
    console.error('4. Add connection timeout: ?connect_timeout=10&pool_timeout=10')
    console.error('5. Check network/firewall settings')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
