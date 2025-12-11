import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { analyticsService } from '../services/analytics.service'

export const analyticsController = {
  getOverview: async (req: AuthRequest, res: Response) => {
    try {
      const overview = await analyticsService.getOverview()
      res.json(overview)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to get analytics' })
    }
  },
}

