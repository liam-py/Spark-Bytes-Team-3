import { Router } from 'express'
import { reservationController } from '../controllers/reservation.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.post('/', requireAuth, reservationController.create)
router.get('/', requireAuth, reservationController.getUserReservations)
router.delete('/:id', requireAuth, reservationController.cancel)

export default router

