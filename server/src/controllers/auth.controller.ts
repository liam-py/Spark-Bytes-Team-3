import { Request, Response } from 'express'
import { userService } from '../services/user.service'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const COOKIE_NAME = 'sb_session'

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body
      const user = await userService.signup(email, password, name)
      res.status(201).json(user)
    } catch (e: any) {
      if (e?.message === 'EMAIL_TAKEN') return res.status(409).json({ error: 'Email already registered' })
      res.status(400).json({ error: 'Invalid request' })
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const { token, user } = await userService.login(email, password)
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // 部署到 HTTPS 改 true
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      })
      res.status(200).json({ ok: true, user })
    } catch {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  },

  me: async (req: Request, res: Response) => {
    try {
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
