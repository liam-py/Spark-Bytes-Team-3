import { Router } from 'express'
import { uploadController } from '../controllers/upload.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload.middleware'

const router = Router()

router.post('/', requireAuth, upload.single('image'), uploadController.upload)

export default router

