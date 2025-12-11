import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { dietaryService } from '../services/dietary.service'
import { updateDietarySchema } from '../validators/dietary.validator'

export const dietaryController = {
  get: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const preferences = await dietaryService.getPreferences(req.userId)
      res.json(preferences || null)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to get preferences' })
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const validated = updateDietarySchema.parse(req.body)
      const preferences = await dietaryService.updatePreferences(req.userId, validated)
      res.json(preferences)
    } catch (e: any) {
      if (e.name === 'ZodError') {
        return res.status(400).json({ error: e.errors[0].message })
      }
      res.status(400).json({ error: e.message || 'Failed to update preferences' })
    }
  },
}

