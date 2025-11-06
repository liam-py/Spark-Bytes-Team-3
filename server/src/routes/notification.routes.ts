import { Router } from 'express'
import { notificationController } from '../controllers/notification.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.put('/preferences', requireAuth, notificationController.updatePreferences)

export default router

