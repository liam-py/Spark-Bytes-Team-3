import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'
import { userController } from '../controllers/user.controller'

const router = Router()

router.delete('/:userId', requireAuth, requireAdmin, userController.deleteUser)

export default router
