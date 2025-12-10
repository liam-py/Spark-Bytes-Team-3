import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { userService } from '../services/user.service'

export const userController = {
  deleteUser: async (req: AuthRequest, res: Response) => {
    const targetUserId = req.params.userId
    if (!targetUserId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    try {
      const result = await userService.deleteUser(targetUserId, req.userId!)
      return res.status(200).json({
        ok: true,
        deletedUser: result.user,
        stats: result.stats,
      })
    } catch (e: any) {
      if (e?.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' })
      }
      if (e?.message === 'CANNOT_DELETE_SELF') {
        return res.status(400).json({ error: 'You cannot delete your own account' })
      }
      if (e?.message === 'CANNOT_DELETE_ADMIN') {
        return res.status(403).json({ error: 'Admin users cannot be deleted through this endpoint' })
      }
      console.error('Error deleting user:', e)
      return res.status(500).json({ error: 'Failed to delete user' })
    }
  },
}
