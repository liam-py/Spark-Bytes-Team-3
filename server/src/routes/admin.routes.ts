import { Router } from 'express'
import { adminUserController } from '../controllers/adminUser.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'

const router = Router()

router.get('/users', requireAuth, requireAdmin, adminUserController.list)
router.get('/users/:id', requireAuth, requireAdmin, adminUserController.getById)
router.delete('/users/:id', requireAuth, requireAdmin, adminUserController.delete)

export default router
