import { Router } from 'express'
import { adminUserController } from '../controllers/adminUser.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { requireAdmin } from '../middleware/role.middleware'

const router = Router()

router.get('/', requireAuth, requireAdmin, adminUserController.listUsers)
router.get('/:id/details', requireAuth, requireAdmin, adminUserController.getUserDetails)
router.patch('/:id/role', requireAuth, requireAdmin, adminUserController.updateUserRole)
router.delete('/:id', requireAuth, requireAdmin, adminUserController.deleteUser)

export default router
