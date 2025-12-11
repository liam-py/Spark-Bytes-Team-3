import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { feedbackService } from '../services/feedback.service'
import { createFeedbackSchema } from '../validators/feedback.validator'

export const feedbackController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const validated = createFeedbackSchema.parse(req.body)
      const feedback = await feedbackService.createFeedback(req.userId, validated)
      res.status(201).json(feedback)
    } catch (e: any) {
      if (e.name === 'ZodError') {
        return res.status(400).json({ error: e.errors[0].message })
      }
      if (e.message === 'NOT_RESERVED') {
        return res.status(403).json({ error: 'You can only leave feedback for events you reserved' })
      }
      if (e.message === 'FEEDBACK_EXISTS') {
        return res.status(409).json({ error: 'You have already left feedback for this event' })
      }
      if (e.message === 'INVALID_RATING') {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' })
      }
      res.status(400).json({ error: e.message || 'Failed to create feedback' })
    }
  },

  getByEvent: async (req: AuthRequest, res: Response) => {
    try {
      const { eventId } = req.params
      const feedbacks = await feedbackService.getEventFeedback(eventId)
      res.json(feedbacks)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to get feedback' })
    }
  },
}

