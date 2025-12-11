import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { adminUserService } from '../services/adminUser.service'

export const adminUserController = {
  list: async (_req: AuthRequest, res: Response) => {
    try {
      const users = await adminUserService.listUsers()
      res.json(users)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to fetch users' })
    }
  },

  getById: async (req: AuthRequest, res: Response) => {
    try {
      const user = await adminUserService.getUserDetails(req.params.id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json(user)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to fetch user details' })
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      await adminUserService.deleteUserAndData(req.params.id)
      res.json({ success: true })
    } catch (e: any) {
      if (e.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' })
      }
      res.status(400).json({ error: e.message || 'Failed to delete user' })
    }
  },
}
