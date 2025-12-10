/**
 * Diagnostic script to check environment variables and database connectivity
 * Usage: npm run check:env
 * or: npx tsx scripts/check-env.ts
 */

// Load environment variables FIRST
import dotenv from 'dotenv'
import path from 'path'

const envPath = path.resolve(__dirname, '../.env')
console.log('Loading .env from:', envPath)
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error('❌ Error loading .env file:', result.error.message)
  console.error('   Make sure .env file exists in the server directory')
} else {
  console.log('✅ .env file loaded successfully')
  console.log(`   Found ${Object.keys(result.parsed || {}).length} environment variables\n`)
}

// Check required environment variables
console.log('=== Environment Variables Check ===\n')

const requiredVars = {
  'DATABASE_URL': {
    required: true,
    description: 'PostgreSQL connection string',
    check: (val: string) => {
      if (!val) return { ok: false, message: 'Missing' }
      if (!val.startsWith('postgresql://')) {
        return { ok: false, message: 'Should start with postgresql://' }
      }
      // Check for important connection parameters
      const hasTimeout = val.includes('connect_timeout') || val.includes('pool_timeout')
      const hasSsl = val.includes('sslmode')
      return { 
        ok: true, 
        message: hasTimeout && hasSsl ? 'Valid (with timeouts and SSL)' : 'Valid (but missing recommended parameters)' 
      }
    }
  },
  'JWT_SECRET': {
    required: true,
    description: 'Secret key for JWT token signing',
    check: (val: string) => {
      if (!val) return { ok: false, message: 'Missing' }
      if (val === 'dev-secret' || val.length < 16) {
        return { ok: true, message: 'Set (but using weak/default secret - not recommended for production)' }
      }
      return { ok: true, message: 'Set (strong secret)' }
    }
  },
  'PORT': {
    required: false,
    description: 'Server port',
    check: (val: string) => {
      if (!val) return { ok: true, message: 'Not set (will default to 4000)' }
      const port = parseInt(val)
      if (isNaN(port) || port < 1 || port > 65535) {
        return { ok: false, message: 'Invalid port number' }
      }
      return { ok: true, message: `Set to ${port}` }
    }
  },
  'CORS_ORIGIN': {
    required: false,
    description: 'CORS allowed origin',
    check: (val: string) => {
      if (!val) return { ok: true, message: 'Not set (will default to http://localhost:3000)' }
      return { ok: true, message: `Set to ${val}` }
    }
  },
  'GOOGLE_CLIENT_ID': {
    required: false,
    description: 'Google OAuth Client ID',
    check: (val: string) => {
      if (!val) return { ok: true, message: 'Not set (Google OAuth will not work)' }
      return { ok: true, message: 'Set' }
    }
  },
  'GOOGLE_CLIENT_SECRET': {
    required: false,
    description: 'Google OAuth Client Secret',
    check: (val: string) => {
      if (!val) return { ok: true, message: 'Not set (Google OAuth will not work)' }
      return { ok: true, message: 'Set' }
    }
  },
  'RESEND_API_KEY': {
    required: false,
    description: 'Resend API key for email notifications',
    check: (val: string) => {
      if (!val) return { ok: true, message: 'Not set (email notifications will not work)' }
      if (!val.startsWith('re_')) {
        return { ok: false, message: 'Invalid format (should start with re_)' }
      }
      return { ok: true, message: 'Set' }
    }
  },
  'RESEND_FROM_EMAIL': {
    required: false,
    description: 'Email address to send from (optional, defaults to onboarding@resend.dev)',
    check: (val: string) => {
      if (!val) return { ok: true, message: 'Not set (will default to onboarding@resend.dev)' }
      return { ok: true, message: `Set to ${val}` }
    }
  }
}

let allOk = true

for (const [varName, config] of Object.entries(requiredVars)) {
  const value = process.env[varName]
  const checkResult = config.check(value || '')
  
  const status = checkResult.ok ? '✅' : '❌'
  const required = config.required ? '(REQUIRED)' : '(optional)'
  
  console.log(`${status} ${varName} ${required}`)
  console.log(`   Description: ${config.description}`)
  console.log(`   Status: ${checkResult.message}`)
  
  if (config.required && !checkResult.ok) {
    allOk = false
  }
  
  // Show masked value for sensitive variables
  if (value && (varName.includes('SECRET') || varName.includes('PASSWORD') || varName === 'DATABASE_URL')) {
    if (varName === 'DATABASE_URL') {
      // Mask password in connection string
      const masked = value.replace(/:([^:@]+)@/, ':****@')
      console.log(`   Value: ${masked.substring(0, 80)}...`)
    } else {
      console.log(`   Value: ${'*'.repeat(Math.min(value.length, 20))} (${value.length} chars)`)
    }
  }
  
  console.log()
}

// Test database connection if DATABASE_URL is set
async function testDatabase() {
  if (process.env.DATABASE_URL) {
    console.log('=== Database Connection Test ===\n')
    
    try {
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient({
        log: ['error'],
      })
      
      console.log('Attempting to connect to database...')
      const start = Date.now()
      await prisma.$connect()
      const connectTime = Date.now() - start
      console.log(`✅ Connected in ${connectTime}ms\n`)
      
      // Test a simple query
      console.log('Testing database query...')
      const queryStart = Date.now()
      const result = await prisma.$queryRaw`SELECT 1 as test`
      const queryTime = Date.now() - queryStart
      console.log(`✅ Query executed in ${queryTime}ms`)
      
      // Try to count users
      try {
        const userCount = await prisma.user.count()
        console.log(`✅ Can read from User table (${userCount} users found)`)
        
        // Try to find a user by email (test query)
        if (userCount > 0) {
          const testUser = await prisma.user.findFirst({
            select: { email: true, role: true }
          })
          if (testUser) {
            console.log(`   Sample user: ${testUser.email} (${testUser.role})`)
          }
        }
      } catch (error: any) {
        console.warn(`⚠️  Could not read from User table: ${error.message}`)
      }
      
      await prisma.$disconnect()
      console.log('\n✅ Database connection test passed!')
      return true
    } catch (error: any) {
      console.error('\n❌ Database connection test failed!')
      console.error(`Error: ${error.message}`)
      console.error(`Code: ${error.code || 'N/A'}`)
      console.error('\nTroubleshooting steps:')
      console.error('1. Verify DATABASE_URL is correct')
      console.error('2. Check if Supabase database is paused (free tier pauses after inactivity)')
      console.error('3. Verify network connectivity')
      console.error('4. Try using direct connection (port 5432) instead of pooler (port 6543)')
      console.error('5. Add connection timeouts: ?connect_timeout=10&pool_timeout=10')
      return false
    }
  } else {
    console.log('⚠️  Skipping database connection test (DATABASE_URL not set)\n')
    return true
  }
}

// Run the check
async function runCheck() {
  const dbOk = await testDatabase()
  const finalOk = allOk && dbOk
  
  // Summary
  console.log('\n=== Summary ===')
  if (finalOk) {
    console.log('✅ All required environment variables are set correctly')
    console.log('✅ Database connection is working')
    console.log('\nYour server should be able to handle login requests.')
  } else {
    console.log('❌ Some issues were found. Please fix them before running the server.')
    process.exit(1)
  }
}

runCheck().catch(error => {
  console.error('Fatal error running check:', error)
  process.exit(1)
})

