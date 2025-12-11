import { Router } from 'express'
import { dietaryController } from '../controllers/dietary.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.get('/', requireAuth, dietaryController.get)
router.put('/', requireAuth, dietaryController.update)

export default router

