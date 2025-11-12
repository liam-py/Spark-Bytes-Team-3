import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
const r = Router()

// Add logging middleware for Google OAuth route to track if requests reach the route
r.post('/google', (req, res, next) => {
  console.log('\n🚨 ===== ROUTE: /auth/google POST request received =====')
  console.log('🚨 Request body:', { 
    hasCode: !!req.body?.code, 
    hasRedirectUri: !!req.body?.redirectUri,
    bodyKeys: Object.keys(req.body || {})
  })
  console.log('🚨 Calling authController.googleOAuth...')
  next()
}, authController.googleOAuth)

r.post('/login', authController.login)
r.post('/register', authController.register)
r.get('/me', authController.me)
r.post('/logout', authController.logout)
export default r
