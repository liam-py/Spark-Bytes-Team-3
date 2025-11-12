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
  // Ensure dotenv is loaded (safety check - reloads in case of module caching)
  dotenv.config({ path: path.resolve(__dirname, '../../.env') })
  
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    // Debug logging to help diagnose issues
    console.error('getGoogleClient - Missing environment variables:', {
      hasClientId: !!GOOGLE_CLIENT_ID,
      hasClientSecret: !!GOOGLE_CLIENT_SECRET,
      googleEnvKeys: Object.keys(process.env).filter(k => k.includes('GOOGLE'))
    })
    return null
  }
  
  return new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CORS_ORIGIN)
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
    const user = await userRepo.findByEmail(email)
    if (!user) throw new Error('INVALID_CREDENTIALS')
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw new Error('INVALID_CREDENTIALS')
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
    return { token, user: publicUser }
  },

  async loginWithGoogle(code: string, redirectUri?: string) {
    const googleClient = getGoogleClient()  // Read env vars here, not at module load
    
    if (!googleClient) {
      throw new Error('Google OAuth not configured')
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID  // Read here for use below

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
}
