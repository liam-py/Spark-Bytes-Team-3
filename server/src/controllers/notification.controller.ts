import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { notificationService } from '../services/notification.service'

export const notificationController = {
  updatePreferences: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const { enabled } = req.body
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ error: 'enabled must be a boolean' })
      }
      await notificationService.updateNotificationPreference(req.userId, enabled)
      res.json({ message: 'Notification preferences updated', enabled })
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to update preferences' })
    }
  },
}

