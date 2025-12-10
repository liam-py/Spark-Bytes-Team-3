import { Router } from 'express'
import { reservationController } from '../controllers/reservation.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'

const router = Router()

router.post('/', requireAuth, reservationController.create)
router.get('/', requireAuth, reservationController.getUserReservations)
router.delete('/admin/:id', requireAuth, requireAdmin, reservationController.adminCancel)
router.delete('/:id', requireAuth, reservationController.cancel)

export default router
