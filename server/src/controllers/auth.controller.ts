// Load environment variables (in case module was cached before dotenv loaded)
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

import { Request, Response } from 'express'
import { userService } from '../services/user.service'
import { registerSchema, loginSchema } from '../validators/user.validator'

const COOKIE_NAME = 'sb_session'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const validated = registerSchema.parse(req.body)
      const { email, password, name } = validated
      const user = await userService.signup(email, password, name)
      res.status(201).json(user)
    } catch (e: any) {
      if (e?.message === 'EMAIL_TAKEN' || e?.message === 'INVALID_EMAIL') {
        return res.status(400).json({
          error: e.message === 'INVALID_EMAIL' 
            ? 'Only BU email addresses (@bu.edu) are allowed'
            : 'Email already registered',
        })
      }
      if (e.name === 'ZodError') {
        return res.status(400).json({ error: e.errors[0].message })
      }
      res.status(400).json({ error: 'Invalid request' })
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const validated = loginSchema.parse(req.body)
      const { email, password } = validated
      const { token, user } = await userService.login(email, password)
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      })
      res.status(200).json({ ok: true, user })
    } catch (e: any) {
      if (e.name === 'ZodError') {
        return res.status(400).json({ error: e.errors[0].message })
      }
      res.status(401).json({ error: 'Invalid credentials' })
    }
  },

  googleOAuth: async (req: Request, res: Response) => {
    console.log('🚨🚨🚨 CONTROLLER FUNCTION CALLED - FIRST LINE 🚨🚨🚨')
    console.log('\n🔵 ===== CONTROLLER: googleOAuth() called =====')
    try {
      const { code, redirectUri } = req.body
      if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' })
      }

      // Reload dotenv to ensure variables are available (handles module caching)
      const envPath = path.resolve(__dirname, '../../.env')
      console.log('🔵 Controller - Reloading dotenv from:', envPath)
      const dotenvResult = dotenv.config({ path: envPath })
      console.log('🔵 Controller - dotenv.config result:', {
        error: dotenvResult.error?.message || 'none',
        parsed: dotenvResult.parsed ? Object.keys(dotenvResult.parsed).length + ' keys' : 'none'
      })

      const finalRedirectUri = redirectUri || CORS_ORIGIN
      
      // Check environment variables BEFORE and AFTER reload
      console.log('🔵 Controller - Before reading GOOGLE_CLIENT_ID:')
      console.log('   GOOGLE keys in process.env:', Object.keys(process.env).filter(k => k.includes('GOOGLE')))
      
      const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
      const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
      
      console.log('🔵 Controller - After reading variables:')
      console.log('   GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? `Found (${GOOGLE_CLIENT_ID.length} chars)` : '❌ MISSING')
      console.log('   GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? `Found (${GOOGLE_CLIENT_SECRET.length} chars)` : '❌ MISSING')
      
      console.log('🔵 Controller - Google OAuth request:', { 
        hasCode: !!code, 
        redirectUri: finalRedirectUri,
        clientId: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'undefined'
      })

      console.log('🔵 Controller - Calling userService.loginWithGoogle()...')
      const { token, user } = await userService.loginWithGoogle(code, finalRedirectUri)
      console.log('🔵 Controller - userService.loginWithGoogle() succeeded!')
      
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      })
      
      res.status(200).json({ ok: true, user })
    } catch (e: any) {
      console.error('\n🔴 ===== CONTROLLER ERROR =====')
      console.error('🔴 Error message:', e.message)
      console.error('🔴 Error stack:', e.stack?.substring(0, 500))
      console.error('🔴 ============================\n')
      if (e?.message === 'INVALID_EMAIL') {
        return res.status(400).json({ 
          error: 'Only BU email addresses (@bu.edu) are allowed for Google sign-in' 
        })
      }
      if (e?.message === 'REDIRECT_URI_MISMATCH') {
        return res.status(400).json({ 
          error: 'Redirect URI mismatch. Please check Google Cloud Console settings.' 
        })
      }
      if (e?.message === 'INVALID_TOKEN' || e?.message === 'Google OAuth not configured') {
        return res.status(400).json({ error: e.message })
      }
      res.status(401).json({ error: 'Google authentication failed: ' + (e.message || 'Unknown error') })
    }
  },

  me: async (req: Request, res: Response) => {
    try {
      const jwt = require('jsonwebtoken')
      const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
      const token = req.cookies?.[COOKIE_NAME]
      if (!token) return res.json({ user: null })
      const { userId } = jwt.verify(token, JWT_SECRET) as any
      const user = await userService.getPublicUser(userId)
      res.json({ user })
    } catch {
      res.json({ user: null })
    }
  },

  logout: async (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, { path: '/' })
    res.status(200).json({ ok: true })
  },
}
