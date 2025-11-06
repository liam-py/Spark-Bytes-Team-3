import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { eventService } from '../services/event.service'
import { createEventSchema, updateEventSchema } from '../validators/event.validator'

export const eventController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const validated = createEventSchema.parse(req.body)
      const event = await eventService.createEvent(req.userId, {
        ...validated,
        startTime: new Date(validated.startTime),
        endTime: new Date(validated.endTime),
      })
      res.status(201).json(event)
    } catch (e: any) {
      if (e.name === 'ZodError') {
        return res.status(400).json({ error: e.errors[0].message })
      }
      if (e.message === 'UNAUTHORIZED') {
        return res.status(403).json({ error: 'Only verified organizers can create events' })
      }
      res.status(400).json({ error: e.message || 'Failed to create event' })
    }
  },

  getById: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params
      const event = await eventService.getEvent(id)
      if (!event) {
        return res.status(404).json({ error: 'Event not found' })
      }
      res.json(event)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to get event' })
    }
  },

  list: async (req: AuthRequest, res: Response) => {
    try {
      const { location, search, dietaryFilters } = req.query
      const filters: any = {}
      if (location) filters.location = location as string
      if (search) filters.search = search as string
      if (dietaryFilters) {
        filters.dietaryFilters = Array.isArray(dietaryFilters)
          ? dietaryFilters
          : [dietaryFilters as string]
      }
      const events = await eventService.listEvents(filters)
      res.json(events)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to list events' })
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const { id } = req.params
      const validated = updateEventSchema.parse(req.body)
      const updateData: any = { ...validated }
      if (validated.startTime) updateData.startTime = new Date(validated.startTime)
      if (validated.endTime) updateData.endTime = new Date(validated.endTime)
      const event = await eventService.updateEvent(id, req.userId, updateData)
      res.json(event)
    } catch (e: any) {
      if (e.name === 'ZodError') {
        return res.status(400).json({ error: e.errors[0].message })
      }
      if (e.message === 'UNAUTHORIZED') {
        return res.status(403).json({ error: 'Only event creator can edit this event' })
      }
      if (e.message === 'EVENT_NOT_FOUND') {
        return res.status(404).json({ error: 'Event not found' })
      }
      res.status(400).json({ error: e.message || 'Failed to update event' })
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const { id } = req.params
      await eventService.deleteEvent(id, req.userId)
      res.json({ message: 'Event deleted successfully' })
    } catch (e: any) {
      if (e.message === 'UNAUTHORIZED') {
        return res.status(403).json({ error: 'Only event creator can delete this event' })
      }
      if (e.message === 'EVENT_NOT_FOUND') {
        return res.status(404).json({ error: 'Event not found' })
      }
      res.status(400).json({ error: e.message || 'Failed to delete event' })
    }
  },
}

