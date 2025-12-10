// Load environment variables (in case module was cached before dotenv loaded)
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import { userRepo } from '../repositories/user.repo'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

// Lazy-load Google OAuth client (reads env vars when needed, not at module load)
// This ensures environment variables are available even if module loads before dotenv
function getGoogleClient(): OAuth2Client | null {
  console.log('\n🟢 ===== getGoogleClient() called =====')
  
  // Ensure dotenv is loaded (safety check - reloads in case of module caching)
  const envPath = path.resolve(__dirname, '../../.env')
  console.log('🟢 getGoogleClient - Loading .env from:', envPath)
  
  const dotenvResult = dotenv.config({ path: envPath })
  console.log('🟢 getGoogleClient - dotenv.config result:', {
    error: dotenvResult.error?.message || 'none',
    parsed: dotenvResult.parsed ? Object.keys(dotenvResult.parsed).length + ' keys parsed' : 'none'
  })
  
  // Check what's in process.env BEFORE reading
  const googleKeysBefore = Object.keys(process.env).filter(k => k.includes('GOOGLE'))
  console.log('🟢 getGoogleClient - GOOGLE keys in process.env:', googleKeysBefore)
  
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  
  console.log('🟢 getGoogleClient - Reading variables:')
  console.log('   GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? `✅ Found (${GOOGLE_CLIENT_ID.length} chars, starts with: ${GOOGLE_CLIENT_ID.substring(0, 10)}...)` : '❌ MISSING')
  console.log('   GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? `✅ Found (${GOOGLE_CLIENT_SECRET.length} chars, starts with: ${GOOGLE_CLIENT_SECRET.substring(0, 10)}...)` : '❌ MISSING')
  
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('\n🔴 ===== getGoogleClient ERROR =====')
    console.error('🔴 Missing environment variables!')
    console.error('   GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? 'Found' : '❌ MISSING')
    console.error('   GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? 'Found' : '❌ MISSING')
    console.error('   All GOOGLE keys in process.env:', Object.keys(process.env).filter(k => k.includes('GOOGLE')))
    console.error('   Total env vars:', Object.keys(process.env).length)
    console.error('🔴 ===================================\n')
    return null
  }
  
  console.log('🟢 getGoogleClient - Creating OAuth2Client...')
  const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CORS_ORIGIN)
  console.log('🟢 getGoogleClient - ✅ OAuth2Client created successfully!')
  console.log('🟢 ======================================\n')
  
  return client
}

export const userService = {
  async signup(email: string, password: string, name?: string) {
    // Validate BU email
    if (!email.endsWith('@bu.edu')) {
      throw new Error('INVALID_EMAIL')
    }

    const exist = await userRepo.findByEmail(email)
    if (exist) throw new Error('EMAIL_TAKEN')
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await userRepo.create({ email, name, passwordHash })
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    }
  },

  async login(email: string, password: string) {
    try {
      const user = await userRepo.findByEmail(email)
      if (!user) {
        console.log(`[LOGIN] User not found for email: ${email}`)
        throw new Error('INVALID_CREDENTIALS')
      }
      console.log(`[LOGIN] User found: ${user.email}, role: ${user.role}`)
      
      const ok = await bcrypt.compare(password, user.passwordHash)
      if (!ok) {
        console.log(`[LOGIN] Password mismatch for email: ${email}`)
        throw new Error('INVALID_CREDENTIALS')
      }
      console.log(`[LOGIN] Password verified for email: ${email}`)
      
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      const publicUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isOrganizer: user.isOrganizer,
      }
      console.log(`[LOGIN] Successfully logged in user: ${user.email}`)
      return { token, user: publicUser }
    } catch (error: any) {
      // Re-throw INVALID_CREDENTIALS as-is
      if (error.message === 'INVALID_CREDENTIALS') {
        throw error
      }
      // Log database connection errors separately
      console.error('[LOGIN] Database error during login:', {
        message: error.message,
        code: error.code,
        name: error.name,
        email: email
      })
      // Re-throw as a more specific error for database issues
      // P1001: Can't reach database server
      // P1002: Database server doesn't accept connections
      // P1003: Database does not exist
      // P2024: Connection pool timeout
      if (error.code === 'P1001' || error.code === 'P1002' || error.code === 'P1003' || error.code === 'P2024' || error.message?.includes('connection')) {
        throw new Error('DATABASE_CONNECTION_ERROR')
      }
      throw new Error('INVALID_CREDENTIALS')
    }
  },

  async loginWithGoogle(code: string, redirectUri?: string) {
    console.log('\n🟡 ===== loginWithGoogle() called =====')
    console.log('🟡 Parameters:', { 
      hasCode: !!code, 
      codeLength: code?.length || 0,
      redirectUri: redirectUri || 'not provided'
    })
    
    console.log('🟡 Calling getGoogleClient()...')
    const googleClient = getGoogleClient()  // Read env vars here, not at module load
    
    if (!googleClient) {
      console.error('🟡 ❌ getGoogleClient() returned null - throwing error')
      throw new Error('Google OAuth not configured')
    }
    
    console.log('🟡 ✅ getGoogleClient() returned OAuth2Client successfully')
    
    // Reload dotenv again before reading for use in the function
    dotenv.config({ path: path.resolve(__dirname, '../../.env') })
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID  // Read here for use below
    console.log('🟡 GOOGLE_CLIENT_ID for verification:', GOOGLE_CLIENT_ID ? `Found (${GOOGLE_CLIENT_ID.length} chars)` : '❌ MISSING')

    try {
      // Use the provided redirectUri or default to CORS_ORIGIN
      const finalRedirectUri = redirectUri || CORS_ORIGIN
      
      console.log('Exchanging code for tokens...', { 
        codeLength: code.length,
        redirectUri: finalRedirectUri,
        clientId: GOOGLE_CLIENT_ID?.substring(0, 30) + '...'
      })
      
      // Exchange authorization code for tokens
      const { tokens } = await googleClient.getToken({
        code,
        redirect_uri: finalRedirectUri,
      })
      
      console.log('Token exchange result:', { 
        hasIdToken: !!tokens.id_token,
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token
      })
      
      if (!tokens.id_token) {
        console.error('No ID token in response. Tokens:', Object.keys(tokens))
        throw new Error('INVALID_TOKEN')
      }

      // Verify the ID token
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      })
      const payload = ticket.getPayload()
      
      console.log('Token payload:', { email: payload?.email, name: payload?.name })
      
      if (!payload || !payload.email) {
        console.error('Invalid payload or no email')
        throw new Error('INVALID_TOKEN')
      }

      const email = payload.email
      const name = payload.name || undefined

      // Validate BU email
      if (!email.endsWith('@bu.edu')) {
        throw new Error('INVALID_EMAIL')
      }

      // Check if user exists
      let user = await userRepo.findByEmail(email)
      
      // Create user if doesn't exist (Google OAuth users don't need password)
      if (!user) {
        // Generate a random password hash (won't be used for Google OAuth users)
        const passwordHash = await bcrypt.hash(Math.random().toString(36), 10)
        user = await userRepo.create({ email, name, passwordHash })
      } else if (name && !user.name) {
        // Update name if not set
        await userRepo.update(user.id, { name })
        user = await userRepo.findById(user.id)
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user!.id, email: user!.email, role: user!.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      const publicUser = {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        role: user!.role,
        isOrganizer: user!.isOrganizer,
      }

      return { token, user: publicUser }
    } catch (error: any) {
      console.error('Google OAuth error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        stack: error.stack?.substring(0, 500)
      })
      
      if (error.message === 'INVALID_EMAIL') {
        throw error
      }
      if (error.message?.includes('redirect_uri_mismatch') || error.code === 'redirect_uri_mismatch') {
        throw new Error('REDIRECT_URI_MISMATCH: The redirect URI must match exactly. Check Google Cloud Console settings.')
      }
      if (error.response?.data) {
        console.error('Google API error response:', error.response.data)
      }
      throw new Error('INVALID_TOKEN: ' + (error.message || 'Unknown error'))
    }
  },

  async getPublicUser(id: string) {
    return userRepo.findByIdPublic(id)
  },

  async deleteUser(targetUserId: string, requesterId: string) {
    if (targetUserId === requesterId) {
      throw new Error('CANNOT_DELETE_SELF')
    }

    const target = await userRepo.findById(targetUserId)
    if (!target) {
      throw new Error('NOT_FOUND')
    }

    // For safety, don't allow deleting other admins via this endpoint
    if (target.role === 'ADMIN') {
      throw new Error('CANNOT_DELETE_ADMIN')
    }

    const result = await userRepo.deleteCascade(targetUserId)
    if (!result) {
      throw new Error('NOT_FOUND')
    }
    return result
  },
}
