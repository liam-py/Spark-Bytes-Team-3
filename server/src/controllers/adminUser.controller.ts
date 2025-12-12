import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { adminUserService } from '../services/adminUser.service'

export const adminUserController = {
  listUsers: async (_req: AuthRequest, res: Response) => {
    try {
      const users = await adminUserService.listUsers()
      res.json(users)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to list users' })
    }
  },

  getUserDetails: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params
      const user = await adminUserService.getUserDetails(id)
      res.json(user)
    } catch (e: any) {
      if (e.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' })
      }
      res.status(400).json({ error: e.message || 'Failed to get user details' })
    }
  },

  updateUserRole: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params
      const { role } = req.body || {}

      if (!role) {
        return res.status(400).json({ error: 'Role is required' })
      }

      const updatedUser = await adminUserService.updateUserRole(id, role)
      res.json(updatedUser)
    } catch (e: any) {
      if (e.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' })
      }
      if (e.message === 'LAST_ADMIN') {
        return res.status(400).json({ error: 'Cannot remove the last admin user' })
      }
      if (e.message === 'INVALID_ROLE') {
        return res.status(400).json({ error: 'Invalid role' })
      }
      res.status(400).json({ error: e.message || 'Failed to update user role' })
    }
  },

  deleteUser: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params
      await adminUserService.deleteUser(id)
      res.json({ message: 'User deleted successfully' })
    } catch (e: any) {
      if (e.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' })
      }
      if (e.message === 'LAST_ADMIN') {
        return res.status(400).json({ error: 'Cannot delete the last admin user' })
      }
      res.status(400).json({ error: e.message || 'Failed to delete user' })
    }
  },
}
