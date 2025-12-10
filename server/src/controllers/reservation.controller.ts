import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { reservationService } from '../services/reservation.service'
import { createReservationSchema } from '../validators/reservation.validator'
import { userRepo } from '../repositories/user.repo'

export const reservationController = {
  create: async (req: AuthRequest, res: Response) => {
    console.log("REQ BODY:", req.body);
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      
      // Check if user is admin - admins cannot reserve
      const user = await userRepo.findById(req.userId)
      if (user?.role === 'ADMIN') {
        return res.status(403).json({ error: 'Admins cannot reserve food. Please use a student account.' })
      }
      
      const validated = createReservationSchema.parse(req.body)
      const reservation = await reservationService.createReservation(req.userId, validated)
      res.status(201).json(reservation)
    } catch (e: any) {
      if (e.name === 'ZodError') {
        return res.status(400).json({ error: e.errors[0].message })
      }
      if (e.message === 'ALREADY_RESERVED') {
        return res.status(409).json({ error: 'You have already reserved food from this event' })
      }
      if (e.message === 'EVENT_NOT_FOUND') {
        return res.status(404).json({ error: 'Event not found' })
      }
      if (e.message === 'FOOD_ITEM_NOT_FOUND') {
        return res.status(404).json({ error: 'Food item not found' })
      }
      if (e.message === 'INSUFFICIENT_QUANTITY' || e.message === 'NO_AVAILABLE_FOOD') {
        return res.status(400).json({ error: 'No food available. Reservations closed.' })
      }
      if (e.message === 'CANNOT_RESERVE_OWN_EVENT') {
        return res.status(403).json({ error: 'You cannot reserve food from your own event.' })
      }
      res.status(400).json({ error: e.message || 'Failed to create reservation' })
    }
  },

  getUserReservations: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      
      // Admins don't have reservations
      const user = await userRepo.findById(req.userId)
      if (user?.role === 'ADMIN') {
        return res.json([])
      }
      
      const reservations = await reservationService.getUserReservations(req.userId)
      res.json(reservations)
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to get reservations' })
    }
  },

  cancel: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const { id } = req.params
      await reservationService.cancelReservation(id, req.userId)
      res.json({ message: 'Reservation cancelled successfully' })
    } catch (e: any) {
      if (e.message === 'RESERVATION_NOT_FOUND') {
        return res.status(404).json({ error: 'Reservation not found' })
      }
      if (e.message === 'UNAUTHORIZED') {
        return res.status(403).json({ error: 'You can only cancel your own reservations' })
      }
      res.status(400).json({ error: e.message || 'Failed to cancel reservation' })
    }
  },

  adminCancel: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const { id } = req.params
      await reservationService.cancelReservationAsAdmin(id)
      res.json({ message: 'Reservation cancelled successfully' })
    } catch (e: any) {
      if (e.message === 'RESERVATION_NOT_FOUND') {
        return res.status(404).json({ error: 'Reservation not found' })
      }
      res.status(400).json({ error: e.message || 'Failed to cancel reservation' })
    }
  },
}
