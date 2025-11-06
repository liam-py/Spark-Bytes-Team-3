import { Router } from 'express'
import { eventController } from '../controllers/event.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { requireAdminOrOrganizer } from '../middleware/role.middleware'

const router = Router()

// Public routes
router.get('/', eventController.list)
router.get('/:id', eventController.getById)

// Protected routes - admins and organizers can create
router.post('/', requireAuth, requireAdminOrOrganizer, eventController.create)
// Anyone authenticated can update/delete if they're the creator or admin
router.put('/:id', requireAuth, eventController.update)
router.delete('/:id', requireAuth, eventController.delete)

export default router
