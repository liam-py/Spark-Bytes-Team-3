import { Router } from 'express'
import { feedbackController } from '../controllers/feedback.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.post('/', requireAuth, feedbackController.create)
router.get('/event/:eventId', feedbackController.getByEvent)

export default router

