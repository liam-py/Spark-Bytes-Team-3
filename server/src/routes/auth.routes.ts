import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
const r = Router()
r.post('/login', authController.login)
r.post('/register', authController.register)
r.post('/google', authController.googleOAuth)
r.get('/me', authController.me)
r.post('/logout', authController.logout)
export default r
