import { Router } from 'express'
import { organizerController } from '../controllers/organizer.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'

const router = Router()

// Request organizer status (any authenticated user)
router.post('/request', requireAuth, organizerController.request)

// Admin only routes
router.get('/pending', requireAuth, requireAdmin, organizerController.getPending)
router.post('/approve/:userId', requireAuth, requireAdmin, organizerController.approve)
router.post('/reject/:userId', requireAuth, requireAdmin, organizerController.reject)

export default router

