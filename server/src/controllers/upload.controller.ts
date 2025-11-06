import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { uploadService } from '../services/upload.service'

export const uploadController = {
  upload: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }
      const imagePath = uploadService.getImagePath(req.file.filename)
      res.json({ imagePath })
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to upload image' })
    }
  },
}

