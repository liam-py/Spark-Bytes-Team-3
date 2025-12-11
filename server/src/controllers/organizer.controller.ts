import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { organizerService } from '../services/organizer.service'

export const organizerController = {
  request: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      await organizerService.requestOrganizerStatus(req.userId)
      res.json({ message: 'Organizer status requested. Waiting for admin approval.' })
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to request organizer status' })
    }
  },

  approve: async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' })
      }
      await organizerService.approveOrganizer(userId)
      res.json({ message: 'Organizer approved successfully' })
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to approve organizer' })
    }
  },

  reject: async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' })
      }
      await organizerService.rejectOrganizer(userId)
      res.json({ message: 'Organizer request rejected' })
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to reject organizer' })
    }
  },

  getPending: async (req: AuthRequest, res: Response) => {
    try {
      const requests = await organizerService.getPendingRequests()
      res.json({ requests })
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to get pending requests' })
    }
  },
}

