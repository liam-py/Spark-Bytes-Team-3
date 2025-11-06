import { Router } from 'express'
import { analyticsController } from '../controllers/analytics.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'

const router = Router()

router.get('/overview', requireAuth, requireAdmin, analyticsController.getOverview)

export default router

