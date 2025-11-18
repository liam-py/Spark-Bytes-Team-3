import { Router } from 'express'
import { eventController } from '../controllers/event.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { requireAdminOrOrganizer } from '../middleware/role.middleware'

const router = Router()

// Public routes
router.get('/', eventController.list)

// Protected routes - admins and organizers can create
router.post('/', requireAuth, requireAdminOrOrganizer, eventController.create)
// Get events created by the logged-in user (must come before /:id route)
router.get('/my/events', requireAuth, eventController.getMyEvents)

// Public route for getting single event (must come after /my/events)
router.get('/:id', eventController.getById)

// Anyone authenticated can update/delete if they're the creator or admin
router.put('/:id', requireAuth, eventController.update)
router.delete('/:id', requireAuth, eventController.delete)

export default router
